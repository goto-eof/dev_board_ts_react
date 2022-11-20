import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const customAxios = axios.create();
// Add a response interceptor
export const customInterceptor = (navigate: any) => {
  customAxios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      console.log('Yahaaaa!');

      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      console.log('Yahoooo!');
      if (error.response.status === 401) {
        console.log('Unauthorized');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};
export default customAxios;
