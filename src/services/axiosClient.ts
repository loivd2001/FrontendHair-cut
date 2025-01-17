import axios, { AxiosError, AxiosInstance } from 'axios';
import { store } from '@/store/index';
import {
  LoginResponse,
  ParamsLogin,
  UserAll,
  UserEdit,
} from '@/api_type/Login';
import _ from 'lodash';
import { ProductPResponseType } from '@/api_type/Product';

/** Setting timeout of axios */
const AXIOS_TIMEOUT: number = 10000;

/** API url */
const BASE_URL: string = import.meta.env.VITE_API_URL;

class AxiosClient {
  private axios: AxiosInstance;
  public exception: AxiosError | undefined;
  private config = {
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Content-Type': 'multipart/form-data',
    },
  };

  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: AXIOS_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.axios.interceptors.request.use(
      async (config) => {
        const token = store.getState().user.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const serverError = _.get(error, 'response.data', {});
        return Promise.reject(serverError);
      },
    );
  }

  // api login
  apiLogin(params: ParamsLogin) {
    return this.axios.post<LoginResponse>('api/login', params);
  }

  // api get all user
  apiGetUsers() {
    return this.axios.get<UserAll>('api/users', this.config);
  }

  // api create new user
  apiCreateUser(params: Object) {
    return this.axios.post('api/create-user', params);
  }

  // api update user
  apiUpdateUser(id: number, params: Partial<UserEdit>) {
    return this.axios.put(`api/update-user/${id}`, params);
  }

  // api delete user
  apiDeleteUser(id: number) {
    return this.axios.delete(`api/delete-user/${id}`, this.config);
  }

  // api get all product
  apiGetProduct() {
    return this.axios.get('/api/product', this.config);
  }

  //api create product
  apiCreateProduct(params: FormData) {
    return this.axios.post<ProductPResponseType>('/api/product/create', params, this.config);
  }

  //api update product
  apiUpdateProduct(params: FormData, id: number) {
    return this.axios.put(`/api/product/update/${id}`, params, this.config);
  }

  //api delete product
  apiDeleteProduct(id: number) {
    return this.axios.delete(`/api/product/delete/${id}`, this.config);
  }

  //api get category
  apiGetCategory() {
    return this.axios.get('/api/categories', this.config);
  }
}

export default new AxiosClient();
