import React from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { Form as PfForm, Grid, Col, Row, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import { required } from 'redux-form-validators';
import { FinalFormField, FinalFormSelect } from '@manageiq/react-ui-components/dist/forms';

const CreateNsxtCloudNetworkForm = ({loading, updateFormState}) => {
  if(loading){
    return (
      <Spinner loading size="lg" />
    );
  }

  return (
    <Form
      onSubmit={() => {}} // handled by modal
      render={({ handleSubmit }) => (
        <PfForm horizontal>
          <FormSpy onChange={state => updateFormState({ ...state, values: state.values })} />
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <Field
                  name="name"
                  component={FinalFormField}
                  label={__('Name')}
                  labelColumnSize={4}                  
                  placeholder="Name of the network"
                  validate={required({ msg: 'Name is required' })}
                />
              </Col>
              <hr />
              <Col xs={12}>
                <Field
                  name="description"
                  component={FinalFormField}
                  label={__('Description')}
                  labelColumnSize={4}                  
                  placeholder="Description of the network"
                />
              </Col>
              <hr />
              <Col xs={12}>
                <Field
                  name="subnet_mask"
                  component={FinalFormSelect}
                  label={__('CIDR Subnet Mask')}
                  labelColumnSize={4}                  
                  options={CreateNsxtCloudNetworkForm.defaultOptions.segmentSizes}
                  validate={required({ msg: 'CIDR Subnet Mask is required' })}
                />
              </Col>
              <hr />
              <Col xs={12}>
                <Field
                  name="security_zone"
                  component={FinalFormSelect}
                  label={__('Security Zone')}
                  labelColumnSize={4}                  
                  options={CreateNsxtCloudNetworkForm.defaultOptions.networkLabels}
                  placeholder="Security Zone"
                  validate={required({ msg: 'Security Zone is required' })}
                />
              </Col>
              <hr />
            </Row>
          </Grid>
        </PfForm>
      )}
    />
  );
};

CreateNsxtCloudNetworkForm.propTypes = {
  updateFormState: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

CreateNsxtCloudNetworkForm.defaultProps = {
  loading: false
};

CreateNsxtCloudNetworkForm.defaultOptions = {
  segmentSizes: [{
    label: '/24 (<= 253 hosts)',
    value: '/24',
  }, {
    label: '/25 (<= 125 hosts)',
    value: '/25',
  }, {
    label: '/26 (<= 61 hosts)',
    value: '/26',
  }, {
    label: '/27 (<= 29 hosts)',
    value: '/27',
  }, {
    label: '/28 (<= 13 hosts)',
    value: '/28',
  }, {
    label: '/29 (<= 5 hosts)',
    value: '/29',
  }],
  networkLabels: [{
    label: 'BLUE',
    value: 'BLUE',
  }, {
    label: 'GREEN',
    value: 'GREEN',
  }, {
    label: 'ORANGE',
    value: 'ORANGE',
  }, {
    label: 'RED',
    value: 'RED',
   }, {
    label: 'BLACK',
    value: 'BLACK',
  }]
}

export default CreateNsxtCloudNetworkForm;