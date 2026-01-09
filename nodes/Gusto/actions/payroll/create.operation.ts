/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest, cleanObject, formatDate } from '../../GenericFunctions';
import { offCycleReasonOptions } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['create'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['create'],
      },
    },
    description: 'The start date of the pay period',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['create'],
      },
    },
    description: 'The end date of the pay period',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Off-Cycle',
        name: 'offCycle',
        type: 'boolean',
        default: false,
        description: 'Whether this is an off-cycle payroll',
      },
      {
        displayName: 'Off-Cycle Reason',
        name: 'offCycleReason',
        type: 'options',
        options: offCycleReasonOptions,
        default: 'Bonus',
        description: 'The reason for the off-cycle payroll (required if off-cycle is true)',
      },
      {
        displayName: 'Pay Schedule ID',
        name: 'payScheduleId',
        type: 'string',
        default: '',
        description: 'The UUID of the pay schedule to use',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const startDate = this.getNodeParameter('startDate', index) as string;
  const endDate = this.getNodeParameter('endDate', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    off_cycle: additionalOptions.offCycle,
    off_cycle_reason: additionalOptions.offCycle ? additionalOptions.offCycleReason : undefined,
    pay_schedule_id: additionalOptions.payScheduleId,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/companies/${companyId}/payrolls`,
    body,
  );

  return response;
}
