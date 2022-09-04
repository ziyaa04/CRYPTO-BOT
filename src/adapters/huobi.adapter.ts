import IApiAdapter from './types/adapter.type';
import { Axios } from 'axios';
import { IHuobiPriceResponse } from './configs/huobi.config';
import ExchangesEnum from '../enums/exchanges.enum';

export class HuobiAdapter implements IApiAdapter {
  name = ExchangesEnum.HUOBI;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string): Promise<string> {
    const response = await this.$api.get<IHuobiPriceResponse>('/market/trade', {
      params: { symbol: currency.toLowerCase() + 'usdt' },
    });
    return response.data.tick.data[0].price.toString();
  }
}
