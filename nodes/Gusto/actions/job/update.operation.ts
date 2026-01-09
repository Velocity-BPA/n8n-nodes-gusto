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
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['update'],
      },
    },
    description: 'The UUID of the job to update',
  },
  {
    displayName: 'Version',
    name: 'version',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['update'],
      },
    },
    description:
      'The current version of the job record for optimistic locking. Get this from a prior GET request.',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The job title',
      },
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
  const jobId = this.getNodeParameter('jobId', index) as string;
  const version = this.getNodeParameter('version', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = cleanObject({
    version,
    title: updateFields.title,
    location_id: updateFields.locationId,
  });

  const response = await gustoApiRequest.call(this, 'PUT', `/v1/jobs/${jobId}`, body);

  return response;
}
