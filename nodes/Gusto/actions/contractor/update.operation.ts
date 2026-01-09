/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, cleanObject } from '../../GenericFunctions';

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
        operation: ['update'],
      },
    },
    description: 'The UUID of the contractor to update',
  },
  {
    displayName: 'Version',
    name: 'version',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['update'],
      },
    },
    description:
      'The current version of the contractor record for optimistic locking. Get this from a prior GET request.',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contractor'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'The first name (for individual contractors)',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'The last name (for individual contractors)',
      },
      {
        displayName: 'Middle Initial',
        name: 'middleInitial',
        type: 'string',
        default: '',
        description: 'The middle initial (for individual contractors)',
      },
      {
        displayName: 'Business Name',
        name: 'businessName',
        type: 'string',
        default: '',
        description: 'The business name (for business contractors)',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'The email address of the contractor',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const contractorId = this.getNodeParameter('contractorId', index) as string;
  const version = this.getNodeParameter('version', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = cleanObject({
    version,
    first_name: updateFields.firstName,
    last_name: updateFields.lastName,
    middle_initial: updateFields.middleInitial,
    business_name: updateFields.businessName,
    email: updateFields.email,
  });

  const response = await gustoApiRequest.call(this, 'PUT', `/v1/contractors/${contractorId}`, body);

  return response;
}
