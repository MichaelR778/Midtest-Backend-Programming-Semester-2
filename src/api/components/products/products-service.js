const productsRepository = require('./products-repository');

/**
 * Get list of products
 * @returns {Array}
 */
async function getProducts() {
  const products = await productsRepository.getProducts();
  const results = [];

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
    });
  }
  return results;
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} brand - Brand
 * @param {number} price - Price
 * @returns {boolean}
 */
async function createProduct(name, brand, price) {
  try {
    await productsRepository.createProduct(name, brand, price);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await productsRepository.getProduct(id);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Change product price
 * @param {string} productId - Product ID
 * @param {number} new_price - New price
 * @returns {boolean}
 */
async function updatePrice(productId, new_price) {
  const product = await productsRepository.getProduct(productId);

  // Check if product not found
  if (!product) {
    return null;
  }

  const updateSuccess = await productsRepository.updatePrice(
    productId,
    new_price
  );

  if (!updateSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updatePrice,
};
