import { Context } from 'telegraf';

interface ICommandController {
  Price(ctx: Context);
  Exchanges(ctx: Context);
  MyExchanges(ctx: Context);
}

export default ICommandController;
