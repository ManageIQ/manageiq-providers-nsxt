import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'patternfly-react';
import { CloudNetworkApi } from '../../utils/cloud-network-api';
import { handleApiError } from '../../utils/handle-api-error';

class DeleteNsxtCloudNetworkForm extends React.Component {
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
      const cloudNetwork = await CloudNetworkApi.get(
        ManageIQ.record.recordId, { attributes: 'total_vms' }
      );
      if (cloudNetwork.total_vms != 0) {
        this.setState({ error: 'This cloud network cannot be deleted as it is still in use.' });
      } else {
        this.setState({
          ems_id: cloudNetwork.ems_id,
          values: {
            id: cloudNetwork.id,
            name: cloudNetwork.name,
          },
          message: 'Are you sure you want to permanently delete this cloud network?'
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
      await CloudNetworkApi.delete(formState.values, formState.ems_id);
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

DeleteNsxtCloudNetworkForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtCloudNetworkForm);
