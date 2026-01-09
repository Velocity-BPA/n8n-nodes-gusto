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
        resource: ['contractorPayment'],
        operation: ['create'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Contractor ID',
    name: 'contractorId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractorPayment'],
        operation: ['create'],
      },
    },
    description: 'The UUID of the contractor',
  },
  {
    displayName: 'Payment Date',
    name: 'date',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contractorPayment'],
        operation: ['create'],
      },
    },
    description: 'The date of the payment',
  },
  {
    displayName: 'Wage Amount',
    name: 'wage',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
    },
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['contractorPayment'],
        operation: ['create'],
      },
    },
    description: 'The wage amount for this payment',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['contractorPayment'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Reimbursement',
        name: 'reimbursement',
        type: 'number',
        typeOptions: {
          numberPrecision: 2,
        },
        default: 0,
        description: 'Reimbursement amount',
      },
      {
        displayName: 'Bonus',
        name: 'bonus',
        type: 'number',
        typeOptions: {
          numberPrecision: 2,
        },
        default: 0,
        description: 'Bonus amount',
      },
      {
        displayName: 'Hours',
        name: 'hours',
        type: 'number',
        typeOptions: {
          numberPrecision: 2,
        },
        default: 0,
        description: 'Hours worked (for hourly contractors)',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const contractorId = this.getNodeParameter('contractorId', index) as string;
  const date = this.getNodeParameter('date', index) as string;
  const wage = this.getNodeParameter('wage', index) as number;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    contractor_id: contractorId,
    date: formatDate(date),
    wage: wage.toString(),
    reimbursement: additionalOptions.reimbursement
      ? (additionalOptions.reimbursement as number).toString()
      : undefined,
    bonus: additionalOptions.bonus
      ? (additionalOptions.bonus as number).toString()
      : undefined,
    hours: additionalOptions.hours
      ? (additionalOptions.hours as number).toString()
      : undefined,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/companies/${companyId}/contractor_payments`,
    body,
  );

  return response;
}
