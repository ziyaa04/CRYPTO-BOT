import { Context } from 'telegraf';
import IApiAdapter from '../../adapters/types/adapter.type';

interface ICommandService {
  container: IApiAdapter[];
  getPrice(ctx: Context);
  exchanges(ctx: Context);
  myExchanges(ctx: Context);
}

export default ICommandService;
