import { AxiosRequestConfig } from 'axios';

const BinanceAxiosConfigGenerator = (): AxiosRequestConfig => ({
  baseURL: 'https://api.binance.com',
});

export default BinanceAxiosConfigGenerator;
