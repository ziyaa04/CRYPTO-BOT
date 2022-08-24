import IApiAdapter from './types/adapter.type';
import { Axios } from 'axios';
import {
  IBinancePriceErrorResponse,
  IBinancePriceResponse,
} from './configs/binance.config';

export class BinanceApiAdapter implements IApiAdapter {
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string) {
    const response = await this.$api.get<IBinancePriceResponse>(
      `api/v3/ticker/price?symbol=${currency.toUpperCase()}USDT`,
    );
    if (!response.data.price) throw new Error();
    return response.data.price;
  }
}
