import { test, expect } from '@playwright/test';

test('User Story 1: View products and add cheapest electronics to cart', async ({ request }) => {
  // Get all products
  const productsResponse = await request.get('https://fakestoreapi.com/products');
  expect(productsResponse.ok()).toBeTruthy();
  const products = await productsResponse.json();

  // Filter electronics products (assuming all are in stock as per API)
  const electronics = products.filter((p: any) => p.category === 'electronics');
  expect(electronics.length).toBeGreaterThan(0);

  // Find the cheapest electronics product
  const cheapest = electronics.reduce((min: any, p: any) => p.price < min.price ? p : min);
  const productId = cheapest.id;
  const expectedPrice = cheapest.price;
  const availableQuantity = cheapest.rating.count;

  // Add to cart
  const cartResponse = await request.post('https://fakestoreapi.com/carts', {
    data: {
      userId: 1,
      products: [{ productId, quantity: 1 }]
    }
  });
  expect(cartResponse.ok()).toBeTruthy();
  const cart = await cartResponse.json();

  // Verify cart contains the product with correct quantity
  expect(cart.products).toHaveLength(1);
  expect(cart.products[0].productId).toBe(productId);
  expect(cart.products[0].quantity).toBe(1);

  // Verify product price (fetch product details)
  const productResponse = await request.get(`https://fakestoreapi.com/products/${productId}`);
  expect(productResponse.ok()).toBeTruthy();
  const product = await productResponse.json();
  expect(product.price).toBe(expectedPrice);

  // Verify the added product belongs to the electronics category
  expect(product.category).toBe('electronics');

  // Verify the added product is cheaper or equal to the next cheapest electronics product
  const sortedElectronics = electronics.sort((a: any, b: any) => a.price - b.price);
  const nextCheapest = sortedElectronics[1];
  expect(product.price).toBeLessThanOrEqual(nextCheapest.price);

  // Verify available quantity has reduced by one after adding to cart
    // Note: FakeStoreAPI does not persist updates, so fetched quantity will be original
    // This assertion documents expected behavior for a real implementation
  expect(product.rating.count).toBe(availableQuantity - 1);
});