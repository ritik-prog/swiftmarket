const { getAllUsers, createUser, updateUser, deleteUser, banUser } = require('./userFunctions');
const { getAllApplySellers, acceptSeller, getAllSellers, createSeller, updateSeller, deleteSeller } = require('./sellerFunctions');
const {
    getSellerProducts,
    getAllProductsOfSellerByUsername,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('./productFunctions');

module.exports = { getAllApplySellers, createSeller, acceptSeller, getAllUsers, createUser, updateUser, deleteUser, getAllSellers, updateSeller, deleteSeller, banUser };