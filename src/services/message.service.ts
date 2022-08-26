import ExchangesEnum from '../enums/exchanges.enum';
import { Markup } from 'telegraf';
import MessagesEnum from '../enums/messages.enum';

export class MessageService {
  getAllExchanges() {
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
  getMyExchanges(exchanges: ExchangesEnum[]) {
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
  error() {
    return MessagesEnum.error;
  }
}
export default MessageService;
