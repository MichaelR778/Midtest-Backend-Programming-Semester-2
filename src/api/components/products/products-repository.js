const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} brand - Brand
 * @param {number} price - Price
 * @returns {Promise}
 */
async function createProduct(name, brand, price) {
  return Product.create({
    name,
    brand,
    price,
  });
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Update product price
 * @param {string} id - Product ID
 * @param {number} price - New price
 * @returns {Promise}
 */
async function updatePrice(id, price) {
  return Product.updateOne({ _id: id }, { $set: { price } });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updatePrice,
};
