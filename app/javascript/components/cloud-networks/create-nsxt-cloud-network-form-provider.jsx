import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateNsxtCloudNetworkForm from './forms/create-nsxt-cloud-network-form';
import { CloudNetworkApi } from '../../utils/cloud-network-api'
import { ProvidersApi } from '../../utils/providers.api';
import { handleApiError } from '../../utils/handle-api-error'

class CreateNsxtCloudNetworkFormProvider extends React.Component {
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
          CloudNetworkApi.create(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    ProvidersApi.find_nsxt_provider().then(
      nsxt_provider => this.setState({ loading: false, emsId: nsxt_provider.id }),
      err => handleApiError(this,err)
    );
  }

  handleFormStateUpdate(formState) {
    this.props.dispatch({ type: 'FormButtons.saveable', payload: formState.valid });
    this.props.dispatch({ type: 'FormButtons.pristine', payload: formState.pristine });
    this.setState({ values: formState.values });
  }

  render() {
    if(this.state.error) {
      return <p>{this.state.error}</p>
    }
    return (
      <CreateNsxtCloudNetworkForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
      />
    );
  }
}

CreateNsxtCloudNetworkFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtCloudNetworkFormProvider);