import axios from 'axios';
import Result from './Result';

export default class GenericService {
  private static baseUrl: string = 'http://localhost:8013/';

  public static async getAll<T>(modelName: string): Promise<Result<any>> {
    return await axios
      .get<Array<T>>(this.baseUrl + modelName)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          let result = new Result(false);
          result.data = data.result as Array<T>;
          return result;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch(err => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make get request: ' + err;
        return result;
      });
  }

  public static async get<T>(
    modelName: string,
    id: number
  ): Promise<Result<any>> {
    return await axios
      .get<Array<T>>(`${this.baseUrl}${modelName}/${id}`)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          let result = new Result(false);
          result.data = data.result;
          return result;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch(err => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make get request: ' + err;
        return result;
      });
  }

  public static async create<T>(modelName: string, data: T) {
    return axios
      .post<T>(`${this.baseUrl}${modelName}`, data)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          let result = new Result(false);
          result.data = data.result;
          return result;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch(err => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make post request: ' + err;
        return result;
      });
  }

  public static async update<T>(modelName: string, id: number, data: T) {
    return axios
      .put<T>(`${this.baseUrl}${modelName}/${id}`, data)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          let result = new Result(false);
          result.data = data.result;
          return result;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch(err => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make post request: ' + err;
        return result;
      });
  }

  public static async delete(modelName: string, id: number) {
    return axios
      .delete(`${this.baseUrl}${modelName}/${id}`)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          let result = new Result(false);
          result.data = data;
          return result;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch(err => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make post request: ' + err;
        return result;
      });
  }
}
