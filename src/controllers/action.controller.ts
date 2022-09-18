import { Context } from 'telegraf';
import { ActionService } from '../services/action.service';

export class ActionController {
  constructor(private readonly actionService: ActionService) {}
  SetExchange(ctx: Context) {
    return this.actionService.setExchange(ctx);
  }
  RemoveExchange(ctx: Context) {
    return this.actionService.removeExchange(ctx);
  }
}
