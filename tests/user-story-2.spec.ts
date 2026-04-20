import { test, expect } from '@playwright/test';

test('User Story 2: Add three new clothing items to catalogue', async ({ request }) => {
  const newProducts = [
    { title: 'Unique Shirt 1', price: 29.99, description: 'A unique shirt', image: 'https://i.pravatar.cc', category: 'clothing' },
    { title: 'Unique Pants 2', price: 49.99, description: 'Unique pants', image: 'https://i.pravatar.cc', category: 'clothing' },
    { title: 'Unique Jacket 3', price: 79.99, description: 'Unique jacket', image: 'https://i.pravatar.cc', category: 'clothing' }
  ];

  const addedIds: number[] = [];
  const addedTitles: string[] = [];

  for (const product of newProducts) {
    const response = await request.post('https://fakestoreapi.com/products', {
      data: product
    });
    expect(response.ok()).toBeTruthy();
    const addedProduct = await response.json();
    expect(addedProduct.id).toBeDefined();
    expect(addedProduct.title).toBe(product.title);

    // Check unique id and title
    expect(addedIds).not.toContain(addedProduct.id);
    expect(addedTitles).not.toContain(addedProduct.title);

    addedIds.push(addedProduct.id);
    addedTitles.push(addedProduct.title);
  }

  // Verify newly added items are visible in product listing
  const productsResponse = await request.get('https://fakestoreapi.com/products');
  expect(productsResponse.ok()).toBeTruthy();
  const allProducts = await productsResponse.json();

  for (const id of addedIds) {
    const product = allProducts.find((p: any) => p.id === id);
    expect(product).toBeDefined();
    expect(product.category).toBe('clothing');
  }
});