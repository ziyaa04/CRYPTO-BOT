export interface IHuobiPriceResponse {
  ch: string;
  status: string;
  tick: IHuobiTick;
}

export interface IHuobiTick {
  id: number;
  ts: number;
  data: IHuobiTickData[];
}

export interface IHuobiTickData {
  id: number;
  ts: number;
  'trade-id': number;
  amount: number;
  price: number;
  direction: string;
}
