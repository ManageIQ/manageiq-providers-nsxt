import { componentTypes, validatorTypes } from '@@ddf';

export default () => {
  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the Security Policy'),
        isRequired: true,
        validate: [{
          type: validatorTypes.REQUIRED,
          message: __('Name is required'),
        }],
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: 'description',
        label: __('Description'),
        placeholder: __('Description of the Security Policy'),
      }
    ]
  }
  return schema;
};
