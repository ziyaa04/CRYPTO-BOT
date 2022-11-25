import { Axios } from 'axios';

import IApiAdapter from './types/adapter.type';
import ExchangesEnum from '../enums/exchanges.enum';
import { IHuobiPriceResponse } from './types/huobi.type';

export class HuobiAdapter implements IApiAdapter {
  name = ExchangesEnum.HUOBI;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string): Promise<number> {
    const response = await this.$api.get<IHuobiPriceResponse>('/market/trade', {
      params: { symbol: currency.toLowerCase() + 'usdt' },
    });

    return response.data.tick.data[0].price;
  }
}
