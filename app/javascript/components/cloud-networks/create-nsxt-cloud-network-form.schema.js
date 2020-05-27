import { componentTypes, validatorTypes } from '@@ddf';

const subnet_mask_options = [
  {
    label: '/24 (<= 253 hosts)',
    value: '/24',
  },
  {
    label: '/25 (<= 125 hosts)',
    value: '/25',
  },
  {
    label: '/26 (<= 61 hosts)',
    value: '/26',
  },
  {
    label: '/27 (<= 29 hosts)',
    value: '/27',
  },
  {
    label: '/28 (<= 13 hosts)',
    value: '/28',
  },
  {
    label: '/29 (<= 5 hosts)',
    value: '/29',
  }
];
const security_zone_options = [
  {
    label: 'PURPLE',
    value: 'PURPLE',
  },
  {
    label: 'GREEN',
    value: 'GREEN',
  },
  {
    label: 'ORANGE',
    value: 'ORANGE',
  },
  {
    label: 'RED_PRIVATE',
    value: 'RED_PRIVATE',
  },
  {
    label: 'RED_PUBLIC',
    value: 'RED_PUBLIC',
  }
];

export default () => {
  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: 'name',
        label: __('Name'),
        placeholder: __('Name of the Cloud Network'),
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
        placeholder: __('Description of the Cloud Network'),
      },
      {
        component: componentTypes.SELECT,
        name: 'subnet_mask',
        label: __('CIDR Subnet Mask'),
        placeholder: __('CIDR Subnet Mask for the subnet of the Cloud Network'),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
            message: __('CIDR Subnet Mask is required'),
          },
        ],
        options: subnet_mask_options,
      },
      {
        component: componentTypes.SELECT,
        name: 'security_zone',
        label: __('Security Zone'),
        placeholder: __('Security Zone of the Cloud Network'),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
            message: __('Security Zone is required'),
          },
        ],
        options: security_zone_options,
      }
    ],
  }
  return schema;
};
