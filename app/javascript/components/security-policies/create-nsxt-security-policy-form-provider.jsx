import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateNsxtSecurityPolicyForm from './forms/create-nsxt-security-policy-form'
import { ProvidersApi } from '../../utils/providers.api';
import { SecurityPolicyApi } from '../../utils/security-policy-api'
import { handleApiError } from '../../utils/handle-api-error'

class CreateNsxtSecurityPolicyFormProvider extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormStateUpdate = this.handleFormStateUpdate.bind(this);
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
          SecurityPolicyApi.create(this.state.values, this.state.emsId)
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
      <CreateNsxtSecurityPolicyForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
      />
    );
  }
}

CreateNsxtSecurityPolicyFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtSecurityPolicyFormProvider);