import ExchangesEnum from '../enums/exchanges.enum';
import { Context, Markup } from 'telegraf';
import MessagesEnum from '../enums/messages.enum';

export class MessageService {
  replyAllExchanges(ctx: Context) {
    ctx.reply('Exchanges', {
      reply_markup: {
        inline_keyboard: this.getAllExchanges(),
      },
    });
  }
  replySelectedExchanges(ctx: Context, exchanges: ExchangesEnum[]) {
    ctx.reply('Selected Exchanges', {
      reply_markup: {
        inline_keyboard: this.getMyExchanges(exchanges),
      },
    });
  }
  replyError(ctx: Context) {
    ctx.reply(MessagesEnum.error);
  }
  replySelectedExchange(ctx: Context, exchange: ExchangesEnum) {
    ctx.reply(`${exchange} successfully selected! `);
  }
  replyAlreadySelectedExchange(ctx: Context, exchange: ExchangesEnum) {
    ctx.reply(`${exchange} is already selected!`);
  }
  replyNotSelectedExchange(ctx: Context) {
    ctx.reply('No exchange is selected, please select at least one exchange!');
  }
  replyNotSelectedCurrency(ctx: Context) {
    ctx.reply('Please select a currency!');
  }

  private getAllExchanges() {
    const keys = Object.keys(ExchangesEnum);
    const buttons = [];
    let currentButtonPlace: any[];
    for (let i = 0; i < keys.length; i++) {
      if (i % 3 === 0) {
        buttons.push([]);
        currentButtonPlace = buttons[buttons.length - 1];
      }
      const exchangeName = ExchangesEnum[keys[i]];
      const button = Markup.button.callback(
        exchangeName,
        `exchange-set-${exchangeName}`,
      );
      currentButtonPlace.push(button);
    }
    return buttons;
  }
  private getMyExchanges(exchanges: ExchangesEnum[]) {
    const buttons = [];
    let currentButtonPlace: any[];
    for (let i = 0; i < exchanges.length; i++) {
      if (i % 3 === 0) {
        buttons.push([]);
        currentButtonPlace = buttons[buttons.length - 1];
      }
      const button = Markup.button.callback(exchanges[i], exchanges[i]);
      currentButtonPlace.push(button);
    }
    return buttons;
  }
}
export default MessageService;
