import { componentTypes, validatorTypes } from '@@ddf';

export default (state) => {
  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        id: 'name',
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the Security Policy Rule'),
        isRequired: true,
        validate: [{
          type: validatorTypes.REQUIRED,
          message: __('Name is required'),
        }],
      },
      {
        component: componentTypes.TEXT_FIELD,
        id: 'description',
        name: 'description',
        label: __('Description'),
        placeholder: __('Description of the Security Policy Rule'),
      },
      {
        component: componentTypes.SELECT,
        id: 'source_groups',
        name: 'source_groups',
        label: __('Source Security Groups'),
        placeholder: __('Source Security Groups of the Security Policy Rule'),
        multi: true,
        options: state.groupOptions,
      },
      {
        component: componentTypes.SELECT,
        id: 'destination_groups',
        name: 'destination_groups',
        label: __('Destination Security Groups'),
        placeholder: __('Destination Security Groups of the Security Policy Rule'),
        multi: true,
        options: state.groupOptions,
      },
      {
        component: componentTypes.SELECT,
        id: 'services',
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
