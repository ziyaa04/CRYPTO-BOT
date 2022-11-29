import { HelperService } from '../../services/helper.service';
import { Users } from '../../db/tables.db';
import { Context } from 'telegraf';

describe('HelperService', () => {
  let sut: HelperService;

  beforeEach(() => {
    sut = new HelperService();
  });

  describe('#findUser', () => {
    let telegramId: number;
    beforeEach(() => {
      telegramId = 1;
    });

    describe('success', () => {
      it('should return user from db when exists', async () => {
        const user = {
          _id: 12132132,
          telegram_id: telegramId,
          user_name: 'test-username',
          user_lastname: 'test-lastname',
          telegram_name: 'test-name',
          telegram_lang: 'en',
          is_bot: true,
          exchanges: [],
        };
        jest.spyOn(Users, 'findOne').mockReturnValueOnce(user);
        expect(await sut.findUser(telegramId)).toStrictEqual(user);
      });

      it('should return null when user not exists', async () => {
        const user = null;
        jest.spyOn(Users, 'findOne').mockReturnValueOnce(user);
        expect(await sut.findUser(telegramId)).toStrictEqual(user);
      });
    });
  });

  describe('#getArgumentFromCommand', () => {
    let ctx: Context;
    let argument: string;
    beforeEach(() => {
      argument = 'argument';
      ctx = {
        get message() {
          return {
            text: `/command ${argument}`,
          };
        },
      } as Context;
    });

    describe('success', () => {
      it('should return argument in the command text', () => {
        expect(sut.getArgumentFromCommand(ctx)).toBe(argument);
      });
    });

    describe('error', () => {
      it('should return null', () => {
        ctx = {
          get message() {
            return {};
          },
        } as Context;
        expect(sut.getArgumentFromCommand(ctx)).toBe(null);
      });
    });
  });

  describe('#getExchangeFromCallBack', () => {
    let ctx: Context;
    let argument: string;

    beforeEach(() => {
      argument = 'BINANCE';
      ctx = {
        get callbackQuery() {
          return { data: `/exchange-set-${argument}` };
        },
      } as Context;
    });

    describe('success', () => {
      it('should return argument in callback', () => {
        expect(sut.getExchangeFromCallBack(ctx)).toBe(argument);
      });
    });
  });
});
