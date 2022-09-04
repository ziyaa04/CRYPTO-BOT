import { BinanceApiAdapter } from './binance.adapter';
import axios from 'axios';
import binanceConfig from './configs/binance.config';
import huobiConfig from './configs/huobi.config';
import IApiAdapter from './types/adapter.type';
import { HuobiAdapter } from './huobi.adapter';

export default () =>
  [
    new BinanceApiAdapter(axios.create(binanceConfig)),
    new HuobiAdapter(axios.create(huobiConfig)),
  ] as IApiAdapter[];
