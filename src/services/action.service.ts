import { Context } from 'telegraf';
import { Logger } from 'tslog';

import ExchangesEnum from '../enums/exchanges.enum';
import { IUser } from '../db/types/user.db.types';
import { Users } from '../db/tables.db';
import MessageService from './message.service';
import { HelperService } from './helper.service';

export class ActionService {
  constructor(
    private readonly messageService: MessageService,
    private readonly logger: Logger,
    private readonly helperService: HelperService,
  ) {}

  async setExchange(ctx: Context) {
    try {
      this.logger.info(ctx.from.username);
      const selectedExchange = this.helperService.getExchangeFromCallBack(
        ctx,
      ) as ExchangesEnum;
      if (!selectedExchange) throw new Error();

      const user: IUser = await this.helperService.findUser(
        ctx.callbackQuery.from.id,
      );

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
      const selectedExchange = this.helperService.getExchangeFromCallBack(
        ctx,
      ) as ExchangesEnum;
      if (!selectedExchange) throw new Error();
      const user: IUser = await this.helperService.findUser(
        ctx.callbackQuery.from.id,
      );
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
}
