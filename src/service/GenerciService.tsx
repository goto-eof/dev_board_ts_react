import axios from 'axios';

export default class GenericService {
  private static baseUrl: string = 'http://localhost:8013/';

  public static async getAll<T>(modelName: string): Promise<T> {
    return await axios
      .get<Array<T>>(this.baseUrl + modelName)
      .then((result: any) => {
        console.log(result);
        console.log('two', result.data);
        if (result.data && result.data.success) {
          return result.data;
        }
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
        console.log(result);
        console.log('two', result.data);
        if (result.data && result.data.success) {
          return result.data;
        }
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

  public static async create<T>(modelName: string, data: T): Promise<T> {
    return axios
      .post<T>(`${this.baseUrl}${modelName}`, data)
      .then((result: any) => {
        let data = result.data;
        console.log('DATA', result);
        if (data && data.success) {
          return data;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async update<T>(
    modelName: string,
    id: number,
    data: T
  ): Promise<T> {
    return axios
      .put<T>(`${this.baseUrl}${modelName}/${id}`, data)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          return data;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  public static async delete<T>(modelName: string, id: number): Promise<T> {
    return axios
      .delete(`${this.baseUrl}${modelName}/${id}`)
      .then((result: any) => {
        let data = result.data;
        if (data && data.success) {
          return data;
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}
