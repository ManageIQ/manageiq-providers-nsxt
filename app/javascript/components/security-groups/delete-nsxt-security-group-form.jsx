import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ModalBody } from '@carbon/react';
import { SecurityGroupApi } from '../../utils/security-group-api';

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
    const securityGroup = await SecurityGroupApi.get(ManageIQ.record.recordId);
    this.setState({
      ems_id: securityGroup.ems_id,
      values: {
        id: securityGroup.id,
        name: securityGroup.name,
      },
      message: 'Are you sure you want to permanently delete this Security Group?'
    });
    this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (formState) => {
    miqSparkleOn();
    await SecurityGroupApi.delete(formState.values, formState.ems_id);
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

DeleteNsxtSecurityGroupForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityGroupForm);
