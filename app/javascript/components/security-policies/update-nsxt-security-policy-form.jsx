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

  initialize = (formOptions) => {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true
      }
    });

    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update') });

    this.props.dispatch({
      type: 'FormButtons.callbacks',
      payload: { addClicked: () => formOptions.submit() },
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
        initialize={this.initialize}
      />
    )
  }
}

UpdateNsxtSecurityPolicyForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityPolicyForm);
