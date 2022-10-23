import { Axios } from 'axios';
import ExchangesEnum from '../../enums/exchanges.enum';

interface IApiAdapter {
  $api: Axios;
  name: ExchangesEnum;
  getPrice(currency: string): Promise<number>;
}

export default IApiAdapter;
