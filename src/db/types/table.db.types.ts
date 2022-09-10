export interface IDbTableDataType {
  _id: number;
}

export interface IDbTable<TSchema, TUpdateSchema> {
  data: (TSchema & IDbTableDataType)[];
  save: () => void;
  add: (dataObject: TSchema) => TSchema & IDbTableDataType;
  update: (
    _id: number,
    to: TUpdateSchema,
  ) => (TSchema & IDbTableDataType) | null;
  toJson: (data: TSchema[]) => string;
  toJS: (jsonString: string) => (TSchema & IDbTableDataType)[];
}
