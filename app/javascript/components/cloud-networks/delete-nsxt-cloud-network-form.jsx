import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ModalBody } from 'carbon-components-react';
import { CloudNetworkApi } from '../../utils/cloud-network-api';

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
    const cloudNetwork = await CloudNetworkApi.get(
      ManageIQ.record.recordId, { attributes: 'total_vms' }
    );
    this.setState({
      ems_id: cloudNetwork.ems_id,
      values: {
        id: cloudNetwork.id,
        name: cloudNetwork.name,
      },
      message: 'Are you sure you want to permanently delete this cloud network?'
    });
    this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (formState) => {
    miqSparkleOn();
    await CloudNetworkApi.delete(formState.values, formState.ems_id);
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

DeleteNsxtCloudNetworkForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtCloudNetworkForm);
