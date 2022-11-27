export const AdapterMockGenerator = (name: string) => ({
  name,
  getPrice: jest.fn(),
});
