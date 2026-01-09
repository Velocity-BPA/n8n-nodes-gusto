/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class GustoOAuth2Api implements ICredentialType {
  name = 'gustoOAuth2Api';
  displayName = 'Gusto OAuth2 API';
  documentationUrl = 'https://docs.gusto.com/';
  extends = ['oAuth2Api'];

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        { name: 'Demo/Sandbox', value: 'demo' },
        { name: 'Production', value: 'production' },
      ],
      default: 'demo',
      description: 'Select the Gusto API environment to use',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "production" ? "https://api.gusto.com/oauth/authorize" : "https://api.gusto-demo.com/oauth/authorize"}}',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "production" ? "https://api.gusto.com/oauth/token" : "https://api.gusto-demo.com/oauth/token"}}',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'The Client ID obtained from the Gusto Developer Portal',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'The Client Secret obtained from the Gusto Developer Portal',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default:
        'companies:read companies:write employees:read employees:write payrolls:read payrolls:write jobs:read jobs:write benefits:read benefits:write time_off:read time_off:write locations:read locations:write',
      description: 'Space-separated list of scopes to request',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'header',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.gusto.com" : "https://api.gusto-demo.com"}}',
      url: '/v1/me',
    },
  };
}
