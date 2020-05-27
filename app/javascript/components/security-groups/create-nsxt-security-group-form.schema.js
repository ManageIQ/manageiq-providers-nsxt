import { componentTypes, validatorTypes } from '@@ddf';

export default (state) => {
  const tempComponentTypes = _.clone(componentTypes);
  const tempValidatorTypes = _.clone(validatorTypes);

  const schema = {
    fields: [
      {
        component: tempComponentTypes.TEXT_FIELD,
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the Security Group'),
        isRequired: true,
        validate: [{
          type: tempValidatorTypes.REQUIRED,
          message: __('Name is required'),
        }],
      },
      {
        component: tempComponentTypes.TEXT_FIELD,
        name: 'description',
        label: __('Description'),
        placeholder: __('Description of the Security Group'),
      },
      {
        component: tempComponentTypes.SELECT,
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
