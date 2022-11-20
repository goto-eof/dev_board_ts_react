import { useNavigate } from 'react-router-dom';
import customAxios from '../core/LoginInterceptor';
import ResultI from '../core/ResultI';

export default class GenericService {
  private static baseUrl: string = 'http://localhost:8013/';

  public static async getAll<T>(modelName: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(this.baseUrl + modelName, { withCredentials: true })
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
    return await customAxios
      .get<Array<T>>(this.baseUrl + modelName + '/parent/' + parentId, {
        withCredentials: true,
      })
      .then((result: any) => {
        return result.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async get<T>(modelName: string, id: number): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${modelName}/${id}`, {
        withCredentials: true,
      })
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
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, data, { withCredentials: true })
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
    return await customAxios
      .put<T>(`${this.baseUrl}${modelName}/${id}`, data, {
        withCredentials: true,
      })
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
    return await customAxios
      .put<T>(`${this.baseUrl}${modelName}/swap`, swapRequest, {
        withCredentials: true,
      })
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async delete<T>(modelName: string, id: number): Promise<T> {
    return await customAxios
      .delete(`${this.baseUrl}${modelName}/${id}`, { withCredentials: true })
      .then((result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }
}
