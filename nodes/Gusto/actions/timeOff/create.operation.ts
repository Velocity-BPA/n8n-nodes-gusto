/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, cleanObject, formatDate } from '../../GenericFunctions';

export const description: INodeProperties[] = [
  {
    displayName: 'Employee ID',
    name: 'employeeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['create'],
      },
    },
    description: 'The UUID of the employee',
  },
  {
    displayName: 'Request Type',
    name: 'requestType',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['create'],
      },
    },
    description: 'The type of time off (e.g., vacation, sick, personal)',
  },
  {
    displayName: 'Hours',
    name: 'hours',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
    },
    required: true,
    default: 8,
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['create'],
      },
    },
    description: 'The number of hours requested',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['create'],
      },
    },
    description: 'The start date of the time off',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['create'],
      },
    },
    description: 'The end date of the time off',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['timeOff'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Notes for the time off request',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const employeeId = this.getNodeParameter('employeeId', index) as string;
  const requestType = this.getNodeParameter('requestType', index) as string;
  const hours = this.getNodeParameter('hours', index) as number;
  const startDate = this.getNodeParameter('startDate', index) as string;
  const endDate = this.getNodeParameter('endDate', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    request_type: requestType,
    hours: hours.toString(),
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    notes: additionalOptions.notes,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/employees/${employeeId}/time_off_requests`,
    body,
  );

  return response;
}
