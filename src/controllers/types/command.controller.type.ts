import { Context } from 'telegraf';
import IApiAdapter from '../../adapters/types/adapter.type';

interface ICommandController {
  container: IApiAdapter[];
  Price(ctx: Context);
  Exchanges(ctx: Context);
  MyExchanges(ctx: Context);
}

export default ICommandController;
