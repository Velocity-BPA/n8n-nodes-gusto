/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, gustoApiRequestAllItems } from '../../GenericFunctions';

export const description: INodeProperties[] = [
  {
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['list'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['list'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const response = await gustoApiRequestAllItems.call(
      this,
      'GET',
      `/v1/companies/${companyId}/contractors`,
    );
    return response;
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    const response = await gustoApiRequest.call(
      this,
      'GET',
      `/v1/companies/${companyId}/contractors`,
      {},
      { per: limit },
    );
    return response;
  }
}
