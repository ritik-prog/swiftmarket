from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.neighbors import NearestNeighbors
import pandas as pd
import pickle
import pymongo
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

# Declare a variable to use static data or MongoDB
use_mongodb = False

# Load static product data
product_data = [
    {
        "_id": "1",
        "productName": "Product 1",
        "productDescription": "This is the first product",
        "category": "Category 1",
        "tags": ["Tag 1", "Tag 2"],
        "ratings": [{"rating": 0}, {"rating": 2}],
        "featured": True,
        "likes": 10,
        "views": 10,
        "ratings_avg": 1.5
    },
    {
        "_id": "2",
        "productName": "Product 2",
        "productDescription": "This is the second product",
        "category": "Category 1",
        "tags": ["Tag 1", "Tag 3"],
        "ratings": [{"rating": 3}, {"rating": 4}],
        "featured": False,
        "likes": 20,
        "views": 500,
        "ratings_avg": 3.5
    },
    {
        "_id": "3",
        "productName": "Product 3",
        "productDescription": "This is the third product",
        "category": "Category 1",
        "tags": ["Tag 2", "Tag 3"],
        "ratings": [{"rating": 2}, {"rating": 3}],
        "featured": True,
        "likes": 15,
        "views": 150,
        "ratings_avg": 2.5
    }
]

if use_mongodb:
    # Load the product data from MongoDB
    # Replace this with your own code to load the data
    client = pymongo.MongoClient('mongodb://localhost:27017/')
    db = client['mydatabase']
    products = db['products']

    # Vectorize the product names and descriptions
    vectorizer = CountVectorizer(stop_words='english')

    product_names = []
    product_descriptions = []
    product_ids = []
    for product in products.find():
        product_names.append(product['productName'])
        product_descriptions.append(product['productDescription'])
        product_ids.append(str(product['_id']))

    X = vectorizer.fit_transform(product_names)

    # Train a KNN model
    n_neighbors = 5
    knn = NearestNeighbors(n_neighbors=n_neighbors,
                           algorithm='ball_tree').fit(X)

    # Save the vectorizer and KNN model to disk
    pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))
    pickle.dump(knn, open('model.pkl', 'wb'))
else:
    # Vectorize the product names and descriptions
    vectorizer = CountVectorizer(stop_words='english')

    product_names = []
    product_descriptions = []
    product_ids = []
    for i, product in enumerate(product_data):
        product_names.append(product['productName'] +
                             ' ' + product['productDescription'])
        product_ids.append(str(i))

    X = vectorizer.fit_transform(product_names)

    # Train a KNN model
    n_neighbors = 5
    knn = NearestNeighbors(n_neighbors=n_neighbors,
                           algorithm='ball_tree').fit(X)

    # Save the vectorizer and KNN model to disk
    pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))
    pickle.dump(knn, open('model.pkl', 'wb'))


# Define the training route for a single product
@app.route('/train', methods=['POST'])
def train():
    # Get the product details from the request
    product_name = request.json['productName']
    product_description = request.json['productDescription']
    category = request.json['category']
    tags = request.json['tags']
    ratings = request.json['ratings']
    featured = request.json['featured']
    likes = request.json['likes']
    views = request.json['views']

    # Extract the relevant fields for popularity prediction
    ratings_avg = 0
    ratings_count = 0
    for r in ratings:
        ratings_avg += r['rating']
        ratings_count += 1
    if ratings_count > 0:
        ratings_avg /= ratings_count

    # Update the MongoDB with the new product
    product = {
        'productName': product_name,
        'productDescription': product_description,
        'category': category,
        'tags': tags,
        'ratings_avg': ratings_avg,
        'featured': featured,
        'likes': likes,
        'views': views
    }
    products.insert_one(product)

    # Vectorize the product name and description
    X_new = vectorizer.transform([product_name + ' ' + product_description])

    # Update the KNN model with the new product
    knn.fit(X_new)

    # Save the updated KNN model to disk
    pickle.dump(knn, open('model.pkl', 'wb'))

    return 'OK'

# Define the training route for a CSV file


