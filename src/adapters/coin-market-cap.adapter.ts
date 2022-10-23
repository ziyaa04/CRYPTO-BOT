import IApiAdapter from './types/adapter.type';
import { Axios, AxiosError } from 'axios';
import ExchangesEnum from '../enums/exchanges.enum';
import { ICoinMarketCapPriceResponse } from './types/coin-market-cap.type';

export class CoinMarketCapAdapter implements IApiAdapter {
  name = ExchangesEnum.COIN_MARKET_CAP;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string): Promise<number> {
    const response = await this.$api.get<ICoinMarketCapPriceResponse>(
      'v1/cryptocurrency/quotes/latest',
      {
        params: { symbol: currency.toLowerCase() },
      },
    );
    return response.data.data[currency.toUpperCase()].quote.USD.price;
  }
}
