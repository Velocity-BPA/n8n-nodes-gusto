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
    displayName: 'Employee ID',
    name: 'employeeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['terminate'],
      },
    },
    description: 'The UUID of the employee to terminate',
  },
  {
    displayName: 'Effective Date',
    name: 'effectiveDate',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['terminate'],
      },
    },
    description: 'The effective date of the termination',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['employee'],
        operation: ['terminate'],
      },
    },
    options: [
      {
        displayName: 'Run Termination Payroll',
        name: 'runTerminationPayroll',
        type: 'boolean',
        default: false,
        description: 'Whether to run a final payroll for the terminated employee',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const employeeId = this.getNodeParameter('employeeId', index) as string;
  const effectiveDate = this.getNodeParameter('effectiveDate', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    effective_date: formatDate(effectiveDate),
    run_termination_payroll: additionalOptions.runTerminationPayroll,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/employees/${employeeId}/terminations`,
    body,
  );

  return response;
}
