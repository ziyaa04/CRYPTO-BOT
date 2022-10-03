# Crypto-bot
### Made with Typescript & Telegraf.js
You can add your own Exchange's api under IApiAdapter interface
```typescript
interface IApiAdapter {
    $api: Axios;
    name: string;
    getPrice(currency: string);
}
```
After making ApiAdapter you  must  add your Exchange's name to the ExchangesEnum
```typescript
enum ExchangesEnum {
  BINANCE = 'BINANCE',
}
```
 all.adapter.ts (Add ApiAdapter to the App)
```typescript
export default () =>
  [new BinanceApiAdapter(axios.create(binanceConfig))] as IApiAdapter[];
```
You can also  make your ApiAdapter's config in /src/adapters/config folder.
