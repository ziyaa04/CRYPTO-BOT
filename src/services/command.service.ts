import { Context } from 'telegraf';
import IApiAdapter from '../adapters/types/adapter.type';
import MessageService from './message.service';
import ExchangesEnum from '../enums/exchanges.enum';
import MessagesEnum from '../enums/messages.enum';
import { Logger } from 'tslog';
import { Users } from '../db/tables.db';
import { IDbTableDataType } from '../db/types/table.db.types';
import { IUser } from '../db/types/user.db.types';

class CommandService {
  container: IApiAdapter[];
  constructor(
    private readonly messageService: MessageService,
    private readonly logger: Logger,
    apiAdapters: IApiAdapter[],
  ) {
    this.container = apiAdapters;
  }
  async start(ctx: Context) {
    this.logger.info(ctx.from.username);
    ctx.reply('Welcome!');
  }
  async getPrice(ctx: Context & { message: { text: string } }) {
    try {
      this.logger.info(ctx.from.username);

      const user = await this.findUser(ctx.message.from.id);
      // if not selected exchanges reply message
      if (!user.exchanges.length)
        return this.messageService.replyNotSelectedExchange(ctx);
      const currency = this.getArgumentFromCommand(ctx);
      // if not exists currency reply message
      if (!currency) return this.messageService.replyNotSelectedCurrency(ctx);
      // reply selected adapters price
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
  async setExchange(ctx: Context) {
    try {
      this.logger.info(ctx.from.username);
      const selectedExchange = this.getExchangeFromCallBack(
        ctx,
      ) as ExchangesEnum;
      if (!selectedExchange) throw new Error();
      const user: IUser = await this.findUser(ctx.callbackQuery.from.id);
      // check is already selected the exchange
      if (
        user.exchanges.find((elem) => elem.toUpperCase() === selectedExchange)
      ) {
        return this.messageService.replyAlreadySelectedExchange(
          ctx,
          selectedExchange,
        );
      }
      // add exchange to the user's exchanges
      user.exchanges.push(selectedExchange);
      Users.save();
      this.messageService.replySelectedExchange(ctx, selectedExchange);
    } catch (e) {
      this.logger.error(e);
      this.messageService.replyError(ctx);
    }
  }
  async removeExchange(ctx: Context) {
    try {
      this.logger.info(ctx.from.username);
      const selectedExchange = this.getExchangeFromCallBack(
        ctx,
      ) as ExchangesEnum;
      if (!selectedExchange) throw new Error();
      const user: IUser = await this.findUser(ctx.callbackQuery.from.id);
      if (
        !user.exchanges.find((elem) => elem.toUpperCase() === selectedExchange)
      )
        return this.messageService.replyCustomMessage(
          ctx,
          `You cannot delete ${selectedExchange} because you did not selected it.`,
        );
      user.exchanges = user.exchanges.filter(
        (elem) => elem !== selectedExchange,
      );
      await Users.save();
      this.messageService.replyRemovedExchange(ctx, selectedExchange);
    } catch (e) {
      this.logger.error(e);
      this.messageService.replyError(ctx);
    }
  }
  async myExchanges(ctx: Context) {
    try {
      this.logger.info(ctx.from.username);
      const user = await this.findUser(ctx.message.from.id);
      this.messageService.replySelectedExchanges(
        ctx,
        user.exchanges as ExchangesEnum[],
      );
    } catch (e) {
      this.logger.info(e);
      this.messageService.replyError(ctx);
    }
  }

  private findUser(telegramId: number): IUser & IDbTableDataType {
    return Users.findOne({ telegram_id: telegramId });
  }
  private getArgumentFromCommand(ctx: Context & { message: { text: string } }) {
    return ctx.message.text.replace(/\s\s+/g, ' ').split(' ')[1];
  }
  private getExchangeFromCallBack(ctx: Context) {
    return ctx.callbackQuery.data?.split('-')?.at(-1)?.toUpperCase();
  }
}

export default CommandService;
