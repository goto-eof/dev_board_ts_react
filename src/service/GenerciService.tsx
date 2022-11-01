import axios from 'axios';
import ResultI from '../core/ResultI';

export default class GenericService {
  private static baseUrl: string = 'http://localhost:8013/';

  public static async getAll<T>(modelName: string): Promise<T> {
    return await axios
      .get<Array<T>>(this.baseUrl + modelName)
      .then((result: any) => {
        return result.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async getByParentId<T>(
    modelName: string,
    parentId: number
  ): Promise<T> {
    return await axios
      .get<Array<T>>(this.baseUrl + modelName + '/parent/' + parentId)
      .then((result: any) => {
        return result.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async get<T>(modelName: string, id: number): Promise<T> {
    return await axios
      .get<Array<T>>(`${this.baseUrl}${modelName}/${id}`)
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async create<T>(
    modelName: string,
    data: T
  ): Promise<ResultI<T>> {
    return await axios
      .post<T>(`${this.baseUrl}${modelName}`, data)
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async update<T, S>(
    modelName: string,
    id: number,
    data: T
  ): Promise<ResultI<S>> {
    return await axios
      .put<T>(`${this.baseUrl}${modelName}/${id}`, data)
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async swap<T, R>(
    modelName: string,
    swapRequest: T
  ): Promise<R> {
    return await axios
      .put<T>(`${this.baseUrl}${modelName}/swap`, swapRequest)
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async delete<T>(modelName: string, id: number): Promise<T> {
    return await axios
      .delete(`${this.baseUrl}${modelName}/${id}`)
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }
}
