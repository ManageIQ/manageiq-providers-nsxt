import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Spinner } from 'patternfly-react';
import { CloudNetworkApi } from '../../utils/cloud-network-api'
import { handleApiError } from '../../utils/handle-api-error'

class DeleteNsxtCloudNetworkFormProvider extends React.Component {
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
          CloudNetworkApi.delete(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Delete')});
    CloudNetworkApi.get(ManageIQ.record.recordId, { attributes: 'total_vms' }).then(
      cloudNetwork => {
        this.setState({
          emsId: cloudNetwork.ems_id,
          values: {
            id: cloudNetwork.id,
            emsRef: cloudNetwork.ems_ref,
            name: cloudNetwork.name,
          }
        });
        if (0 < cloudNetwork.total_vms) {
          this.setState({ message: 'This cloud network cannot be deleted as it is still in use.' });
        } else {
          this.setState({ message: 'Are you sure you want to permanently delete this cloud network?' });
          this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
        }
        this.setState({ loading: false });
      },
      err => handleApiError(this, err)
    );
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
          <h4>{ this.state.message }</h4>
        </div>
      </Modal.Body>
    );
  }
}

DeleteNsxtCloudNetworkFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtCloudNetworkFormProvider);