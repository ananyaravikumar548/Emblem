import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./lib/exportEngine', () => ({
  exportBrandKitZip: jest.fn()
}));

beforeEach(() => {
  global.fetch = jest.fn(async (url) => {
    if (String(url).endsWith('/auth/me')) return { ok: true, json: async () => ({ user: { id: 'test-user' } }) };
    if (String(url).endsWith('/brand')) return { ok: true, json: async () => ({ brands: [] }) };
    return { ok: false };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the EMBLEM brand workspace', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /build a brand that means business/i })).toBeInTheDocument();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/brand$/), expect.any(Object)));
});
