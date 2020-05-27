import { componentTypes, validatorTypes } from '@@ddf';

export default () => {
  const tempComponentTypes = _.clone(componentTypes);
  const tempValidatorTypes = _.clone(validatorTypes);

  const schema = {
    fields: [
      {
        component: tempComponentTypes.TEXT_FIELD,
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the network'),
        isRequired: true,
        validate: [{
          type: tempValidatorTypes.REQUIRED,
          message: __('Required'),
        }],
      },
      {
        component: tempComponentTypes.TEXT_FIELD,
        name: 'description',
        label: __('Description'),
        placeholder: __('Description of the network'),
      },
    ]
  }
  return schema;
};