@app.route('/train_csv', methods=['POST'])
def train_csv():
    # Get the CSV file from the request
    file = request.files['file']

    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file)

    # Update the MongoDB with the new products
    for i, row in df.iterrows():
        product = {
            'productName': row['productName'],
            'productDescription': row['productDescription'],
            'category': row['category'],
            'tags': row['tags'],
            'ratings': row['ratings'],
            'featured': row['featured'],
            'likes': row['likes'],
            'views': row['views']
        }
        products.insert_one(product)

    # Vectorize the product names and descriptions
    X_new = vectorizer.transform(
        df['productName'] + ' ' + df['productDescription'])

    # Update the KNN model with the new products
    knn.fit

    # Save the updated KNN model to disk
    pickle.dump(knn, open('model.pkl', 'wb'))

    return 'OK'


@app.route('/predict_from_mongodb', methods=['POST'])
def predict_from_mongodb():
    # Get the category from the request
    category = request.get_json()['category']
    # Retrieve the products with the given category from the database
    products_cat = list(products.find({'category': category}))

    # Calculate the popularity score for each product
    popularity_scores = []
    for p in products_cat:
        score = 0
        if p['featured']:
            score += 2
        score += len(p['likes'])
        score += p['views']
        if p['ratings']:
            ratings_sum = sum(r['rating'] for r in p['ratings'])
            ratings_avg = ratings_sum / len(p['ratings'])
            score += ratings_avg * 10
        score += p['purchaseCount']
        popularity_scores.append(score)

    # Sort the products by their popularity score
    sorted_products = [x for _, x in sorted(
        zip(popularity_scores, products_cat), reverse=True)]

    # Return the top 10 most popular products
    return jsonify(sorted_products[:1])

# Define the prediction route


@app.route('/predict', methods=['POST'])
def predict():
    # Load the vectorizer and KNN model from disk
    vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
    knn = pickle.load(open('model.pkl', 'rb'))

    # Get the category from the request
    category = request.json['category']

    if use_mongodb:
        # Load the product data from MongoDB
        client = pymongo.MongoClient('mongodb://localhost:27017/')
        db = client['mydatabase']
        products = db['products']

        # Get the products in the specified category
        product_names = []
        product_descriptions = []
        product_ids = []
        for product in products.find({'category': category}):
            product_names.append(product['productName'])
            product_descriptions.append(product['productDescription'])
            product_ids.append(str(product['_id']))
        X = vectorizer.transform(product_names)

    else:
        # Get the products in the specified category
        product_names = []
        product_descriptions = []
        product_ids = []
        for i, product in enumerate(product_data):
            if product['category'] == category:
                product_names.append(product['productName'])
                product_descriptions.append(product['productDescription'])
                product_ids.append(str(i))
        X = vectorizer.transform(product_names)

    # Find the nearest neighbors for the query product
    n_neighbors = min(5, len(product_names))
    distances, indices = knn.kneighbors(X, n_neighbors=n_neighbors)

    # Get the product details for the nearest neighbors
    nearest_neighbors = []
    for i in range(len(product_names)):
        if i in indices:
            product_id = product_ids[i]
            product_name = product_names[i]
            product_description = product_descriptions[i]

            if use_mongodb:
                # Get the product details from MongoDB
                product = products.find_one({'_id': product_id})
                likes = product['likes']
                views = product['views']
                ratings = product['ratings_avg']
            else:
                # Get the product details from the static data
                likes = product_data[i]['likes']
                views = product_data[i]['views']
                ratings = product_data[i]['ratings_avg']

            nearest_neighbors.append({
                'productId': product_id,
                'productName': product_name,
                'productDescription': product_description,
                'likes': likes,
                'views': views,
                'ratings': ratings
            })

    # Sort the nearest neighbors by popularity
    nearest_neighbors = sorted(nearest_neighbors, key=lambda k: (
        k['likes'], k['views'], k['ratings']), reverse=True)

    # Return the top 1 products
    return jsonify(nearest_neighbors[:1])


if __name__ == '__main__':
    app.run(debug=False, port=8000, host='0.0.0.0')
