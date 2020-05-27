import { componentTypes, validatorTypes } from '@@ddf';

export default () => {
  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the network'),
        isRequired: true,
        validate: [{
          type: validatorTypes.REQUIRED,
          message: __('Required'),
        }],
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: 'description',
        label: __('Description'),
        placeholder: __('Description of the network'),
      },
    ]
  }
  return schema;
};
