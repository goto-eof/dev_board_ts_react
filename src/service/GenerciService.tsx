import axios from 'axios';
import Result from '../core/Result';

export default class GenericService {
  private static baseUrl: string = 'http://localhost:8013/';

  public static async getAll<T>(modelName: string): Promise<Result<any>> {
    return await axios
      .get<Array<T>>(this.baseUrl + modelName)
      .then((result: any) => {
        console.log(result);
        console.log('two', result.data);
        if (result.data && result.data.success) {
          let res = new Result(false);
          console.log('three', result);
          res.data = result.data.result as Array<T>;
          return res;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch((err) => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make get request: ' + err;
        return result;
      });
  }

  public static async getByParentId<T>(
    modelName: string,
    parentId: number
  ): Promise<Result<any>> {
    return await axios
      .get<Array<T>>(this.baseUrl + modelName + '/parent/' + parentId)
      .then((result: any) => {
        console.log(result);
        console.log('two', result.data);
        if (result.data && result.data.success) {
          let res = new Result(false);
          console.log('three', result);
          res.data = result.data.result as Array<T>;
          return res;
        } else {
          let result = new Result(true);
          result.errorMessage = 'Invalid result';
          return result;
        }
      })
      .catch((err) => {
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
      .catch((err) => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make get request: ' + err;
        return result;
      });
  }

  public static async create<T>(
    modelName: string,
    data: T
  ): Promise<Result<any>> {
    return axios
      .post<T>(`${this.baseUrl}${modelName}`, data)
      .then((result: any) => {
        let data = result.data;
        console.log('DATA', result);
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
      .catch((err) => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make post request: ' + err;
        return result;
      });
  }

  public static async update<T>(
    modelName: string,
    id: number,
    data: T
  ): Promise<Result<any>> {
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
      .catch((err) => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make post request: ' + err;
        return result;
      });
  }

  public static async delete(
    modelName: string,
    id: number
  ): Promise<Result<any>> {
    return axios
      .delete(`${this.baseUrl}${modelName}/${id}`)
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
      .catch((err) => {
        let result = new Result(true);
        result.errorMessage = 'Unable to make post request: ' + err;
        return result;
      });
  }
}
