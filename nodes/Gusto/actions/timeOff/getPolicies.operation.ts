/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest } from '../../GenericFunctions';

export const description: INodeProperties[] = [
  {
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['getPolicies'],
      },
    },
    description: 'The UUID of the company',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;

  const response = await gustoApiRequest.call(
    this,
    'GET',
    `/v1/companies/${companyId}/time_off_policies`,
  );

  return response;
}
