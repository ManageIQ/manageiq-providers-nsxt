import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateNsxtSecurityGroupForm from './forms/create-nsxt-security-group-form'
import { ProvidersApi } from '../../utils/providers.api';
import { SecurityGroupApi } from '../../utils/security-group-api'
import { VmsApi } from '../../utils/vms.api';
import { handleApiError } from '../../utils/handle-api-error'

class CreateNsxtSecurityGroupFormProvider extends React.Component {
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
          SecurityGroupApi.create(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    Promise.all([ProvidersApi.find_nsxt_provider(), this.getVmOptions()]).then(
      ([nsxt_provider, vmOptions]) => 
        this.setState({ 
          loading: false,
          vmOptions: vmOptions, 
          emsId: nsxt_provider.id 
        }),
      err => handleApiError(this, err)
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
      <CreateNsxtSecurityGroupForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
        vmOptions={this.state.vmOptions}
      />
    );
  }

  async getVmOptions() {
    const providers = await ProvidersApi.list(
      {filter: 'filter[]=type=ManageIQ::Providers::Vmware::InfraManager&filter[]=custom_attributes.name=supports_nsxt'}
    );
    if (providers && providers.length === 0) { return []; }
    const vms = await VmsApi.list(
      {filter: `filter[]=${providers.map(p => `ems_id=${p.id}`).join('&filter[]=or ')}`}
    );
    return _.chain(vms)
      .map(vm => ({ value: vm.id, label: vm.name }))
      .sortBy(o => o.label)
      .value();
  }
}

CreateNsxtSecurityGroupFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtSecurityGroupFormProvider);