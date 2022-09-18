export class ApiPriceResultDto {
  constructor(
    public name: string,
    public price: number,
    public error: boolean,
  ) {}
}
