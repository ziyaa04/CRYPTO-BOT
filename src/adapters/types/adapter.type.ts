import { Axios } from 'axios';

interface IApiAdapter {
  $api: Axios;
  getPrice(currency: string);
}

export default IApiAdapter;
