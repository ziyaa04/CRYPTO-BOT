import { Context } from 'telegraf';

import { ActionService } from '../../services/action.service';
import { LoggerServiceMockGenerator } from './__mocks__/logger.service.mock';
import { MessageServiceMockGenerator } from './__mocks__/message.service.mock';
import { HelperServiceMockGenerator } from './__mocks__/helper.service.mock';
import ExchangesEnum from '../../enums/exchanges.enum';
import { IUser } from '../../db/types/user.db.types';
import { Users } from '../../db/tables.db';

describe('ActionService', () => {
  let sut: ActionService;

  let logger: ReturnType<typeof LoggerServiceMockGenerator>;
  let messageService: ReturnType<typeof MessageServiceMockGenerator>;
  let helperService: ReturnType<typeof HelperServiceMockGenerator>;

  beforeEach(() => {
    // mock dependencies
    logger = LoggerServiceMockGenerator();
    messageService = MessageServiceMockGenerator();
    helperService = HelperServiceMockGenerator();

    sut = new ActionService(
      //@ts-ignore
      messageService,
      logger,
      helperService,
    );
    jest.spyOn(Users, 'save').mockImplementation(async () => {});
  });

  describe('#setExchange', () => {
    let ctx: Context;
    let user: IUser;
    beforeEach(() => {
      ctx = {
        get from() {
          return { username: 'test_username' };
        },
        get callbackQuery() {
          return {
            get from() {
              return {
                id: 12,
              };
            },
          };
        },
      } as Context;

      user = {
        telegram_id: 12,
        user_name: 'undefined',
        user_lastname: 'undefined',
        telegram_name: 'test_username',
        telegram_lang: 'en',
        is_bot: false,
        exchanges: [],
      };
    });

    describe('success', () => {
      let exchangeName: ExchangesEnum;

      beforeEach(() => {
        exchangeName = ExchangesEnum.BINANCE;
      });

      it('should send selected exchange message', async () => {
        helperService.getExchangeFromCallBack.mockReturnValueOnce(exchangeName);
        helperService.findUser.mockResolvedValueOnce(user);
        await sut.setExchange(ctx);
        expect(messageService.replySelectedExchange).toHaveBeenCalledWith(
          ctx,
          exchangeName,
        );
      });
    });

    describe('error', () => {
      it('should send went-wrong message ', async () => {
        helperService.getExchangeFromCallBack.mockReturnValueOnce(undefined);
        await sut.setExchange(ctx);

        expect(messageService.replyError).toHaveBeenCalledWith(ctx);
      });

      it('should send already-selected message', async () => {
        const exchangeName = ExchangesEnum.BINANCE;

        helperService.getExchangeFromCallBack.mockReturnValueOnce(exchangeName);
        user.exchanges.push(exchangeName);
        helperService.findUser.mockReturnValueOnce(user);

        // another-one
        await sut.setExchange(ctx);

        expect(
          messageService.replyAlreadySelectedExchange,
        ).toHaveBeenCalledWith(ctx, exchangeName);
      });
    });
  });

  describe('#removeExchange', () => {
    let ctx: Context;
    let user: IUser;

    beforeEach(() => {
      ctx = {
        get from() {
          return { username: 'test_username' };
        },
        get callbackQuery() {
          return {
            get from() {
              return {
                id: 12,
              };
            },
          };
        },
      } as Context;

      user = {
        telegram_id: 12,
        user_name: 'undefined',
        user_lastname: 'undefined',
        telegram_name: 'test_username',
        telegram_lang: 'en',
        is_bot: false,
        exchanges: [],
      };
    });

    describe('success', () => {
      let exchangeName: ExchangesEnum;

      beforeEach(() => {
        exchangeName = ExchangesEnum.BINANCE;
      });

      it('should send removed-exchange message', async () => {
        helperService.getExchangeFromCallBack.mockReturnValueOnce(exchangeName);
        user.exchanges.push(exchangeName);
        helperService.findUser.mockReturnValueOnce(user);
        await sut.removeExchange(ctx);
        expect(messageService.replyRemovedExchange).toHaveBeenCalledWith(
          ctx,
          exchangeName,
        );
      });
    });
    describe('error', () => {
      it('should send went-wrong message', async () => {
        helperService.getExchangeFromCallBack.mockReturnValueOnce(undefined);
        await sut.removeExchange(ctx);
        expect(messageService.replyError).toHaveBeenCalledWith(ctx);
      });

      it('should send can-not-remove message', async () => {
        const exchangeName = ExchangesEnum.BINANCE;
        helperService.getExchangeFromCallBack.mockReturnValueOnce(exchangeName);
        helperService.findUser.mockReturnValueOnce(user);
        await sut.removeExchange(ctx);

        expect(messageService.replyCustomMessage).toHaveBeenCalledWith(
          ctx,
          `You cannot delete ${exchangeName} because you did not selected it.`,
        );
      });
    });
  });
});
