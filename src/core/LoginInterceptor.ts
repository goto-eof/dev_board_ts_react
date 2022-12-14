import axios from 'axios';
import GenericService from '../service/GenerciService';

const customAxios = axios.create();
export const customInterceptor = (
  navigate: any,
  toggleChangedLocalStorage: any
) => {
  customAxios.interceptors.response.use(
    async function (response) {
      GenericService.refreshToken(response.data);
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        console.log('Unauthorized');
        localStorage.clear();
        toggleChangedLocalStorage();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};

customAxios.interceptors.request.use(
  (config: any) => {
    let tokensData = localStorage.getItem('token');
    config.headers['Authorization'] = `${tokensData}`;
    return config;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

export default customAxios;
