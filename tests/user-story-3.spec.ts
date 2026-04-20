import { test, expect } from '@playwright/test';

test('User Story 3: Delete product with lowest rating', async ({ request }) => {
  // Get all products
  const productsResponse = await request.get('https://fakestoreapi.com/products');
  expect(productsResponse.ok()).toBeTruthy();
  const products = await productsResponse.json();
  expect(products.length).toBeGreaterThan(0);

  // Find product with lowest rating
  const lowestRated = products.reduce((min: any, p: any) => p.rating.rate < min.rating.rate ? p : min);
  const productId = lowestRated.id;

  // Delete the product
  const deleteResponse = await request.delete(`https://fakestoreapi.com/products/${productId}`);
  expect(deleteResponse.ok()).toBeTruthy();

  // Verify product no longer appears in listing
  const updatedProductsResponse = await request.get('https://fakestoreapi.com/products');
  expect(updatedProductsResponse.ok()).toBeTruthy();
  const updatedProducts = await updatedProductsResponse.json();
  const deletedProduct = updatedProducts.find((p: any) => p.id === productId);
  expect(deletedProduct).toBeUndefined();

  // Verify retrieving deleted product returns 404
  const getDeletedResponse = await request.get(`https://fakestoreapi.com/products/${productId}`);
  expect(getDeletedResponse.status()).toBe(404);
});