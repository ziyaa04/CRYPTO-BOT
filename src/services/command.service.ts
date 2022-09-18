import { Context } from 'telegraf';
import IApiAdapter from '../adapters/types/adapter.type';
import MessageService from './message.service';
import ExchangesEnum from '../enums/exchanges.enum';
import MessagesEnum from '../enums/messages.enum';
import { Logger } from 'tslog';
import { Users } from '../db/tables.db';
import { IDbTableDataType } from '../db/types/table.db.types';
import { IUser } from '../db/types/user.db.types';
import { HelperService } from './helper.service';

class CommandService {
  constructor(
    private readonly messageService: MessageService,
    private readonly logger: Logger,
    public readonly container: IApiAdapter[],
    private readonly helperService: HelperService,
  ) {}
  async start(ctx: Context) {
    this.logger.info(ctx.from.username);
    ctx.reply('Welcome!');
  }
  async getPrice(ctx: Context & { message?: { text: string } }) {
    try {
      this.logger.info(ctx.from.username);
      const user = await this.helperService.findUser(ctx.message.from.id);
      // if not selected exchanges reply message
      if (!user.exchanges.length)
        return this.messageService.replyNotSelectedExchange(ctx);
      const currency = this.helperService.getArgumentFromCommand(ctx);
      // if not exists currency reply message
      if (!currency) return this.messageService.replyNotSelectedCurrency(ctx);
      // reply selected adapters price
      this.replySelectedAdaptersPrice(ctx, user, currency);
    } catch (e) {
      this.logger.error(e);
      // db error or another unexpected one
      return this.messageService.replyError(ctx);
    }
  }
  exchanges(ctx: Context) {
    this.logger.info(ctx.from.username);
    this.messageService.replyAllExchanges(ctx);
  }
  async myExchanges(ctx: Context) {
    try {
      this.logger.info(ctx.from.username);
      const user = await this.helperService.findUser(ctx.message.from.id);
      this.messageService.replySelectedExchanges(
        ctx,
        user.exchanges as ExchangesEnum[],
      );
    } catch (e) {
      this.logger.info(e);
      this.messageService.replyError(ctx);
    }
  }
  private async replySelectedAdaptersPrice(
    ctx: Context,
    user: IUser,
    currency: string,
  ) {
    for (const adapter of this.container) {
      if (
        user.exchanges.find(
          (name) => name.toUpperCase() === adapter.name.toUpperCase(),
        )
      ) {
        try {
          const price = await adapter.getPrice(currency);
          this.messageService.replyCustomMessage(
            ctx,
            `${adapter.name}\n${currency.toUpperCase()} - ${price} USDT`,
          );
        } catch (e) {
          //  an axios error
          this.messageService.replyCustomMessage(
            ctx,
            `${adapter.name}\n${MessagesEnum.apiError}`,
          );
        }
      }
    }
  }
}

export default CommandService;
