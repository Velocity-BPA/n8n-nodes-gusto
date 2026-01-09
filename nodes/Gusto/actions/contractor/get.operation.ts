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
    displayName: 'Contractor ID',
    name: 'contractorId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['get'],
      },
    },
    description: 'The UUID of the contractor to retrieve',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const contractorId = this.getNodeParameter('contractorId', index) as string;

  const response = await gustoApiRequest.call(this, 'GET', `/v1/contractors/${contractorId}`);

  return response;
}
