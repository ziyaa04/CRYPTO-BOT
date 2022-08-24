import { BinanceApiAdapter } from './binance.adapter';
import axios from 'axios';
import binanceConfig from './configs/binance.config';
import IApiAdapter from './types/adapter.type';

export default () =>
  [new BinanceApiAdapter(axios.create(binanceConfig))] as IApiAdapter[];
