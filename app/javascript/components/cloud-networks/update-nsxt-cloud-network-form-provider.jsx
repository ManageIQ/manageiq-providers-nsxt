import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateNsxtCloudNetworkForm from './forms/update-nsxt-cloud-network-form'
import { CloudNetworkApi } from '../../utils/cloud-network-api'
import { handleApiError } from '../../utils/handle-api-error'

class UpdateNsxtCloudNetworkFormProvider extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormStateUpdate = this.handleFormStateUpdate.bind(this);
    this.state = {
      loading: true,
    }
  }

  async componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true,
        addClicked: () => 
          CloudNetworkApi.update(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update')});
    CloudNetworkApi.get(ManageIQ.record.recordId).then(
      cloudNetwork =>
        this.setState({
          loading: false,
          emsId: cloudNetwork.ems_id,
          values: {
            id: cloudNetwork.id,
            emsRef: cloudNetwork.ems_ref,
            name: cloudNetwork.name,
            description: cloudNetwork.description
          }
        }),
      err => handleApiError(this, err)
    )
  }

  handleFormStateUpdate = (formState) => {
    this.props.dispatch({ type: 'FormButtons.saveable', payload: formState.valid });
    this.props.dispatch({ type: 'FormButtons.pristine', payload: formState.pristine });
    this.setState({ values: formState.values });
  }

  render() {
    if(this.state.error) {
      return <p>{ this.state.error }</p>
    }
    return (
      <UpdateNsxtCloudNetworkForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
        values={this.state.values}
      />
    );
  }
}

UpdateNsxtCloudNetworkFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtCloudNetworkFormProvider);