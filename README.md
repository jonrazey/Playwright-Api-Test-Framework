# Playwright API Test Framework

API test automation framework using [Playwright](https://playwright.dev/) against the [FakeStoreAPI](https://fakestoreapi.com/).

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:ui` | Interactive test UI |
| `npm run test:debug` | Debug mode |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code |
| `npm run report` | View last HTML report |

Run a specific test file:

```bash
npx playwright test tests/user-story-1.spec.ts
```

## Test Coverage

| File | User Story |
|---|---|
| `tests/user-story-1.spec.ts` | View products, add cheapest electronics to cart |
| `tests/user-story-2.spec.ts` | Add three new clothing items to catalogue |
| `tests/user-story-3.spec.ts` | Delete product with lowest rating |

## Configuration

See `playwright.config.ts` for browser, parallelism, and reporter settings.