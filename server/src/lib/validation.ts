import { Response } from 'express';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

interface StringOptions {
  minLength?: number;
  maxLength?: number;
  fieldName?: string;
}

export const requireString = (
  value: unknown,
  { minLength = 1, maxLength = 500, fieldName = 'value' }: StringOptions = {}
) => {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  const normalized = value.trim();

  if (normalized.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`);
  }

  if (normalized.length > maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${maxLength} characters`);
  }

  return normalized;
};

export const optionalString = (
  value: unknown,
  { maxLength = 1000, fieldName = 'value' }: Omit<StringOptions, 'minLength'> = {}
) => {
  if (value == null || value === '') {
    return null;
  }

  return requireString(value, { minLength: 1, maxLength, fieldName });
};

interface IntegerOptions {
  min?: number;
  max?: number;
  fieldName?: string;
}

export const requireInteger = (
  value: unknown,
  { min, max, fieldName = 'value' }: IntegerOptions = {}
) => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  if (typeof min === 'number' && value < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`);
  }

  if (typeof max === 'number' && value > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`);
  }

  return value;
};

export const optionalInteger = (value: unknown, options: IntegerOptions = {}) => {
  if (value == null || value === '') {
    return null;
  }

  return requireInteger(value, options);
};

export const optionalDate = (value: unknown, fieldName = 'date') => {
  if (value == null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a valid date string`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`);
  }

  return parsed;
};

export const normalizeEmail = (value: unknown) => {
  const email = requireString(value, {
    minLength: 3,
    maxLength: 320,
    fieldName: 'email',
  }).toLowerCase();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new ValidationError('email must be a valid email address');
  }

  return email;
};

export const handleRouteError = (res: Response, error: unknown, fallbackMessage: string) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: fallbackMessage });
};
