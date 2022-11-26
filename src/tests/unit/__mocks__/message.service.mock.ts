export const MessageServiceMockGenerator = () => ({
  replyAllExchanges: jest.fn(),
  replySelectedExchanges: jest.fn(),
  replyError: jest.fn(),
  replySelectedExchange: jest.fn(),
  replyRemovedExchange: jest.fn(),
  replyAlreadySelectedExchange: jest.fn(),
  replyNotSelectedExchange: jest.fn(),
  replyNotSelectedCurrency: jest.fn(),
  replyExchangeMessage: jest.fn(),
  replyCustomMessage: jest.fn(),
});
