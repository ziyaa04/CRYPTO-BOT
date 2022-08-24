import { AxiosRequestConfig } from 'axios';

const binanceAxiosConfig: AxiosRequestConfig = {
  baseURL: 'https://api.binance.com',
};

export interface IBinancePriceResponse {
  symbol: string;
  price: string;
}

export interface IBinancePriceErrorResponse {
  code: string;
  msg: string;
}

export default binanceAxiosConfig;
