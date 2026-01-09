/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, cleanObject } from '../../GenericFunctions';
import { contractorTypeOptions } from '../../transport';

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
        operation: ['create'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    options: contractorTypeOptions,
    required: true,
    default: 'Individual',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['create'],
      },
    },
    description: 'The type of contractor (Individual or Business)',
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
        resource: ['contractor'],
        operation: ['create'],
      },
    },
    description: 'The email address of the contractor',
  },
  // Individual contractor fields
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['create'],
        type: ['Individual'],
      },
    },
    description: 'The first name of the individual contractor',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['create'],
        type: ['Individual'],
      },
    },
    description: 'The last name of the individual contractor',
  },
  // Business contractor fields
  {
    displayName: 'Business Name',
    name: 'businessName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['create'],
        type: ['Business'],
      },
    },
    description: 'The name of the business contractor',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Self Onboarding',
        name: 'selfOnboarding',
        type: 'boolean',
        default: false,
        description: 'Whether the contractor will complete onboarding themselves',
      },
      {
        displayName: 'Middle Initial',
        name: 'middleInitial',
        type: 'string',
        default: '',
        description: 'The middle initial (for individual contractors)',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const type = this.getNodeParameter('type', index) as string;
  const email = this.getNodeParameter('email', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    type,
    email,
    self_onboarding: additionalOptions.selfOnboarding,
  });

  if (type === 'Individual') {
    const firstName = this.getNodeParameter('firstName', index) as string;
    const lastName = this.getNodeParameter('lastName', index) as string;
    body.first_name = firstName;
    body.last_name = lastName;
    if (additionalOptions.middleInitial) {
      body.middle_initial = additionalOptions.middleInitial;
    }
  } else {
    const businessName = this.getNodeParameter('businessName', index) as string;
    body.business_name = businessName;
  }

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/companies/${companyId}/contractors`,
    body,
  );

  return response;
}
