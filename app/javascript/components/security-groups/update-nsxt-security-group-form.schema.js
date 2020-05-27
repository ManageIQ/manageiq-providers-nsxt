import { componentTypes, validatorTypes } from '@@ddf';

export default (state) => {
  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the Security Group'),
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
        placeholder: __('Description of the Security Group'),
      },
      {
        component: componentTypes.SELECT,
        name: 'vms',
        label: __('Selected VM\'s'),
        placeholder: __('Selected VM\'s of the Security Group'),
        multi: true,
        options: state.vmOptions,
      }
    ]
  }
  return schema;
};
