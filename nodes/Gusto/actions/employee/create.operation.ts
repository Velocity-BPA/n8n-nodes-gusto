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
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['create'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['create'],
      },
    },
    description: 'The first name of the employee',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['create'],
      },
    },
    description: 'The last name of the employee',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['create'],
      },
    },
    description: 'The email address of the employee',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Middle Initial',
        name: 'middleInitial',
        type: 'string',
        default: '',
        description: 'The middle initial of the employee',
      },
      {
        displayName: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'dateTime',
        default: '',
        description: 'The date of birth of the employee (YYYY-MM-DD)',
      },
      {
        displayName: 'SSN',
        name: 'ssn',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'The Social Security Number of the employee',
      },
      {
        displayName: 'Self Onboarding',
        name: 'selfOnboarding',
        type: 'boolean',
        default: false,
        description: 'Whether the employee will complete onboarding themselves',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const firstName = this.getNodeParameter('firstName', index) as string;
  const lastName = this.getNodeParameter('lastName', index) as string;
  const email = this.getNodeParameter('email', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    first_name: firstName,
    last_name: lastName,
    email,
    middle_initial: additionalOptions.middleInitial,
    date_of_birth: additionalOptions.dateOfBirth
      ? formatDate(additionalOptions.dateOfBirth as string)
      : undefined,
    ssn: additionalOptions.ssn,
    self_onboarding: additionalOptions.selfOnboarding,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/companies/${companyId}/employees`,
    body,
  );

  return response;
}
