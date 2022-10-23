import { AxiosRequestConfig } from 'axios';

const CoinMarketCapAxiosConfigGenerator = (): AxiosRequestConfig => ({
  baseURL: 'https://pro-api.coinmarketcap.com',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_TOKEN,
  },
});
export default CoinMarketCapAxiosConfigGenerator;
