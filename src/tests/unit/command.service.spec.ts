import CommandService from '../../services/command.service';
import { MessageServiceMockGenerator } from './__mocks__/message.service.mock';
import { HelperServiceMockGenerator } from './__mocks__/helper.service.mock';
import { LoggerServiceMockGenerator } from './__mocks__/logger.service.mock';
import { AdapterMockGenerator } from './__mocks__/adapter.mock';
import { Context } from 'telegraf';

describe('CommandService', () => {
  let sut: CommandService;

  let messageService: ReturnType<typeof MessageServiceMockGenerator>;
  let helperService: ReturnType<typeof HelperServiceMockGenerator>;
  let logger: ReturnType<typeof LoggerServiceMockGenerator>;

  let testAdapterName: string;
  let testAdapter: ReturnType<typeof AdapterMockGenerator>;

  beforeEach(() => {
    messageService = MessageServiceMockGenerator();
    helperService = HelperServiceMockGenerator();
    logger = LoggerServiceMockGenerator();

    testAdapterName = 'test-adapter';
    testAdapter = AdapterMockGenerator(testAdapterName);
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
        expect(ctx.reply).toHaveBeenCalledWith('Welcome!');
      });
    });
  });
});
