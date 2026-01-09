/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Mock types for n8n-workflow
export interface IDataObject {
  [key: string]: any;
}

export interface IHttpRequestMethods {
  [key: string]: any;
}

export interface IRequestOptions {
  method: string;
  uri: string;
  headers?: IDataObject;
  body?: IDataObject;
  qs?: IDataObject;
  json?: boolean;
}

export interface INodeExecutionData {
  json: IDataObject;
  binary?: {
    [key: string]: any;
  };
  pairedItem?: {
    item: number;
  };
}

export interface IExecuteFunctions {
  getNodeParameter: (name: string, index: number, fallback?: any) => any;
  getCredentials: (name: string) => Promise<IDataObject>;
  helpers: {
    requestOAuth2: (
      this: IExecuteFunctions,
      credentialsType: string,
      options: IRequestOptions,
    ) => Promise<any>;
    returnJsonArray: (data: any) => INodeExecutionData[];
  };
  getNode: () => IDataObject;
}

export interface IHookFunctions {
  getNodeParameter: (name: string, index?: number, fallback?: any) => any;
  getCredentials: (name: string) => Promise<IDataObject>;
  helpers: {
    requestOAuth2: (
      this: IHookFunctions,
      credentialsType: string,
      options: IRequestOptions,
    ) => Promise<any>;
  };
  getWebhookUrl: (webhook: string) => string;
  getNode: () => IDataObject;
}

export interface IWebhookFunctions {
  getBodyData: () => IDataObject;
  getHeaderData: () => IDataObject;
  getQueryData: () => IDataObject;
  getWebhookName: () => string;
  helpers: {
    returnJsonArray: (data: any) => INodeExecutionData[];
  };
}

export interface INodeProperties {
  displayName: string;
  name: string;
  type: string;
  default?: any;
  required?: boolean;
  description?: string;
  options?: any[];
  displayOptions?: {
    show?: { [key: string]: any[] };
    hide?: { [key: string]: any[] };
  };
  typeOptions?: IDataObject;
  noDataExpression?: boolean;
}

export interface INodeType {
  description: INodeTypeDescription;
  execute?: (this: IExecuteFunctions) => Promise<INodeExecutionData[][]>;
  webhookMethods?: { [key: string]: any };
  webhook?: (this: IWebhookFunctions) => Promise<any>;
}

export interface INodeTypeDescription {
  displayName: string;
  name: string;
  icon?: string;
  group: string[];
  version: number;
  subtitle?: string;
  description: string;
  defaults: {
    name: string;
  };
  inputs: string[];
  outputs: string[];
  credentials?: any[];
  webhooks?: any[];
  properties: INodeProperties[];
}

export interface ICredentialType {
  name: string;
  displayName: string;
  documentationUrl?: string;
  extends?: string[];
  properties: INodeProperties[];
}

export interface IWebhookResponseData {
  workflowData?: INodeExecutionData[][];
  webhookResponse?: any;
  noWebhookResponse?: boolean;
}

export type JsonObject = { [key: string]: any };

// NodeApiError mock class
export class NodeApiError extends Error {
  httpCode?: string;
  description?: string;

  constructor(_node: any, error: any, options?: { httpCode?: string; description?: string }) {
    const message = error?.message || error?.toString() || 'Unknown error';
    super(message);
    this.name = 'NodeApiError';
    this.httpCode = options?.httpCode;
    this.description = options?.description;
  }
}

// Mock helpers
export const createMockExecuteFunctions = (overrides: Partial<IExecuteFunctions> = {}): IExecuteFunctions => {
  return {
    getNodeParameter: jest.fn(),
    getCredentials: jest.fn().mockResolvedValue({ environment: 'demo' }),
    helpers: {
      requestOAuth2: jest.fn().mockResolvedValue({}),
      returnJsonArray: jest.fn((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => ({ json: item }));
        }
        return [{ json: data }];
      }),
    },
    getNode: jest.fn().mockReturnValue({ name: 'Gusto' }),
    ...overrides,
  } as IExecuteFunctions;
};

export const createMockHookFunctions = (overrides: Partial<IHookFunctions> = {}): IHookFunctions => {
  return {
    getNodeParameter: jest.fn(),
    getCredentials: jest.fn().mockResolvedValue({ environment: 'demo' }),
    helpers: {
      requestOAuth2: jest.fn().mockResolvedValue({}),
    },
    getWebhookUrl: jest.fn().mockReturnValue('https://example.com/webhook'),
    getNode: jest.fn().mockReturnValue({ name: 'Gusto Trigger' }),
    ...overrides,
  } as IHookFunctions;
};

export const createMockWebhookFunctions = (
  overrides: Partial<IWebhookFunctions> = {},
): IWebhookFunctions => {
  return {
    getBodyData: jest.fn().mockReturnValue({}),
    getHeaderData: jest.fn().mockReturnValue({}),
    getQueryData: jest.fn().mockReturnValue({}),
    getWebhookName: jest.fn().mockReturnValue('default'),
    helpers: {
      returnJsonArray: jest.fn((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => ({ json: item }));
        }
        return [{ json: data }];
      }),
    },
    ...overrides,
  } as IWebhookFunctions;
};

export default {
  IDataObject: {},
  IHttpRequestMethods: {},
  IRequestOptions: {},
  INodeExecutionData: {},
  IExecuteFunctions: {},
  IHookFunctions: {},
  IWebhookFunctions: {},
  INodeProperties: {},
  INodeType: {},
  INodeTypeDescription: {},
  ICredentialType: {},
  IWebhookResponseData: {},
  JsonObject: {},
  NodeApiError,
  createMockExecuteFunctions,
  createMockHookFunctions,
  createMockWebhookFunctions,
};
