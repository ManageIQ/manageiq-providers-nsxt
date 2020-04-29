export const mustBeNumber = value =>
  isNaN(value) ? "Must be a number" : undefined;
export const minValue = min => value =>
  isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;
export const maxValue = max => value =>
  isNaN(value) || value <= max ? undefined : `Should be less than ${max}`;
export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);
export const selectionRequired = value =>
  !_.isArray(value) || value.length === 0 ? "A least one value must be selected" : undefined;
