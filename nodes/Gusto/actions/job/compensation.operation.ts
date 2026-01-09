/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, cleanObject, formatDate } from '../../GenericFunctions';
import { paymentUnitOptions, flsaStatusOptions } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Compensation Action',
    name: 'compensationAction',
    type: 'options',
    options: [
      {
        name: 'Get Compensations',
        value: 'get',
        description: 'Get all compensations for a job',
      },
      {
        name: 'Create Compensation',
        value: 'create',
        description: 'Create a new compensation for a job',
      },
    ],
    required: true,
    default: 'get',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['compensation'],
      },
    },
    description: 'Action to perform on compensations',
  },
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['compensation'],
      },
    },
    description: 'The UUID of the job',
  },
  // Create compensation fields
  {
    displayName: 'Rate',
    name: 'rate',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
    },
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['compensation'],
        compensationAction: ['create'],
      },
    },
    description: 'The pay rate for this compensation',
  },
  {
    displayName: 'Payment Unit',
    name: 'paymentUnit',
    type: 'options',
    options: paymentUnitOptions,
    required: true,
    default: 'Hour',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['compensation'],
        compensationAction: ['create'],
      },
    },
    description: 'The payment unit (hourly, weekly, etc.)',
  },
  {
    displayName: 'FLSA Status',
    name: 'flsaStatus',
    type: 'options',
    options: flsaStatusOptions,
    required: true,
    default: 'Nonexempt',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['compensation'],
        compensationAction: ['create'],
      },
    },
    description: 'The FLSA (Fair Labor Standards Act) status',
  },
  {
    displayName: 'Effective Date',
    name: 'effectiveDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['compensation'],
        compensationAction: ['create'],
      },
    },
    description: 'The effective date of this compensation',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const compensationAction = this.getNodeParameter('compensationAction', index) as string;
  const jobId = this.getNodeParameter('jobId', index) as string;

  if (compensationAction === 'get') {
    const response = await gustoApiRequest.call(this, 'GET', `/v1/jobs/${jobId}/compensations`);
    return response;
  } else {
    // create
    const rate = this.getNodeParameter('rate', index) as number;
    const paymentUnit = this.getNodeParameter('paymentUnit', index) as string;
    const flsaStatus = this.getNodeParameter('flsaStatus', index) as string;
    const effectiveDate = this.getNodeParameter('effectiveDate', index) as string;

    const body: IDataObject = cleanObject({
      rate: rate.toString(),
      payment_unit: paymentUnit,
      flsa_status: flsaStatus,
      effective_date: formatDate(effectiveDate),
    });

    const response = await gustoApiRequest.call(
      this,
      'POST',
      `/v1/jobs/${jobId}/compensations`,
      body,
    );

    return response;
  }
}
