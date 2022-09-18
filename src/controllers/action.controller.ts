import { Context } from 'telegraf';
import { ActionService } from '../services/action.service';

export class ActionController {
  constructor(private readonly actionService: ActionService) {}
  SetExchangeAction(ctx: Context) {
    return this.actionService.setExchange(ctx);
  }
  RemoveExchangeAction(ctx: Context) {
    return this.actionService.removeExchange(ctx);
  }
}
