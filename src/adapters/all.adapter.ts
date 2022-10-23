import { BinanceApiAdapter } from './binance.adapter';
import axios from 'axios';
import IApiAdapter from './types/adapter.type';
import { HuobiAdapter } from './huobi.adapter';
import { CoinMarketCapAdapter } from './coin-market-cap.adapter';
import BinanceAxiosConfigGenerator from './configs/binance.config';
import HuobiAxiosConfigGenerator from './configs/huobi.config';
import CoinMarketCapAxiosConfigGenerator from './configs/coin-market-cap.config';

export default () =>
  [
    new BinanceApiAdapter(axios.create(BinanceAxiosConfigGenerator())),
    new HuobiAdapter(axios.create(HuobiAxiosConfigGenerator())),
    new CoinMarketCapAdapter(axios.create(CoinMarketCapAxiosConfigGenerator())),
  ] as IApiAdapter[];
