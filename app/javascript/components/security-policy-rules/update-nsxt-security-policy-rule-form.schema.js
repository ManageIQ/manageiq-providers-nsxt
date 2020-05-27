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
        placeholder: __('Name of the Security Policy Rule'),
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
        placeholder: __('Description of the Security Policy Rule'),
      },
      {
        component: tempComponentTypes.SELECT,
        name: 'source_groups',
        label: __('Source security Groups'),
        placeholder: __('Source security Groups of the Security Policy Rule'),
        multi: true,
        options: state.groupOptions,
      },
      {
        component: tempComponentTypes.SELECT,
        name: 'destination_groups',
        label: __('Destination security Groups'),
        placeholder: __('Destination security Groups of the Security Policy Rule'),
        multi: true,
        options: state.groupOptions,
      },
      {
        component: tempComponentTypes.SELECT,
        name: 'services',
        label: __('Network Services'),
        placeholder: __('Network Services of the Security Policy Rule'),
        multi: true,
        options: state.serviceOptions,
      }
    ]
  }
  return schema;
};
