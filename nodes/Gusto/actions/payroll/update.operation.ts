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
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['update'],
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
        operation: ['update'],
      },
    },
    description: 'The UUID of the payroll to update',
  },
  {
    displayName: 'Version',
    name: 'version',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['update'],
      },
    },
    description:
      'The current version of the payroll record for optimistic locking. Get this from a prior GET request.',
  },
  {
    displayName: 'Employee Compensations',
    name: 'employeeCompensations',
    type: 'json',
    default: '[]',
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['update'],
      },
    },
    description:
      'Array of employee compensation adjustments. Each object should include employee_id and relevant pay adjustments.',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const payrollId = this.getNodeParameter('payrollId', index) as string;
  const version = this.getNodeParameter('version', index) as string;
  const employeeCompensationsRaw = this.getNodeParameter('employeeCompensations', index) as string;

  let employeeCompensations: IDataObject[] = [];
  try {
    employeeCompensations = JSON.parse(employeeCompensationsRaw);
  } catch {
    throw new Error('Invalid JSON in Employee Compensations field');
  }

  const body: IDataObject = cleanObject({
    version,
    employee_compensations: employeeCompensations,
  });

  const response = await gustoApiRequest.call(
    this,
    'PUT',
    `/v1/companies/${companyId}/payrolls/${payrollId}`,
    body,
  );

  return response;
}
