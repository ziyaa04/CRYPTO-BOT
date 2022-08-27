import { Context } from 'telegraf';
import IApiAdapter from '../../adapters/types/adapter.type';

interface ICommandService {
  container: IApiAdapter[];
  start(ctx: Context);
  getPrice(ctx: Context);
  exchanges(ctx: Context);
  myExchanges(ctx: Context);
  setExchange(ctx: Context);
  removeExchange(ctx: Context);
}

export default ICommandService;
