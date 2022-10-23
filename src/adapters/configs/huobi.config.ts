import { AxiosRequestConfig } from 'axios';

const HuobiAxiosConfigGenerator = (): AxiosRequestConfig => ({
  baseURL: 'https://api.huobi.pro',
});

export default HuobiAxiosConfigGenerator;
