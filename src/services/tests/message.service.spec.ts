import MessageService from '../message.service';
describe('Message service Tests', () => {
  let messageService: MessageService;
  beforeEach(() => {
    messageService = new MessageService();
  });
  describe('getExchanges function', () => {
    test('to be defined', () => {
      expect(messageService.getExchanges).toBeDefined();
      expect(messageService.getExchanges).not.toBeUndefined();
    });
    test('get value', () => {
      console.log(messageService.getExchanges());
    });
  });
});
