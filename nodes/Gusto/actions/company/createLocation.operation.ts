/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, cleanObject } from '../../GenericFunctions';
import { stateOptions } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['createLocation'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Street Address',
    name: 'street1',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['createLocation'],
      },
    },
    description: 'The primary street address',
  },
  {
    displayName: 'City',
    name: 'city',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['createLocation'],
      },
    },
    description: 'The city of the location',
  },
  {
    displayName: 'State',
    name: 'state',
    type: 'options',
    options: stateOptions,
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['createLocation'],
      },
    },
    description: 'The state abbreviation',
  },
  {
    displayName: 'ZIP Code',
    name: 'zip',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['createLocation'],
      },
    },
    description: 'The ZIP code of the location',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['company'],
        operation: ['createLocation'],
      },
    },
    options: [
      {
        displayName: 'Street Address Line 2',
        name: 'street2',
        type: 'string',
        default: '',
        description: 'The secondary street address (apartment, suite, etc.)',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'The phone number for this location',
      },
      {
        displayName: 'Filing Address',
        name: 'filingAddress',
        type: 'boolean',
        default: false,
        description: 'Whether this is the filing address for the company',
      },
      {
        displayName: 'Mailing Address',
        name: 'mailingAddress',
        type: 'boolean',
        default: false,
        description: 'Whether this is the mailing address for the company',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const street1 = this.getNodeParameter('street1', index) as string;
  const city = this.getNodeParameter('city', index) as string;
  const state = this.getNodeParameter('state', index) as string;
  const zip = this.getNodeParameter('zip', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    street_1: street1,
    street_2: additionalOptions.street2,
    city,
    state,
    zip,
    phone_number: additionalOptions.phoneNumber,
    filing_address: additionalOptions.filingAddress,
    mailing_address: additionalOptions.mailingAddress,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/companies/${companyId}/locations`,
    body,
  );

  return response;
}
