import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ModalBody } from '@carbon/react';
import { SecurityPolicyRuleApi } from '../../utils/security-policy-rule-api';

class DeleteNsxtSecurityPolicyRuleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true,
        addClicked: () => this.submitValues(this.state)
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Delete') });
    this.setInitialState();
  }

  setInitialState = async () => {
    miqSparkleOn();
    const securityPolicyRule = await SecurityPolicyRuleApi.get(
      ManageIQ.record.recordId, { attributes: 'security_policy_id'}
    );
    this.setState({
      ems_id: securityPolicyRule.ems_id,
      values: {
        id: securityPolicyRule.id,
        emsRef: securityPolicyRule.ems_ref,
        name: securityPolicyRule.name,
        securityPolicyId: securityPolicyRule.security_policy_id,
    },
      message: 'Are you sure you want to permanently delete this Security Policy Rule?'
    });
    this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (formState) => {
    miqSparkleOn();
    await SecurityPolicyRuleApi.delete(formState.values, formState.ems_id);
    miqSparkleOff();
  };

  render() {
    if (this.state.loading) return null;
    return (
      <ModalBody className="warning-modal-body">
        <div>
          <h2>{this.state.values.name}</h2>
          <h4>{this.state.message}</h4>
        </div>
      </ModalBody>
    );
  }
}

DeleteNsxtSecurityPolicyRuleForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityPolicyRuleForm);
