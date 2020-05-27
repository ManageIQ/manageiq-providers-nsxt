import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'patternfly-react';
import { SecurityGroupApi } from '../../utils/security-group-api';
import { handleApiError } from '../../utils/handle-api-error';

class DeleteNsxtSecurityGroupForm extends React.Component {
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
    try {
      const securityGroup = await SecurityGroupApi.get(
        ManageIQ.record.recordId,
        { attributes: 'total_security_policy_rules_as_source,total_security_policy_rules_as_destination' }
      );
      if (securityGroup.total_security_policy_rules_as_source != 0 ||
        securityGroup.total_security_policy_rules_as_destination != 0) {
        this.setState({ error: 'This Security Group cannot be deleted as it is still in use.' });
      } else {
        this.setState({
          ems_id: securityGroup.ems_id,
          values: {
            id: securityGroup.id,
            name: securityGroup.name,
          },
          message: 'Are you sure you want to permanently delete this Security Group?'
        });
        this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
      }
    } catch (error) {
      handleApiError(this, error);
    }
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (formState) => {
    miqSparkleOn();
    try {
      await SecurityGroupApi.delete(formState.values, formState.ems_id);
    } catch (error) {
      handleApiError(this, error);
    }
    miqSparkleOff();
  };

  render() {
    if (this.state.loading) return null;
    if (this.state.error) { return <p>{this.state.error}</p> }
    return (
      <Modal.Body className="warning-modal-body">
        <div>
          <h2>{this.state.values.name}</h2>
          <h4>{this.state.message}</h4>
        </div>
      </Modal.Body>
    );
  }
}

DeleteNsxtSecurityGroupForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityGroupForm);
