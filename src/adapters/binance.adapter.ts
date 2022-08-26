import IApiAdapter from './types/adapter.type';
import { Axios } from 'axios';
import {
  IBinancePriceErrorResponse,
  IBinancePriceResponse,
} from './configs/binance.config';
import ExchangesEnum from '../enums/exchanges.enum';

export class BinanceApiAdapter implements IApiAdapter {
  name = ExchangesEnum.BINANCE;
  constructor(public readonly $api: Axios) {}
  async getPrice(currency: string) {
    const response = await this.$api.get<IBinancePriceResponse>(
      `api/v3/ticker/price?symbol=${currency.toUpperCase()}USDT`,
    );
    if (!response.data.price) throw new Error();
    return parseFloat(response.data.price).toFixed(2);
  }
}
