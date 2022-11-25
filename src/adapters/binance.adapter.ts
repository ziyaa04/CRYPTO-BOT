import { Axios } from 'axios';

import IApiAdapter from './types/adapter.type';
import { IBinancePriceResponse } from './types/binance.type';
import ExchangesEnum from '../enums/exchanges.enum';

export class BinanceApiAdapter implements IApiAdapter {
  name = ExchangesEnum.BINANCE;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string): Promise<number> {
    const {
      data: { price },
    } = await this.$api.get<IBinancePriceResponse>(`api/v3/ticker/price`, {
      params: { symbol: currency.toUpperCase() + 'USDT' },
    });

    return parseFloat(price);
  }
}
