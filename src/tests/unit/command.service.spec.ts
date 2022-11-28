import CommandService from '../../services/command.service';
import { MessageServiceMockGenerator } from './__mocks__/message.service.mock';
import { HelperServiceMockGenerator } from './__mocks__/helper.service.mock';
import { LoggerServiceMockGenerator } from './__mocks__/logger.service.mock';
import { AdapterMockGenerator } from './__mocks__/adapter.mock';
import { Context } from 'telegraf';
import { IUser } from '../../db/types/user.db.types';
import MessagesEnum from '../../enums/messages.enum';

describe('CommandService', () => {
  let sut: CommandService;

  let messageService: ReturnType<typeof MessageServiceMockGenerator>;
  let helperService: ReturnType<typeof HelperServiceMockGenerator>;
  let logger: ReturnType<typeof LoggerServiceMockGenerator>;

  let testAdapter: ReturnType<typeof AdapterMockGenerator>;

  beforeEach(() => {
    messageService = MessageServiceMockGenerator();
    helperService = HelperServiceMockGenerator();
    logger = LoggerServiceMockGenerator();

    testAdapter = AdapterMockGenerator('test-adapter');
    sut = new CommandService(
      //@ts-ignore
      messageService,
      logger,
      [testAdapter],
      helperService,
    );
  });

  describe('#start', () => {
    let ctx: Context;
    beforeEach(() => {
      ctx = {
        get from() {
          return { username: 'test-name' };
        },
      } as Context;
    });
    describe('success', () => {
      it('should send welcome message', async () => {
        await sut.start(ctx);
        expect(messageService.replyCustomMessage).toHaveBeenCalledWith(
          ctx,
          'Welcome !',
        );
      });
    });
  });

  describe('#getPrice', () => {
    let ctx: Context;
    beforeEach(() => {
      ctx = {
        get from() {
          return {
            username: 'test-username',
          };
        },
        get message() {
          return {
            get from() {
              return { id: 1 };
            },
          };
        },
      } as Context;
    });

    describe('success', () => {
      let user: IUser;
      let currency: string;
      let price: number;

      beforeEach(() => {
        price = 10;
        currency = 'test-currency';

        user = {
          telegram_id: 12,
          user_name: 'test-user-name',
          user_lastname: 'test-user-last-name',
          telegram_name: 'test-tel-name',
          telegram_lang: 'en',
          is_bot: false,
          exchanges: [testAdapter.name],
        };
      });

      it('should return price of currency from selected exchange adapter', async () => {
        helperService.findUser.mockResolvedValueOnce(user);
        helperService.getArgumentFromCommand.mockReturnValueOnce(currency);
        testAdapter.getPrice.mockResolvedValueOnce(price);

        await sut.getPrice(ctx);
        expect(messageService.replyExchangeMessage).toHaveBeenCalledWith(
          ctx,
          testAdapter.name,
          `${price} USDT`,
        );
      });
    });

    describe('error', () => {
      let user: IUser;

      beforeEach(() => {
        user = {
          telegram_id: 12,
          user_name: 'test-user-name',
          user_lastname: 'test-user-last-name',
          telegram_name: 'test-tel-name',
          telegram_lang: 'en',
          is_bot: false,
          exchanges: [],
        };
      });

      it('should return not-selected-exchange message', async () => {
        helperService.findUser.mockResolvedValueOnce(user);

        await sut.getPrice(ctx);
        expect(messageService.replyNotSelectedExchange).toHaveBeenCalledWith(
          ctx,
        );
      });
      it('should return not-selected-currency message', async () => {
        user.exchanges.push(testAdapter.name);
        helperService.findUser.mockResolvedValueOnce(user);
        helperService.getArgumentFromCommand.mockReturnValueOnce(null);

        await sut.getPrice(ctx);
        expect(messageService.replyNotSelectedCurrency).toHaveBeenCalledWith(
          ctx,
        );
      });
      it('should return not-exists-currency-in-exchange message', async () => {
        user.exchanges.push(testAdapter.name);
        helperService.findUser.mockResolvedValueOnce(user);
        helperService.getArgumentFromCommand.mockReturnValueOnce(
          'some-currency',
        );
        testAdapter.getPrice.mockImplementation(async () => {
          throw new Error();
        });

        await sut.getPrice(ctx);
        expect(messageService.replyExchangeMessage).toHaveBeenCalledWith(
          ctx,
          testAdapter.name,
          MessagesEnum.apiError,
        );
      });
    });
  });

  describe('#myExchanges', () => {
    let ctx: Context;
    beforeEach(() => {
      ctx = {
        get from() {
          return { username: 'test-username' };
        },
        get message() {
          return {
            get from() {
              return { id: 1 };
            },
          };
        },
      } as Context;
    });

    describe('success', () => {
      let user: IUser;
      beforeEach(() => {
        user = {
          telegram_id: 12,
          user_name: 'test-user-name',
          user_lastname: 'test-user-last-name',
          telegram_name: 'test-tel-name',
          telegram_lang: 'en',
          is_bot: false,
          exchanges: [testAdapter.name],
        };
      });

      it('should return selected exchanges', async () => {
        helperService.findUser.mockResolvedValueOnce(user);
        await sut.myExchanges(ctx);
        expect(messageService.replySelectedExchanges).toHaveBeenCalledWith(
          ctx,
          user.exchanges,
        );
      });
    });

    describe('error', () => {
      it('should return unexpected-error', async () => {
        helperService.findUser.mockImplementation(async () => {
          throw new Error();
        });

        await sut.myExchanges(ctx);
        expect(messageService.replyError).toHaveBeenCalledWith(ctx);
      });
    });
  });
});
