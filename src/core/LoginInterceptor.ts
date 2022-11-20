import axios from 'axios';

const customAxios = axios.create();
export const customInterceptor = (
  navigate: any,
  toggleChangedLocalStorage: any
) => {
  customAxios.interceptors.response.use(
    function (response) {
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
export default customAxios;
