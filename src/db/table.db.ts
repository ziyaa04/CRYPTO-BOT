import * as fs from 'fs';
import * as path from 'path';

import { IDbTable, IDbTableDataType } from './types/table.db.types';

export class DbTable<TSchema extends object, TUpdateSchema extends object>
  implements IDbTable<TSchema, TUpdateSchema>
{
  private readonly dbFilePath: string;
  public data: (TSchema & IDbTableDataType)[] = [];
  constructor(dbFilePath: string) {
    this.dbFilePath = path.join(process.cwd(), dbFilePath);
    fs.readFile(this.dbFilePath, (err, data) => {
      if (err) {
        // check whether some error while reading file
        fs.writeFile(this.dbFilePath, this.toJson(this.data), () => null);
      } else {
        try {
          this.data = this.toJS(data.toString());
        } catch (e) {
          // catch parse error
          fs.writeFile(this.dbFilePath, this.toJson(this.data), () => null);
        }
      }
    });
  }
  async save() {
    const json = this.toJson(this.data);
    fs.writeFileSync(this.dbFilePath, json);
  }
  add(dataObject: TSchema) {
    const curId = this.data[this.data.length - 1]?._id
      ? this.data[this.data.length - 1]._id + 1
      : 1;
    this.data.push({ ...dataObject, _id: curId });
    return this.data[this.data.length - 1];
  }
  update(_id: number, to: TUpdateSchema): (TSchema & IDbTableDataType) | null {
    let selectedElem: (TSchema & IDbTableDataType) | null = null;
    this.data = this.data.map((elem) => {
      if (elem._id === _id) {
        selectedElem = { ...elem, ...to, _id: elem._id };
        return selectedElem;
      }
      return elem;
    });
    return selectedElem ?? null;
  }

  toJson(data: object) {
    return JSON.stringify(data);
  }

  toJS(jsonString: string) {
    return JSON.parse(jsonString);
  }

  find(
    props: TUpdateSchema | TSchema | IDbTableDataType,
  ): (TSchema & IDbTableDataType)[] {
    const res: (TSchema & IDbTableDataType)[] = [];
    for (const elem of this.data) {
      if (this.checkElem(elem, props)) res.push(elem);
    }
    return res;
  }

  findOne(
    props: TUpdateSchema | TSchema | IDbTableDataType,
  ): (TSchema & IDbTableDataType) | null {
    for (const elem of this.data) {
      if (this.checkElem(elem, props)) return elem;
    }
    return null;
  }

  findOneById(_id: number): (TSchema & IDbTableDataType) | null {
    return this.findOne({ _id });
  }
  private checkElem(
    elem: TSchema,
    props: TUpdateSchema | TSchema | IDbTableDataType,
  ) {
    const keys = Object.keys(props);
    let isFound = false;
    for (const key of keys) {
      if (elem[key] !== props[key]) {
        isFound = false;
        break;
      }
      isFound = true;
    }
    return isFound;
  }
}
