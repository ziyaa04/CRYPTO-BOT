import { HelperService } from '../../services/helper.service';
import { Users } from '../../db/tables.db';

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

  describe('#getArgumentFromCommand', () => {});

  describe('#getExchangeFromCallBack', () => {});
});
