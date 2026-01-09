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
    displayName: 'Employee ID',
    name: 'employeeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['list'],
      },
    },
    description: 'The UUID of the employee',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const employeeId = this.getNodeParameter('employeeId', index) as string;

  const response = await gustoApiRequest.call(this, 'GET', `/v1/employees/${employeeId}/jobs`);

  return response;
}
