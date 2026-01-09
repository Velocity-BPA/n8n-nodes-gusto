/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  IHttpRequestMethods,
  IDataObject,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Get the base URL for the Gusto API based on the environment setting
 */
export function getBaseUrl(credentials: IDataObject): string {
  const environment = credentials.environment as string;
  return environment === 'production'
    ? 'https://api.gusto.com'
    : 'https://api.gusto-demo.com';
}

/**
 * Make an authenticated request to the Gusto API
 */
export async function gustoApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any> {
  const credentials = await this.getCredentials('gustoOAuth2Api');
  const baseUrl = getBaseUrl(credentials);

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    qs: query,
    json: true,
  };

  if (Object.keys(body).length > 0) {
    options.body = body;
  }

  try {
    return await this.helpers.requestOAuth2.call(this, 'gustoOAuth2Api', options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: parseGustoError(error),
    });
  }
}

/**
 * Make paginated requests to fetch all items from a Gusto API endpoint
 */
export async function gustoApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any[]> {
  const returnData: any[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await gustoApiRequest.call(this, method, endpoint, body, {
      ...query,
      page,
      per: perPage,
    });

    if (Array.isArray(response)) {
      returnData.push(...response);
      hasMore = response.length === perPage;
    } else if (response && typeof response === 'object') {
      // Some endpoints return an object with a data array
      const items = response.data || response.items || response;
      if (Array.isArray(items)) {
        returnData.push(...items);
        hasMore = items.length === perPage;
      } else {
        returnData.push(response);
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
    page++;
  }

  return returnData;
}

/**
 * Parse Gusto API error responses into readable messages
 */
export function parseGustoError(error: any): string {
  if (error.response?.body) {
    const body = error.response.body;

    // Handle standard Gusto error format
    if (body.error) {
      return body.error;
    }

    // Handle array of errors
    if (body.errors && Array.isArray(body.errors)) {
      return body.errors
        .map((e: any) => e.message || e.error_key || JSON.stringify(e))
        .join(', ');
    }

    // Handle message field
    if (body.message) {
      return body.message;
    }

    return JSON.stringify(body);
  }

  if (error.message) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Validate a UUID format
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Format a date to YYYY-MM-DD format
 */
export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    // If already in correct format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

/**
 * Remove undefined and null values from an object
 */
export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Handle optimistic locking version conflicts
 */
export async function gustoApiRequestWithRetry(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  maxRetries = 3,
): Promise<any> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await gustoApiRequest.call(this, method, endpoint, body, query);
    } catch (error: any) {
      const statusCode = error.httpCode || error.statusCode;

      // Retry on version conflict (422) if we have a version in the body
      if (statusCode === 422 && body.version !== undefined) {
        attempts++;
        if (attempts < maxRetries) {
          // Fetch the latest version
          const getEndpoint = endpoint.replace(/\/[^/]+$/, '');
          const current = await gustoApiRequest.call(this, 'GET', getEndpoint);
          if (current.version) {
            body.version = current.version;
          }
          continue;
        }
      }
      throw error;
    }
  }

  throw new Error('Max retries exceeded for version conflict');
}

/**
 * Build query string for filtering
 */
export function buildFilterQuery(filters: IDataObject): IDataObject {
  const query: IDataObject = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  }

  return query;
}
