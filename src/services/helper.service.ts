import { Context } from 'telegraf';

import { IUser } from '../db/types/user.db.types';
import { IDbTableDataType } from '../db/types/table.db.types';
import { Users } from '../db/tables.db';
import MessageService from './message.service';

export class HelperService {
  constructor(private readonly messageService: MessageService) {}
  public findUser(telegramId: number): IUser & IDbTableDataType {
    return Users.findOne({ telegram_id: telegramId });
  }

  public getArgumentFromCommand(ctx: Context): string | null {
    if ('text' in ctx.message)
      return ctx.message.text.replace(/\s\s+/g, ' ').split(' ')[1];
    return null;
  }
  public getExchangeFromCallBack(ctx: Context) {
    return ctx.callbackQuery.data?.split('-')?.at(-1)?.toUpperCase();
  }
}
