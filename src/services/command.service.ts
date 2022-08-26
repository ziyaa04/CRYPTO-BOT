import ICommandService from './types/command.service.type';
import { Context } from 'telegraf';
import IApiAdapter from '../adapters/types/adapter.type';
import UserSchema, { IUser } from '../schemas/user.schema';
import MessageService from './message.service';
import ExchangesEnum from '../enums/exchanges.enum';

class CommandService implements ICommandService {
  container: IApiAdapter[];

  constructor(
    private readonly messageService: MessageService,
    apiAdapters: IApiAdapter[],
  ) {
    this.container = apiAdapters;
  }

  async start(ctx: Context) {
    try {
      const exists = await UserSchema.findOne({
        telegram_id: ctx.message.from.id,
      });
      if (!exists) {
        await UserSchema.create({
          telegram_id: ctx.message.from.id,
          telegram_lang: ctx.message.from.language_code,
          is_bot: ctx.message.from.is_bot,
          telegram_name: ctx.message.from.username,
        });
      }
      ctx.reply('Welcome!');
    } catch (e) {
      ctx.reply('Error!');
    }
  }

  async getPrice(ctx: Context) {
    const user = await this.findUser(ctx.message.from.id);
  }

  exchanges(ctx: Context) {
    ctx.reply('Exchanges', {
      reply_markup: {
        inline_keyboard: this.messageService.getAllExchanges(),
      },
    });
  }

  async myExchanges(ctx: Context) {
    try {
      const user = await this.findUser(ctx.message.from.id);
      ctx.reply('Selected Exchanges', {
        reply_markup: {
          inline_keyboard: this.messageService.getMyExchanges(
            user.exchanges as ExchangesEnum[],
          ),
        },
      });
    } catch (e) {
      ctx.reply(this.messageService.error());
    }
  }

  private async findUser(telegramId: number): Promise<IUser> {
    return UserSchema.findOne({ telegram_id: telegramId });
  }
  async setExchange(ctx: Context) {
    try {
      const selectedExchange = ctx.callbackQuery.data
        ?.split('-')
        ?.at(-1)
        ?.toUpperCase();
      if (!selectedExchange) throw new Error();
      const user: IUser = await UserSchema.findOne({
        telegram_id: ctx.callbackQuery.from.id,
      });
      console.log(user);
      if (
        user.exchanges.find((elem) => elem.toUpperCase() === selectedExchange)
      ) {
        ctx.reply(`${selectedExchange} already selected!`);
        return;
      }
      await UserSchema.updateOne(
        { telegram_id: user.telegram_id },
        { $push: { exchanges: selectedExchange } },
      );
      ctx.reply(`${selectedExchange} selected!`);
    } catch (e) {
      ctx.reply(this.messageService.error());
    }
  }
}

export default CommandService;
