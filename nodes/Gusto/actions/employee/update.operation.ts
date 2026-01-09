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
        resource: ['employee'],
        operation: ['update'],
      },
    },
    description: 'The UUID of the employee to update',
  },
  {
    displayName: 'Version',
    name: 'version',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['update'],
      },
    },
    description:
      'The current version of the employee record for optimistic locking. Get this from a prior GET request.',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'The first name of the employee',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'The last name of the employee',
      },
      {
        displayName: 'Middle Initial',
        name: 'middleInitial',
        type: 'string',
        default: '',
        description: 'The middle initial of the employee',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'The email address of the employee',
      },
      {
        displayName: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'dateTime',
        default: '',
        description: 'The date of birth of the employee',
      },
      {
        displayName: 'SSN',
        name: 'ssn',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'The Social Security Number of the employee',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const employeeId = this.getNodeParameter('employeeId', index) as string;
  const version = this.getNodeParameter('version', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = cleanObject({
    version,
    first_name: updateFields.firstName,
    last_name: updateFields.lastName,
    middle_initial: updateFields.middleInitial,
    email: updateFields.email,
    date_of_birth: updateFields.dateOfBirth
      ? formatDate(updateFields.dateOfBirth as string)
      : undefined,
    ssn: updateFields.ssn,
  });

  const response = await gustoApiRequest.call(this, 'PUT', `/v1/employees/${employeeId}`, body);

  return response;
}
