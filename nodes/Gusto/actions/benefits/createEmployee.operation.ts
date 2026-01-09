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
    displayName: 'Employee ID',
    name: 'employeeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['benefit'],
        operation: ['createEmployee'],
      },
    },
    description: 'The UUID of the employee',
  },
  {
    displayName: 'Company Benefit ID',
    name: 'companyBenefitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['benefit'],
        operation: ['createEmployee'],
      },
    },
    description: 'The UUID of the company benefit to enroll the employee in',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['benefit'],
        operation: ['createEmployee'],
      },
    },
    options: [
      {
        displayName: 'Employee Deduction',
        name: 'employeeDeduction',
        type: 'number',
        typeOptions: {
          numberPrecision: 2,
        },
        default: 0,
        description: 'The employee deduction amount',
      },
      {
        displayName: 'Company Contribution',
        name: 'companyContribution',
        type: 'number',
        typeOptions: {
          numberPrecision: 2,
        },
        default: 0,
        description: 'The company contribution amount',
      },
      {
        displayName: 'Deduct as Percentage',
        name: 'deductAsPercentage',
        type: 'boolean',
        default: false,
        description: 'Whether to deduct as a percentage of pay',
      },
      {
        displayName: 'Contribute as Percentage',
        name: 'contributeAsPercentage',
        type: 'boolean',
        default: false,
        description: 'Whether to contribute as a percentage of pay',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the benefit enrollment is active',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const employeeId = this.getNodeParameter('employeeId', index) as string;
  const companyBenefitId = this.getNodeParameter('companyBenefitId', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    company_benefit_id: companyBenefitId,
    employee_deduction: additionalOptions.employeeDeduction
      ? (additionalOptions.employeeDeduction as number).toString()
      : undefined,
    company_contribution: additionalOptions.companyContribution
      ? (additionalOptions.companyContribution as number).toString()
      : undefined,
    deduct_as_percentage: additionalOptions.deductAsPercentage,
    contribute_as_percentage: additionalOptions.contributeAsPercentage,
    active: additionalOptions.active,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/employees/${employeeId}/employee_benefits`,
    body,
  );

  return response;
}
