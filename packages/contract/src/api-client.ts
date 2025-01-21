import type { InitClientReturn, ClientArgs } from '@ts-rest/core';
import { initClient } from '@ts-rest/core';
import type { AxiosError, AxiosResponse, Method } from 'axios';
import { isAxiosError } from 'axios';
import { ApiContract } from '../contract/index.js';
import { createAxiosClient } from './axios-client.js';

export type ApiClient = ReturnType<typeof getApiClient>;

let apiClientInstance: InitClientReturn<typeof ApiContract, ClientArgs> | null = null;

export function getApiClient(options: {
  baseUrl: string;
  baseHeaders: Record<string, string> | undefined;
}) {
  if (!apiClientInstance) {
    apiClientInstance = initClient(ApiContract, {
      baseUrl: options.baseUrl,
      baseHeaders: options.baseHeaders,
      api: async ({ path, method, headers, body }) => {
        try {
          const axiosClient = createAxiosClient().client;

          const result = await axiosClient.request({
            method: method as Method,
            url: path,
            headers,
            data: body,
          });

          return {
            status: result.status,
            body: result.data,
            headers: new Headers(Object.entries(result.headers ?? {})),
          };
        } catch (error: Error | AxiosError | any) {
          if (isAxiosError(error)) {
            const err = error as AxiosError;
            const response = err.response as AxiosResponse;

            return {
              status: response.status,
              body: response.data,
              headers: new Headers(Object.entries(response.headers ?? {})),
            };
          }

          throw error;
        }
      },
    });
  }

  return apiClientInstance;
}
