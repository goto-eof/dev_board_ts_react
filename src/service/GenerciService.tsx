import { JwtI } from '../core/JwtI';
import customAxios from '../core/LoginInterceptor';
import ResultI from '../core/ResultI';

export default class GenericService {
  private static baseUrl: string =
    'http://' +
    process.env.REACT_APP_URI +
    ':' +
    process.env.REACT_APP_PORT +
    '/';

  public static async getAll<T>(modelName: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(this.baseUrl + modelName, { withCredentials: true })
      .then(async (result: any) => {
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
      .then(async (result: any) => {
        return result.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async getById<T>(modelName: string, id: number): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${modelName}/${id}`, {
        withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async get<T>(modelName: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${modelName}`, {
        withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async simple_get<T>(modelName: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${modelName}`, {
        withCredentials: true,
      })
      .then(async (result: any) => {
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
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async createDifResponse<T, U>(
    modelName: string,
    data: T
  ): Promise<ResultI<U>> {
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, data, { withCredentials: true })
      .then(async (result: any) => {
        console.log(result);
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async post<T>(modelName: string): Promise<ResultI<T>> {
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, '', { withCredentials: true })
      .then(async (result: any) => {
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
      .then(async (result: any) => {
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
      .then(async (result: any) => {
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
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err) => {
        throw err;
      });
  }

  public static refreshToken(result: ResultI<any>) {
    if (result.refresh_token) {
      GenericService.createDifResponse<JwtI, JwtI>('user/refreshToken', {
        jwt: localStorage.getItem('token') || '',
      }).then((response) => {
        if (response.success) {
          localStorage.setItem('token', response.result.jwt);
        }
      });
    } else {
      console.log('KO refreshToken()');
    }
  }
}
