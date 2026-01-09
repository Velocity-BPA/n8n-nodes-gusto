/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';
import { gustoApiRequest } from './GenericFunctions';

export class GustoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gusto Trigger',
    name: 'gustoTrigger',
    icon: 'file:gusto.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Listen for Gusto webhook events',
    defaults: {
      name: 'Gusto Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'gustoOAuth2Api',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Company ID',
        name: 'companyId',
        type: 'string',
        required: true,
        default: '',
        description: 'The UUID of the company to listen for events',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: 'employee.created',
        options: [
          {
            name: 'Company Benefit Created',
            value: 'company_benefit.created',
          },
          {
            name: 'Contractor Created',
            value: 'contractor.created',
          },
          {
            name: 'Contractor Payment Created',
            value: 'contractor_payment.created',
          },
          {
            name: 'Employee Created',
            value: 'employee.created',
          },
          {
            name: 'Employee Terminated',
            value: 'employee.terminated',
          },
          {
            name: 'Employee Updated',
            value: 'employee.updated',
          },
          {
            name: 'Payroll Created',
            value: 'payroll.created',
          },
          {
            name: 'Payroll Processed',
            value: 'payroll.processed',
          },
          {
            name: 'Time Off Request Approved',
            value: 'time_off_request.approved',
          },
          {
            name: 'Time Off Request Created',
            value: 'time_off_request.created',
          },
          {
            name: 'Time Off Request Denied',
            value: 'time_off_request.denied',
          },
        ],
        description: 'The event to listen for',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const companyId = this.getNodeParameter('companyId') as string;
        const event = this.getNodeParameter('event') as string;

        try {
          const webhooks = await gustoApiRequest.call(
            this,
            'GET',
            `/v1/companies/${companyId}/webhooks`,
          );

          for (const webhook of webhooks) {
            if (
              webhook.url === webhookUrl &&
              webhook.subscription_types &&
              Array.isArray(webhook.subscription_types) &&
              webhook.subscription_types.includes(event)
            ) {
              const webhookData = this.getWorkflowStaticData('node');
              webhookData.webhookId = webhook.uuid;
              return true;
            }
          }
        } catch (error) {
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const companyId = this.getNodeParameter('companyId') as string;
        const event = this.getNodeParameter('event') as string;

        const body: IDataObject = {
          url: webhookUrl,
          subscription_types: [event],
        };

        try {
          const webhook = await gustoApiRequest.call(
            this,
            'POST',
            `/v1/companies/${companyId}/webhooks`,
            body,
          );

          const webhookData = this.getWorkflowStaticData('node');
          webhookData.webhookId = webhook.uuid;
          return true;
        } catch (error) {
          return false;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const companyId = this.getNodeParameter('companyId') as string;

        if (webhookData.webhookId) {
          try {
            await gustoApiRequest.call(
              this,
              'DELETE',
              `/v1/companies/${companyId}/webhooks/${webhookData.webhookId}`,
            );
          } catch (error) {
            return false;
          }
        }

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData();
    const event = this.getNodeParameter('event') as string;

    // Verify the event type matches what we're listening for
    if (bodyData.event_type !== event) {
      return {
        workflowData: [],
      };
    }

    return {
      workflowData: [this.helpers.returnJsonArray(bodyData as IDataObject)],
    };
  }
}
