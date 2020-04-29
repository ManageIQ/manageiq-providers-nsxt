import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Spinner } from 'patternfly-react';
import { SecurityPolicyRuleApi } from '../../utils/security-policy-rule-api'
import { handleApiError } from '../../utils/handle-api-error'

class DeleteNsxtSecurityPolicyRuleFormProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  async componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true,
        addClicked: () => 
          SecurityPolicyRuleApi.delete(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Delete')});
    var option = {};
    option.attributes = 'security_policy_id';
    SecurityPolicyRuleApi.get(ManageIQ.record.recordId, option).then(
      securityPolicyRule => {
        this.setState({
          emsId: securityPolicyRule.ems_id,
          values: {
            id: securityPolicyRule.id,
            emsRef: securityPolicyRule.ems_ref,
            name: securityPolicyRule.name,
            securityPolicyId: securityPolicyRule.security_policy_id,
          }
        });
        this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
        this.setState({ loading: false });
      },
      err => handleApiError(this, err)
    )
  }

  render() {
    if(this.state.error) {
      return <p>{ this.state.error }</p>
    }

    if(this.state.loading){
      return (
        <Spinner loading size="lg" />
      );
    }

    return (
      <Modal.Body className="warning-modal-body">
        <div>
          <h2>{ this.state.values.name }</h2>
          <h4>Are you sure you want to permanently delete this security policy rule?</h4>
        </div>
      </Modal.Body>
    );
  }
}

DeleteNsxtSecurityPolicyRuleFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityPolicyRuleFormProvider);