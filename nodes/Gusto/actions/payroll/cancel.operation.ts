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
        operation: ['cancel'],
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
        operation: ['cancel'],
      },
    },
    description: 'The UUID of the payroll to cancel',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const payrollId = this.getNodeParameter('payrollId', index) as string;

  const response = await gustoApiRequest.call(
    this,
    'PUT',
    `/v1/companies/${companyId}/payrolls/${payrollId}/cancel`,
  );

  return response;
}
