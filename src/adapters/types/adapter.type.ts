import { Axios } from 'axios';

interface IApiAdapter {
  $api: Axios;
  name: string;
  getPrice(currency: string): Promise<number>;
}

export default IApiAdapter;
