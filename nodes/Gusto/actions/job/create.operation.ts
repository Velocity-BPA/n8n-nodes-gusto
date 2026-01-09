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
        resource: ['job'],
        operation: ['create'],
      },
    },
    description: 'The UUID of the employee',
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['create'],
      },
    },
    description: 'The job title',
  },
  {
    displayName: 'Hire Date',
    name: 'hireDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['create'],
      },
    },
    description: 'The hire date for this job',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        default: '',
        description: 'The UUID of the work location for this job',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const employeeId = this.getNodeParameter('employeeId', index) as string;
  const title = this.getNodeParameter('title', index) as string;
  const hireDate = this.getNodeParameter('hireDate', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    title,
    hire_date: formatDate(hireDate),
    location_id: additionalOptions.locationId,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/employees/${employeeId}/jobs`,
    body,
  );

  return response;
}
