/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';

import * as company from './actions/company';
import * as employee from './actions/employee';
import * as job from './actions/job';
import * as payroll from './actions/payroll';
import * as contractor from './actions/contractor';
import * as contractorPayment from './actions/contractorPayment';
import * as timeOff from './actions/timeOff';
import * as benefits from './actions/benefits';

export class Gusto implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gusto',
    name: 'gusto',
    icon: 'file:gusto.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage HR, payroll, and benefits with Gusto',
    defaults: {
      name: 'Gusto',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'gustoOAuth2Api',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Benefit',
            value: 'benefit',
          },
          {
            name: 'Company',
            value: 'company',
          },
          {
            name: 'Contractor',
            value: 'contractor',
          },
          {
            name: 'Contractor Payment',
            value: 'contractorPayment',
          },
          {
            name: 'Employee',
            value: 'employee',
          },
          {
            name: 'Job',
            value: 'job',
          },
          {
            name: 'Payroll',
            value: 'payroll',
          },
          {
            name: 'Time Off',
            value: 'timeOff',
          },
        ],
        default: 'employee',
      },
      // Company operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['company'],
          },
        },
        options: [
          {
            name: 'Create Location',
            value: 'createLocation',
            description: 'Create a new location for a company',
            action: 'Create a location',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a company by ID',
            action: 'Get a company',
          },
          {
            name: 'Get Locations',
            value: 'getLocations',
            description: 'Get all locations for a company',
            action: 'Get company locations',
          },
          {
            name: 'Get Pay Schedules',
            value: 'getPaySchedules',
            description: 'Get all pay schedules for a company',
            action: 'Get pay schedules',
          },
        ],
        default: 'get',
      },
      // Employee operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['employee'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new employee',
            action: 'Create an employee',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get an employee by ID',
            action: 'Get an employee',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List all employees',
            action: 'List employees',
          },
          {
            name: 'Terminate',
            value: 'terminate',
            description: 'Terminate an employee',
            action: 'Terminate an employee',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update an employee',
            action: 'Update an employee',
          },
        ],
        default: 'list',
      },
      // Job operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['job'],
          },
        },
        options: [
          {
            name: 'Compensation',
            value: 'compensation',
            description: 'Get or create compensations for a job',
            action: 'Manage compensation',
          },
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new job for an employee',
            action: 'Create a job',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List all jobs for an employee',
            action: 'List jobs',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a job',
            action: 'Update a job',
          },
        ],
        default: 'list',
      },
      // Payroll operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['payroll'],
          },
        },
        options: [
          {
            name: 'Calculate',
            value: 'calculate',
            description: 'Calculate payroll taxes',
            action: 'Calculate payroll',
          },
          {
            name: 'Cancel',
            value: 'cancel',
            description: 'Cancel an unprocessed payroll',
            action: 'Cancel payroll',
          },
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new payroll',
            action: 'Create a payroll',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a payroll by ID',
            action: 'Get a payroll',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List all payrolls',
            action: 'List payrolls',
          },
          {
            name: 'Submit',
            value: 'submit',
            description: 'Submit a payroll for processing',
            action: 'Submit payroll',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a payroll',
            action: 'Update a payroll',
          },
        ],
        default: 'list',
      },
      // Contractor operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['contractor'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new contractor',
            action: 'Create a contractor',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a contractor by ID',
            action: 'Get a contractor',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List all contractors',
            action: 'List contractors',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a contractor',
            action: 'Update a contractor',
          },
        ],
        default: 'list',
      },
      // Contractor Payment operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['contractorPayment'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a contractor payment',
            action: 'Create a payment',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List contractor payments',
            action: 'List payments',
          },
        ],
        default: 'list',
      },
      // Time Off operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['timeOff'],
          },
        },
        options: [
          {
            name: 'Approve',
            value: 'approve',
            description: 'Approve a time off request',
            action: 'Approve time off',
          },
          {
            name: 'Create',
            value: 'create',
            description: 'Create a time off request',
            action: 'Create time off request',
          },
          {
            name: 'Deny',
            value: 'deny',
            description: 'Deny a time off request',
            action: 'Deny time off',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a time off request',
            action: 'Get time off request',
          },
          {
            name: 'Get Policies',
            value: 'getPolicies',
            description: 'Get time off policies',
            action: 'Get time off policies',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List time off requests',
            action: 'List time off requests',
          },
        ],
        default: 'list',
      },
      // Benefits operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['benefit'],
          },
        },
        options: [
          {
            name: 'Create Company Benefit',
            value: 'createCompany',
            description: 'Create a company benefit',
            action: 'Create company benefit',
          },
          {
            name: 'Create Employee Benefit',
            value: 'createEmployee',
            description: 'Enroll an employee in a benefit',
            action: 'Create employee benefit',
          },
          {
            name: 'Get Company Benefit',
            value: 'getCompany',
            description: 'Get a company benefit',
            action: 'Get company benefit',
          },
          {
            name: 'List Company Benefits',
            value: 'listCompany',
            description: 'List all company benefits',
            action: 'List company benefits',
          },
          {
            name: 'List Employee Benefits',
            value: 'listEmployee',
            description: 'List employee benefits',
            action: 'List employee benefits',
          },
        ],
        default: 'listCompany',
      },
      // Company operation parameters
      ...company.get.description,
      ...company.getLocations.description,
      ...company.createLocation.description,
      ...company.getPaySchedules.description,
      // Employee operation parameters
      ...employee.list.description,
      ...employee.get.description,
      ...employee.create.description,
      ...employee.update.description,
      ...employee.terminate.description,
      // Job operation parameters
      ...job.list.description,
      ...job.create.description,
      ...job.update.description,
      ...job.compensation.description,
      // Payroll operation parameters
      ...payroll.list.description,
      ...payroll.get.description,
      ...payroll.create.description,
      ...payroll.update.description,
      ...payroll.submit.description,
      ...payroll.calculate.description,
      ...payroll.cancel.description,
      // Contractor operation parameters
      ...contractor.list.description,
      ...contractor.get.description,
      ...contractor.create.description,
      ...contractor.update.description,
      // Contractor Payment operation parameters
      ...contractorPayment.list.description,
      ...contractorPayment.create.description,
      // Time Off operation parameters
      ...timeOff.list.description,
      ...timeOff.get.description,
      ...timeOff.create.description,
      ...timeOff.approve.description,
      ...timeOff.deny.description,
      ...timeOff.getPolicies.description,
      // Benefits operation parameters
      ...benefits.listCompany.description,
      ...benefits.getCompany.description,
      ...benefits.createCompany.description,
      ...benefits.listEmployee.description,
      ...benefits.createEmployee.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        switch (resource) {
          case 'company':
            switch (operation) {
              case 'get':
                responseData = await company.get.execute.call(this, i);
                break;
              case 'getLocations':
                responseData = await company.getLocations.execute.call(this, i);
                break;
              case 'createLocation':
                responseData = await company.createLocation.execute.call(this, i);
                break;
              case 'getPaySchedules':
                responseData = await company.getPaySchedules.execute.call(this, i);
                break;
            }
            break;

          case 'employee':
            switch (operation) {
              case 'list':
                responseData = await employee.list.execute.call(this, i);
                break;
              case 'get':
                responseData = await employee.get.execute.call(this, i);
                break;
              case 'create':
                responseData = await employee.create.execute.call(this, i);
                break;
              case 'update':
                responseData = await employee.update.execute.call(this, i);
                break;
              case 'terminate':
                responseData = await employee.terminate.execute.call(this, i);
                break;
            }
            break;

          case 'job':
            switch (operation) {
              case 'list':
                responseData = await job.list.execute.call(this, i);
                break;
              case 'create':
                responseData = await job.create.execute.call(this, i);
                break;
              case 'update':
                responseData = await job.update.execute.call(this, i);
                break;
              case 'compensation':
                responseData = await job.compensation.execute.call(this, i);
                break;
            }
            break;

          case 'payroll':
            switch (operation) {
              case 'list':
                responseData = await payroll.list.execute.call(this, i);
                break;
              case 'get':
                responseData = await payroll.get.execute.call(this, i);
                break;
              case 'create':
                responseData = await payroll.create.execute.call(this, i);
                break;
              case 'update':
                responseData = await payroll.update.execute.call(this, i);
                break;
              case 'submit':
                responseData = await payroll.submit.execute.call(this, i);
                break;
              case 'calculate':
                responseData = await payroll.calculate.execute.call(this, i);
                break;
              case 'cancel':
                responseData = await payroll.cancel.execute.call(this, i);
                break;
            }
            break;

          case 'contractor':
            switch (operation) {
              case 'list':
                responseData = await contractor.list.execute.call(this, i);
                break;
              case 'get':
                responseData = await contractor.get.execute.call(this, i);
                break;
              case 'create':
                responseData = await contractor.create.execute.call(this, i);
                break;
              case 'update':
                responseData = await contractor.update.execute.call(this, i);
                break;
            }
            break;

          case 'contractorPayment':
            switch (operation) {
              case 'list':
                responseData = await contractorPayment.list.execute.call(this, i);
                break;
              case 'create':
                responseData = await contractorPayment.create.execute.call(this, i);
                break;
            }
            break;

          case 'timeOff':
            switch (operation) {
              case 'list':
                responseData = await timeOff.list.execute.call(this, i);
                break;
              case 'get':
                responseData = await timeOff.get.execute.call(this, i);
                break;
              case 'create':
                responseData = await timeOff.create.execute.call(this, i);
                break;
              case 'approve':
                responseData = await timeOff.approve.execute.call(this, i);
                break;
              case 'deny':
                responseData = await timeOff.deny.execute.call(this, i);
                break;
              case 'getPolicies':
                responseData = await timeOff.getPolicies.execute.call(this, i);
                break;
            }
            break;

          case 'benefit':
            switch (operation) {
              case 'listCompany':
                responseData = await benefits.listCompany.execute.call(this, i);
                break;
              case 'getCompany':
                responseData = await benefits.getCompany.execute.call(this, i);
                break;
              case 'createCompany':
                responseData = await benefits.createCompany.execute.call(this, i);
                break;
              case 'listEmployee':
                responseData = await benefits.listEmployee.execute.call(this, i);
                break;
              case 'createEmployee':
                responseData = await benefits.createEmployee.execute.call(this, i);
                break;
            }
            break;
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: (error as Error).message }),
            { itemData: { item: i } },
          );
          returnData.push(...executionErrorData);
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
