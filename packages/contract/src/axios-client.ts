import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import * as crypto from 'node:crypto';

interface LoggedRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

interface LoggedResponse {
  id: string;
  status: number;
  data: any;
  headers: Record<string, string>;
  duration: number; // In milliseconds
}

// Use a Map to store metadata per request
const requestMetadata = new Map<string, { startTime: Date }>();

const hashUniqueRequest = (operation: AxiosRequestConfig): string => {
  const hash = crypto.createHash('sha256');

  hash.update(
    JSON.stringify({
      method: operation.method,
      url: operation.url,
      headers: operation.headers,
      body: operation.data,
      params: operation.params,
    })
  );

  return hash.digest('hex');
};

export const createAxiosClient = (): { client: AxiosInstance; logs: any[] } => {
  const logs: Array<{ request: LoggedRequest; response: LoggedResponse }> = [];
  const client = axios.create();

  // Add a request interceptor
  client.interceptors.request.use(
    (config) => {
      const requestId = hashUniqueRequest(config);

      // Store metadata for the request in the Map
      requestMetadata.set(requestId, { startTime: new Date() });

      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config;
      const requestId = hashUniqueRequest(config);

      const metadata = requestMetadata.get(requestId);

      if (metadata) {
        const { startTime } = metadata;
        const duration = new Date().getTime() - startTime.getTime();

        // Log request and response
        logs.push({
          request: {
            id: requestId,
            method: response.config.method?.toUpperCase() || '',
            url: response.config.url || '',
            headers: response.config.headers as Record<string, string>,
            body: response.config.data,
          },
          response: {
            id: requestId,
            status: response.status,
            data: response.data,
            headers: response.headers as Record<string, string>,
            duration,
          },
        });

        // Clean up metadata for the completed request
        requestMetadata.delete(requestId);
      }

      return response;
    },
    (error) => {
      if (error.config) {
        const config = error.config as any;
        const requestId = config.requestId; // Retrieve the requestId from config

        const metadata = requestMetadata.get(requestId);

        if (metadata) {
          const { startTime } = metadata;
          const duration = new Date().getTime() - startTime.getTime();

          logs.push({
            request: {
              id: requestId,
              method: error.config.method?.toUpperCase() || '',
              url: error.config.url || '',
              headers: error.config.headers as Record<string, string>,
              body: error.config.data,
            },
            response: {
              id: requestId,
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers || {},
              duration,
            },
          });

          // Clean up metadata for the failed request
          requestMetadata.delete(requestId);
        }
      }

      return Promise.reject(error);
    }
  );

  return { client, logs };
};
