import { Axios } from 'axios';

interface IApiAdapter {
  $api: Axios;
  getPrice(currency: string);
}

export type ApiAdaptersGenerator = () => IApiAdapter[];
export default IApiAdapter;
