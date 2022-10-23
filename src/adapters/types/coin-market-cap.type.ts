interface ICoinMarketCapPriceResponseStatus {
  timestamp: string;
  error_code: number;
  error_message: null | string;
  elapsed: number;
  credit_count: number;
  notice: null | string;
}
interface ICoinMarketCapPriceResponseData {
  [key: string]: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    quote: {
      USD: {
        price: number;
        volume_24h: number;
        last_updated: string;
      };
    };
  };
}
export interface ICoinMarketCapPriceResponse {
  status: ICoinMarketCapPriceResponseStatus;
  data: ICoinMarketCapPriceResponseData;
}
