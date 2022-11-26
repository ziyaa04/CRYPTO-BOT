import { Logger } from 'tslog';
import { Context } from 'telegraf';

import { ActionService } from '../../services/action.service';
import { LoggerServiceMockGenerator } from './__mocks__/logger.service.mock';
import { MessageServiceMockGenerator } from './__mocks__/message.service.mock';
import { HelperServiceMockGenerator } from './__mocks__/helper.service.mock';
import { HelperService } from '../../services/helper.service';
import ExchangesEnum from '../../enums/exchanges.enum';
import messageService from '../../services/message.service';

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

    sut = new ActionService(messageService, logger, helperService);
  });
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('#setExchange', () => {
    let ctx: Context;
    let exchangeName: ExchangesEnum;
    beforeEach(() => {
      ctx = {
        get from() {
          return { username: 'test_username' };
        },
      } as Context;

      exchangeName = ExchangesEnum.BINANCE;
    });

    describe('success', () => {
      it('should return success message', () => {
        helperService;
      });
    });

    describe('error', () => {});
  });
});
