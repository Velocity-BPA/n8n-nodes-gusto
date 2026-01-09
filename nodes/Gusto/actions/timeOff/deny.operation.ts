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
    displayName: 'Time Off Request ID',
    name: 'timeOffRequestId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['deny'],
      },
    },
    description: 'The UUID of the time off request to deny',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const timeOffRequestId = this.getNodeParameter('timeOffRequestId', index) as string;

  const response = await gustoApiRequest.call(
    this,
    'PUT',
    `/v1/time_off_requests/${timeOffRequestId}/deny`,
  );

  return response;
}
