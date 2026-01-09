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
        resource: ['benefit'],
        operation: ['createCompany'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Benefit Type',
    name: 'benefitType',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['benefit'],
        operation: ['createCompany'],
      },
    },
    description: 'The type of benefit (e.g., Health Insurance, 401k)',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['benefit'],
        operation: ['createCompany'],
      },
    },
    description: 'A description of the benefit',
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
        operation: ['createCompany'],
      },
    },
    options: [
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the benefit is active',
      },
      {
        displayName: 'Responsible for Employer Taxes',
        name: 'responsibleForEmployerTaxes',
        type: 'boolean',
        default: false,
        description: 'Whether the benefit is responsible for employer taxes',
      },
      {
        displayName: 'Responsible for Employee W2',
        name: 'responsibleForEmployeeW2',
        type: 'boolean',
        default: false,
        description: 'Whether the benefit is responsible for employee W2',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const benefitType = this.getNodeParameter('benefitType', index) as string;
  const description = this.getNodeParameter('description', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as IDataObject;

  const body: IDataObject = cleanObject({
    benefit_type: benefitType,
    description,
    active: additionalOptions.active,
    responsible_for_employer_taxes: additionalOptions.responsibleForEmployerTaxes,
    responsible_for_employee_w2: additionalOptions.responsibleForEmployeeW2,
  });

  const response = await gustoApiRequest.call(
    this,
    'POST',
    `/v1/companies/${companyId}/company_benefits`,
    body,
  );

  return response;
}
