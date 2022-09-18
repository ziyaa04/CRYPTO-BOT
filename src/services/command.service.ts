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
import { ApiPriceResultDto } from './dto/api-price-result.dto';

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
  async maxPrice(ctx: Context & { message?: { text: string } }) {
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
      this.replySelectedAdaptersMaxPrice(ctx, user, currency);
    } catch (e) {
      this.logger.error(e);
      // db error or another unexpected one
      return this.messageService.replyError(ctx);
    }
  }
  async minPrice(ctx: Context & { message?: { text: string } }) {
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
      this.replySelectedAdaptersMinPrice(ctx, user, currency);
    } catch (e) {
      this.logger.error(e);
      // db error or another unexpected one
      return this.messageService.replyError(ctx);
    }
  }

  private async replySelectedAdaptersMaxPrice(
    ctx: Context,
    user: IUser,
    currency: string,
  ) {
    const apiPriceResults = await this.getSelectedAdaptersPrice(user, currency);
    let maxPriceResult: ApiPriceResultDto = apiPriceResults[0];
    // find Max price adapter
    for (let i = 1; i < apiPriceResults.length; i++) {
      const curAdapter = apiPriceResults[i];
      if (maxPriceResult.price < curAdapter.price) {
        maxPriceResult = curAdapter;
      }
    }
    // response max price adapter
    this.messageService.replyCustomMessage(
      ctx,
      `${
        maxPriceResult.name
      }(HAS MAX PRICE OF SELECTED)\n${currency.toUpperCase()} - ${
        maxPriceResult.price
      } USDT`,
    );
  }
  private async replySelectedAdaptersMinPrice(
    ctx: Context,
    user: IUser,
    currency: string,
  ) {
    const apiPriceResults = await this.getSelectedAdaptersPrice(user, currency);
    let maxPriceResult: ApiPriceResultDto = apiPriceResults[0];
    // find Max price adapter
    for (let i = 1; i < apiPriceResults.length; i++) {
      const curAdapter = apiPriceResults[i];
      if (maxPriceResult.price > curAdapter.price) {
        maxPriceResult = curAdapter;
      }
    }

    // response max price adapter
    this.messageService.replyCustomMessage(
      ctx,
      `${
        maxPriceResult.name
      }(HAS MIN PRICE OF SELECTED)\n${currency.toUpperCase()} - ${
        maxPriceResult.price
      } USDT`,
    );
  }

  private async replySelectedAdaptersPrice(
    ctx: Context,
    user: IUser,
    currency: string,
  ) {
    const apiPriceResults = await this.getSelectedAdaptersPrice(user, currency);
    for (const apiPriceResult of apiPriceResults) {
      if (apiPriceResult.error) {
        //error
        this.messageService.replyCustomMessage(
          ctx,
          `${apiPriceResult.name}\n${MessagesEnum.apiError}`,
        );
        continue;
      }
      // res
      this.messageService.replyCustomMessage(
        ctx,
        `${apiPriceResult.name}\n${currency.toUpperCase()} - ${
          apiPriceResult.price
        } USDT`,
      );
    }
  }

  private async getSelectedAdaptersPrice(
    user: IUser,
    currency: string,
  ): Promise<ApiPriceResultDto[]> {
    const apiPriceResults: ApiPriceResultDto[] = [];
    for (const adapter of this.container) {
      if (!this.isExistsAdapter(user, adapter)) continue;
      try {
        const price = await adapter.getPrice(currency);
        apiPriceResults.push(new ApiPriceResultDto(adapter.name, price, false));
      } catch (e) {
        //  an axios error
        apiPriceResults.push(new ApiPriceResultDto(adapter.name, 0, true));
      }
    }
    return apiPriceResults;
  }
  private isExistsAdapter(user: IUser, adapter: IApiAdapter) {
    return user.exchanges.find(
      (name) => name.toUpperCase() === adapter.name.toUpperCase(),
    );
  }
}

export default CommandService;
