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
    displayName: 'Company Benefit ID',
    name: 'companyBenefitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['benefit'],
        operation: ['getCompany'],
      },
    },
    description: 'The UUID of the company benefit to retrieve',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyBenefitId = this.getNodeParameter('companyBenefitId', index) as string;

  const response = await gustoApiRequest.call(
    this,
    'GET',
    `/v1/company_benefits/${companyBenefitId}`,
  );

  return response;
}
