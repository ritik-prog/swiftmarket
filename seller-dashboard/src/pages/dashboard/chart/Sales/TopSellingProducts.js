import React from 'react';

const TopSellingProducts = () => {
    // Mock data for the top-selling products
    const topSellingProducts = [
        { name: 'Product A', quantity: 100, revenue: 2000 },
        { name: 'Product B', quantity: 80, revenue: 1600 },
        { name: 'Product C', quantity: 60, revenue: 1200 },
        { name: 'Product D', quantity: 40, revenue: 800 },
        { name: 'Product E', quantity: 20, revenue: 400 },
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Top Selling Products</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Product</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topSellingProducts.map((product) => (
                            <tr key={product.name}>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.quantity}</td>
                                <td className="border px-4 py-2">{product.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopSellingProducts;
