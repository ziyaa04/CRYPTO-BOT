import IApiAdapter from './types/adapter.type';
import { Axios } from 'axios';
import ExchangesEnum from '../enums/exchanges.enum';

export class CoinMarketCapAdapter implements IApiAdapter {
  name = ExchangesEnum.HUOBI;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string): Promise<number> {
    const response = await this.$api.get('/market/trade', {
      params: { symbol: currency.toLowerCase() + 'usdt' },
    });

    return response.data.tick.data[0].price;
  }
}
