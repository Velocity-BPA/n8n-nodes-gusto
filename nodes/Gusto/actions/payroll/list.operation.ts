/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import {
  gustoApiRequest,
  gustoApiRequestAllItems,
  buildFilterQuery,
  formatDate,
} from '../../GenericFunctions';

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
        operation: ['list'],
      },
    },
    description: 'The UUID of the company',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['list'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['payroll'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Processed',
        name: 'processed',
        type: 'boolean',
        default: false,
        description: 'Filter by processed status',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        description: 'Start of date range filter',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        description: 'End of date range filter',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject | IDataObject[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const query: IDataObject = {};

  if (filters.processed !== undefined) {
    query.processed = filters.processed;
  }
  if (filters.startDate) {
    query.start_date = formatDate(filters.startDate as string);
  }
  if (filters.endDate) {
    query.end_date = formatDate(filters.endDate as string);
  }

  const cleanQuery = buildFilterQuery(query);

  if (returnAll) {
    const response = await gustoApiRequestAllItems.call(
      this,
      'GET',
      `/v1/companies/${companyId}/payrolls`,
      {},
      cleanQuery,
    );
    return response;
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    const response = await gustoApiRequest.call(
      this,
      'GET',
      `/v1/companies/${companyId}/payrolls`,
      {},
      { ...cleanQuery, per: limit },
    );
    return response;
  }
}
