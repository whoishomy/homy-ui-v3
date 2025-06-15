export const VALIDATION_RULES = [
  { field: 'name', message: 'Name is required' },
  { field: 'email', message: 'Email is required' },
  { field: 'phone', message: 'Phone is required' },
  { field: 'address', message: 'Address is required' },
];

export const logValidationError = jest.fn();
