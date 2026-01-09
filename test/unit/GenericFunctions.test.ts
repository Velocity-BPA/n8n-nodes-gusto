/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { cleanObject, formatDate, isValidUuid, buildFilterQuery, parseGustoError, getBaseUrl } from '../../nodes/Gusto/GenericFunctions';
import type { IDataObject } from 'n8n-workflow';

describe('GenericFunctions', () => {
  describe('cleanObject', () => {
    it('should remove undefined values from object', () => {
      const input: IDataObject = {
        name: 'John',
        age: undefined,
        city: 'New York',
        email: undefined,
      };
      const result = cleanObject(input);
      expect(result).toEqual({
        name: 'John',
        city: 'New York',
      });
    });

    it('should remove null values from object', () => {
      const input: IDataObject = {
        name: 'John',
        age: null,
      };
      const result = cleanObject(input);
      expect(result).toEqual({
        name: 'John',
      });
    });

    it('should remove empty strings from object', () => {
      const input: IDataObject = {
        name: 'John',
        nickname: '',
      };
      const result = cleanObject(input);
      expect(result).toEqual({
        name: 'John',
      });
    });

    it('should preserve zero values', () => {
      const input: IDataObject = {
        name: 'John',
        age: 0,
      };
      const result = cleanObject(input);
      expect(result).toEqual({
        name: 'John',
        age: 0,
      });
    });

    it('should preserve false values', () => {
      const input: IDataObject = {
        name: 'John',
        active: false,
      };
      const result = cleanObject(input);
      expect(result).toEqual({
        name: 'John',
        active: false,
      });
    });

    it('should return empty object when all values are undefined', () => {
      const input: IDataObject = {
        name: undefined,
        age: undefined,
      };
      const result = cleanObject(input);
      expect(result).toEqual({});
    });
  });

  describe('formatDate', () => {
    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date('2024-06-15T12:00:00Z');
      const result = formatDate(date);
      expect(result).toBe('2024-06-15');
    });

    it('should format ISO date string to YYYY-MM-DD', () => {
      const result = formatDate('2024-06-15T12:00:00.000Z');
      expect(result).toBe('2024-06-15');
    });

    it('should return YYYY-MM-DD string as is', () => {
      const result = formatDate('2024-06-15');
      expect(result).toBe('2024-06-15');
    });
  });

  describe('isValidUuid', () => {
    it('should return true for valid UUID', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    it('should return true for uppercase UUID', () => {
      expect(isValidUuid('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidUuid('')).toBe(false);
    });

    it('should return false for UUID with wrong format', () => {
      expect(isValidUuid('123e4567e89b12d3a456426614174000')).toBe(false);
    });
  });

  describe('buildFilterQuery', () => {
    it('should build query object from filters', () => {
      const filters: IDataObject = {
        status: 'pending',
        employeeId: '123',
        startDate: '2024-01-01',
      };
      const result = buildFilterQuery(filters);
      expect(result).toEqual({
        status: 'pending',
        employeeId: '123',
        startDate: '2024-01-01',
      });
    });

    it('should skip undefined values', () => {
      const filters: IDataObject = {
        status: 'pending',
        employeeId: undefined,
      };
      const result = buildFilterQuery(filters);
      expect(result).toEqual({
        status: 'pending',
      });
    });

    it('should skip null values', () => {
      const filters: IDataObject = {
        status: 'pending',
        employeeId: null,
      };
      const result = buildFilterQuery(filters);
      expect(result).toEqual({
        status: 'pending',
      });
    });

    it('should skip empty strings', () => {
      const filters: IDataObject = {
        status: 'pending',
        employeeId: '',
      };
      const result = buildFilterQuery(filters);
      expect(result).toEqual({
        status: 'pending',
      });
    });

    it('should return empty object for empty filters', () => {
      const result = buildFilterQuery({});
      expect(result).toEqual({});
    });
  });

  describe('parseGustoError', () => {
    it('should parse error with error field', () => {
      const error = {
        response: {
          body: {
            error: 'Invalid request',
          },
        },
      };
      const result = parseGustoError(error);
      expect(result).toBe('Invalid request');
    });

    it('should parse error with errors array', () => {
      const error = {
        response: {
          body: {
            errors: [
              { message: 'First error' },
              { message: 'Second error' },
            ],
          },
        },
      };
      const result = parseGustoError(error);
      expect(result).toBe('First error, Second error');
    });

    it('should parse error with message field', () => {
      const error = {
        response: {
          body: {
            message: 'Error message',
          },
        },
      };
      const result = parseGustoError(error);
      expect(result).toBe('Error message');
    });

    it('should return message from error object', () => {
      const error = {
        message: 'Direct error message',
      };
      const result = parseGustoError(error);
      expect(result).toBe('Direct error message');
    });

    it('should return default message for unknown error', () => {
      const error = {};
      const result = parseGustoError(error);
      expect(result).toBe('An unknown error occurred');
    });
  });

  describe('getBaseUrl', () => {
    it('should return production URL for production environment', () => {
      const credentials: IDataObject = { environment: 'production' };
      const result = getBaseUrl(credentials);
      expect(result).toBe('https://api.gusto.com');
    });

    it('should return demo URL for demo environment', () => {
      const credentials: IDataObject = { environment: 'demo' };
      const result = getBaseUrl(credentials);
      expect(result).toBe('https://api.gusto-demo.com');
    });

    it('should return demo URL for undefined environment', () => {
      const credentials: IDataObject = {};
      const result = getBaseUrl(credentials);
      expect(result).toBe('https://api.gusto-demo.com');
    });
  });
});
