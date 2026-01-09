/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { gustoApiRequest } from '../../GenericFunctions';

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
        operation: ['get'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Payroll ID',
    name: 'payrollId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['get'],
      },
    },
    description: 'The UUID of the payroll to retrieve',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['get'],
      },
    },
    options: [
      {
        displayName: 'Include',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Benefits', value: 'benefits' },
          { name: 'Deductions', value: 'deductions' },
          { name: 'Taxes', value: 'taxes' },
        ],
        default: [],
        description: 'Additional data to include in the response',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const payrollId = this.getNodeParameter('payrollId', index) as string;
  const options = this.getNodeParameter('options', index) as IDataObject;

  const query: IDataObject = {};

  if (options.include && (options.include as string[]).length > 0) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await gustoApiRequest.call(
    this,
    'GET',
    `/v1/companies/${companyId}/payrolls/${payrollId}`,
    {},
    query,
  );

  return response;
}
