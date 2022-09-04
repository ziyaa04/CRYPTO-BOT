import { AxiosRequestConfig } from 'axios';

const huobiAxiosConfig: AxiosRequestConfig = {
  baseURL: 'https://api.huobi.pro',
};

export interface IHuobiTickData {
  id: number;
  ts: number;
  'trade-id': number;
  amount: number;
  price: number;
  direction: string;
}
export interface IHuobiTick {
  id: number;
  ts: number;
  data: IHuobiTickData[];
}
export interface IHuobiPriceResponse {
  ch: string;
  status: string;
  tick: IHuobiTick;
}

export default huobiAxiosConfig;
