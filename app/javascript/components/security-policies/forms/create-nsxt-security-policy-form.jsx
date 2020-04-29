import React from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { Form as PfForm, Grid, Col, Row, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import { required } from 'redux-form-validators';
import { FinalFormField } from '@manageiq/react-ui-components/dist/forms';

const CreateNsxtSecurityPolicyForm = ({loading, updateFormState}) => {
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
                  placeholder="Name of the policy"
                  validate={required({ msg: 'Name is required' })}
                />
              </Col>
              <Col xs={12}>
                <Field
                  name="description"
                  component={FinalFormField}
                  label={__('Description')}
                  placeholder="Description of the Security Policy"
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

CreateNsxtSecurityPolicyForm.propTypes = {
  updateFormState: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

CreateNsxtSecurityPolicyForm.defaultProps = {
  loading: false
};

export default CreateNsxtSecurityPolicyForm;