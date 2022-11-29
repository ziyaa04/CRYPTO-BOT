import { Context, Markup } from 'telegraf';

import ExchangesEnum from '../enums/exchanges.enum';
import MessagesEnum from '../enums/messages.enum';

export class MessageService {
  replyAllExchanges(ctx: Context) {
    this.replyCustomMessage(ctx, MessagesEnum.AllExchanges, {
      reply_markup: {
        inline_keyboard: this.getAllExchanges(),
      },
      parse_mode: 'MarkdownV2',
    });
  }

  replySelectedExchanges(ctx: Context, exchanges: ExchangesEnum[]) {
    ctx.reply(MessagesEnum.MyExchanges, {
      reply_markup: {
        inline_keyboard: this.getMyExchanges(exchanges),
      },
      parse_mode: 'MarkdownV2',
    });
  }

  replyError(ctx: Context) {
    this.replyCustomMessage(ctx, MessagesEnum.error);
  }

  replySelectedExchange(ctx: Context, exchange: ExchangesEnum) {
    this.replyCustomMessage(ctx, `${exchange} successfully selected!`);
  }

  replyRemovedExchange(ctx: Context, exchange: ExchangesEnum) {
    this.replyCustomMessage(ctx, `${exchange} successfully removed!`);
  }

  replyAlreadySelectedExchange(ctx: Context, exchange: ExchangesEnum) {
    this.replyCustomMessage(ctx, `${exchange} is already selected!`);
  }

  replyNotSelectedExchange(ctx: Context) {
    this.replyCustomMessage(ctx, MessagesEnum.NoExchangeSelected);
  }

  replyNotSelectedCurrency(ctx: Context) {
    this.replyCustomMessage(ctx, MessagesEnum.PleaseSelectCur);
  }

  replyExchangeMessage(ctx: Context, exchange: string, message): void {
    this.replyCustomMessage(ctx, `${exchange}\n${message}`);
  }

  replyCustomMessage(ctx: Context, message: string, options: any = {}): void {
    ctx.reply(message, { ...options });
  }

  private makeButtons(enumOrArray: object, callBackData: string) {
    const keys = Object.keys(enumOrArray);
    const buttons = [];
    let currentButtonRow: any[];
    for (let i = 0; i < keys.length; i++) {
      if (i % 3 === 0) {
        buttons.push([]);
        currentButtonRow = buttons[buttons.length - 1];
      }
      const exchangeName = enumOrArray[keys[i]];
      const button = Markup.button.callback(
        exchangeName,
        callBackData + exchangeName,
      );
      currentButtonRow.push(button);
    }
    return buttons;
  }

  private getAllExchanges() {
    return this.makeButtons(ExchangesEnum, MessagesEnum.ExchangeSetSchema);
  }

  private getMyExchanges(exchanges: ExchangesEnum[]) {
    return this.makeButtons(exchanges, MessagesEnum.ExchangeRemoveSchema);
  }
}
export default MessageService;
