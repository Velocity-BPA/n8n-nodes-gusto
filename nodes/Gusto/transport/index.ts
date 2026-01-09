/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export * from '../GenericFunctions';

import type { IDataObject, INodePropertyOptions } from 'n8n-workflow';

/**
 * Resource options for the main Gusto node
 */
export const resourceOptions: INodePropertyOptions[] = [
  { name: 'Company', value: 'company' },
  { name: 'Employee', value: 'employee' },
  { name: 'Job', value: 'job' },
  { name: 'Payroll', value: 'payroll' },
  { name: 'Contractor', value: 'contractor' },
  { name: 'Contractor Payment', value: 'contractorPayment' },
  { name: 'Time Off', value: 'timeOff' },
  { name: 'Benefit', value: 'benefit' },
];

/**
 * US State options for address fields
 */
export const stateOptions: INodePropertyOptions[] = [
  { name: 'Alabama', value: 'AL' },
  { name: 'Alaska', value: 'AK' },
  { name: 'Arizona', value: 'AZ' },
  { name: 'Arkansas', value: 'AR' },
  { name: 'California', value: 'CA' },
  { name: 'Colorado', value: 'CO' },
  { name: 'Connecticut', value: 'CT' },
  { name: 'Delaware', value: 'DE' },
  { name: 'Florida', value: 'FL' },
  { name: 'Georgia', value: 'GA' },
  { name: 'Hawaii', value: 'HI' },
  { name: 'Idaho', value: 'ID' },
  { name: 'Illinois', value: 'IL' },
  { name: 'Indiana', value: 'IN' },
  { name: 'Iowa', value: 'IA' },
  { name: 'Kansas', value: 'KS' },
  { name: 'Kentucky', value: 'KY' },
  { name: 'Louisiana', value: 'LA' },
  { name: 'Maine', value: 'ME' },
  { name: 'Maryland', value: 'MD' },
  { name: 'Massachusetts', value: 'MA' },
  { name: 'Michigan', value: 'MI' },
  { name: 'Minnesota', value: 'MN' },
  { name: 'Mississippi', value: 'MS' },
  { name: 'Missouri', value: 'MO' },
  { name: 'Montana', value: 'MT' },
  { name: 'Nebraska', value: 'NE' },
  { name: 'Nevada', value: 'NV' },
  { name: 'New Hampshire', value: 'NH' },
  { name: 'New Jersey', value: 'NJ' },
  { name: 'New Mexico', value: 'NM' },
  { name: 'New York', value: 'NY' },
  { name: 'North Carolina', value: 'NC' },
  { name: 'North Dakota', value: 'ND' },
  { name: 'Ohio', value: 'OH' },
  { name: 'Oklahoma', value: 'OK' },
  { name: 'Oregon', value: 'OR' },
  { name: 'Pennsylvania', value: 'PA' },
  { name: 'Rhode Island', value: 'RI' },
  { name: 'South Carolina', value: 'SC' },
  { name: 'South Dakota', value: 'SD' },
  { name: 'Tennessee', value: 'TN' },
  { name: 'Texas', value: 'TX' },
  { name: 'Utah', value: 'UT' },
  { name: 'Vermont', value: 'VT' },
  { name: 'Virginia', value: 'VA' },
  { name: 'Washington', value: 'WA' },
  { name: 'West Virginia', value: 'WV' },
  { name: 'Wisconsin', value: 'WI' },
  { name: 'Wyoming', value: 'WY' },
  { name: 'District of Columbia', value: 'DC' },
];

/**
 * Payment unit options for compensation
 */
export const paymentUnitOptions: INodePropertyOptions[] = [
  { name: 'Hour', value: 'Hour' },
  { name: 'Week', value: 'Week' },
  { name: 'Month', value: 'Month' },
  { name: 'Year', value: 'Year' },
  { name: 'Paycheck', value: 'Paycheck' },
];

/**
 * FLSA status options
 */
export const flsaStatusOptions: INodePropertyOptions[] = [
  { name: 'Exempt', value: 'Exempt' },
  { name: 'Nonexempt', value: 'Nonexempt' },
  { name: 'Owner', value: 'Owner' },
  { name: 'Commission Only Exempt', value: 'Commission Only Exempt' },
  { name: 'Commission Only Nonexempt', value: 'Commission Only Nonexempt' },
];

/**
 * Time off request status options
 */
export const timeOffStatusOptions: INodePropertyOptions[] = [
  { name: 'Pending', value: 'pending' },
  { name: 'Approved', value: 'approved' },
  { name: 'Denied', value: 'denied' },
];

/**
 * Contractor type options
 */
export const contractorTypeOptions: INodePropertyOptions[] = [
  { name: 'Individual', value: 'Individual' },
  { name: 'Business', value: 'Business' },
];

/**
 * Off-cycle payroll reason options
 */
export const offCycleReasonOptions: INodePropertyOptions[] = [
  { name: 'Bonus', value: 'Bonus' },
  { name: 'Correction', value: 'Correction' },
  { name: 'Dismissed Employee', value: 'Dismissed' },
  { name: 'Transition', value: 'Transition' },
];

/**
 * Webhook event types for trigger node
 */
export const webhookEventTypes: INodePropertyOptions[] = [
  { name: 'Employee Created', value: 'employee.created' },
  { name: 'Employee Updated', value: 'employee.updated' },
  { name: 'Employee Terminated', value: 'employee.terminated' },
  { name: 'Payroll Processed', value: 'payroll.processed' },
  { name: 'Payroll Created', value: 'payroll.created' },
  { name: 'Contractor Created', value: 'contractor.created' },
  { name: 'Contractor Payment Created', value: 'contractor_payment.created' },
  { name: 'Time Off Request Created', value: 'time_off_request.created' },
  { name: 'Time Off Request Approved', value: 'time_off_request.approved' },
  { name: 'Time Off Request Denied', value: 'time_off_request.denied' },
  { name: 'Company Benefit Created', value: 'company_benefit.created' },
];

/**
 * Map internal resource names to Gusto API endpoints
 */
export const resourceEndpoints: IDataObject = {
  company: '/v1/companies',
  employee: '/v1/employees',
  job: '/v1/jobs',
  payroll: '/v1/payrolls',
  contractor: '/v1/contractors',
  contractorPayment: '/v1/contractor_payments',
  timeOff: '/v1/time_off_requests',
  benefit: '/v1/company_benefits',
};
