import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-security-policy-form.schema';
import { SecurityPolicyApi } from '../../utils/security-policy-api';

class UpdateNsxtSecurityPolicyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update') });
    this.setInitialState();
  }

  setInitialState = async () => {
    miqSparkleOn();
    const securityPolicy = await SecurityPolicyApi.get(ManageIQ.record.recordId);
    this.setState({
      ems_id: securityPolicy.ems_id,
      values: {
        id: securityPolicy.id,
        emsRef: securityPolicy.ems_ref,
        name: securityPolicy.name,
        description: securityPolicy.description,
      }
    });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    await SecurityPolicyApi.update(values, this.state.ems_id);
    miqSparkleOff();
  };

  handleFormStateUpdate = (formState) => {
    this.props.dispatch({ type: 'FormButtons.saveable', payload: formState.valid });
    this.props.dispatch({ type: 'FormButtons.pristine', payload: formState.pristine });
    this.props.dispatch({
      type: 'FormButtons.callbacks',
      payload: { addClicked: () => this.submitValues(formState.values) },
    });
  }

  render() {
    if (this.state.loading) return null;
    return (
      <MiqFormRenderer
        initialValues={this.state.values}
        schema={createSchema(this.getVmOptions)}
        onSubmit={this.submitValues}
        showFormControls={false}
        onStateUpdate={this.handleFormStateUpdate}
      />
    )
  }
}

UpdateNsxtSecurityPolicyForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityPolicyForm);
