import React from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { Form as PfForm, Grid, Col, Row, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import { required } from 'redux-form-validators';
import { FinalFormField, FinalFormSelect } from '@manageiq/react-ui-components/dist/forms';
import { selectionRequired } from '../../../utils/validators';

const CreateNsxtSecurityPolicyRuleForm = ({loading, updateFormState, groupOptions, serviceOptions}) => {
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
                  placeholder="Name of the policy rule"
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
                  placeholder="Description of the Security Policy Rule"
                />
              </Col>
              <hr />
              <Col xs={12}>
                <Field
                  name="source_groups"
                  component={FinalFormSelect}
                  label={__('Source\u00A0security\u00A0groups')}
                  labelColumnSize={4}
                  validate={selectionRequired}
                  options={groupOptions}
                  multi
                  searchable
                />
              </Col>
              <hr />
              <Col xs={12}>
                <Field
                  name="destination_groups"
                  component={FinalFormSelect}
                  label={__('Destination\u00A0security\u00A0groups')}
                  labelColumnSize={4}
                  validate={selectionRequired}
                  options={groupOptions}
                  multi
                  searchable
                />
              </Col>
              <hr />
              <Col xs={12}>
                <Field
                  name="services"
                  component={FinalFormSelect}
                  label={__('Network services')}
                  labelColumnSize={4}
                  validate={selectionRequired}
                  options={serviceOptions}
                  multi
                  searchable
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

CreateNsxtSecurityPolicyRuleForm.propTypes = {
  updateFormState: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  groupOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  serviceOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

CreateNsxtSecurityPolicyRuleForm.defaultProps = {
  loading: false,
  groupOptions: [],
  serviceOptions: []
};

export default CreateNsxtSecurityPolicyRuleForm;