import IApiAdapter from './types/adapter.type';
import { Axios } from 'axios';
import { IBinancePriceResponse } from './configs/binance.config';
import ExchangesEnum from '../enums/exchanges.enum';

export class BinanceApiAdapter implements IApiAdapter {
  name = ExchangesEnum.BINANCE;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string) {
    const {
      data: { price },
    } = await this.$api.get<IBinancePriceResponse>(`api/v3/ticker/price`, {
      params: { symbol: currency.toUpperCase() + 'USDT' },
    });

    return parseFloat(price).toFixed(2);
  }
}
