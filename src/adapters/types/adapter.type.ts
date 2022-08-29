import { Axios } from 'axios';

interface IApiAdapter {
  $api: Axios;
  name: string;
  getPrice(currency: string);
}

export default IApiAdapter;
