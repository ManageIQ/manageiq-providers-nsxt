import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'patternfly-react';
import { SecurityPolicyApi } from '../../utils/security-policy-api';
import { handleApiError } from '../../utils/handle-api-error';

class DeleteNsxtSecurityPolicyForm extends React.Component {
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
      const securityPolicy = await SecurityPolicyApi.get(ManageIQ.record.recordId);
      this.setState({
        ems_id: securityPolicy.ems_id,
        values: {
          id: securityPolicy.id,
          name: securityPolicy.name,
        },
        message: 'Are you sure you want to permanently delete this Security Policy?'
      });
      this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
    } catch (error) {
      handleApiError(this, error);
    }
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (formState) => {
    miqSparkleOn();
    try {
      await SecurityPolicyApi.delete(formState.values, formState.ems_id);
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

DeleteNsxtSecurityPolicyForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityPolicyForm);
