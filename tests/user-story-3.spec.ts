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

  // Verify the new lowest rated product has a higher rating than the deleted item
  const remainingProducts = updatedProducts.filter((p: any) => p.id !== productId);
  const newLowestRated = remainingProducts.reduce((min: any, p: any) => p.rating.rate < min.rating.rate ? p : min);
  expect(newLowestRated.rating.rate).toBeGreaterThanOrEqual(lowestRated.rating.rate);

  // Re-add the deleted product back to the store
  const restoreResponse = await request.post('https://fakestoreapi.com/products', {
    data: {
      title: lowestRated.title,
      price: lowestRated.price,
      description: lowestRated.description,
      image: lowestRated.image,
      category: lowestRated.category,
    },
  });
  expect(restoreResponse.ok()).toBeTruthy();
  const restoredProduct = await restoreResponse.json();
  expect(restoredProduct.id).toBeDefined();
  expect(restoredProduct.title).toBe(lowestRated.title);

  // Verify the reinstated item has the lowest rating in the store
  const finalProductsResponse = await request.get('https://fakestoreapi.com/products');
  expect(finalProductsResponse.ok()).toBeTruthy();
  const finalProducts = await finalProductsResponse.json();
  const finalLowestRated = finalProducts.reduce((min: any, p: any) => p.rating.rate < min.rating.rate ? p : min);
  expect(finalLowestRated.rating.rate).toBe(lowestRated.rating.rate);
});