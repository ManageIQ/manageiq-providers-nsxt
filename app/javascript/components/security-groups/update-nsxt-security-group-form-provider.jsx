import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateNsxtSecurityGroupForm from './forms/update-nsxt-security-group-form'
import { ProvidersApi } from '../../utils/providers.api';
import { SecurityGroupApi } from '../../utils/security-group-api'
import { VmsApi } from '../../utils/vms.api';
import { handleApiError } from '../../utils/handle-api-error'

class UpdateNsxtSecurityGroupFormProvider extends React.Component {
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
          SecurityGroupApi.update(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update')});
    Promise.all([
      SecurityGroupApi.get(ManageIQ.record.recordId, { attributes: 'vms'}),
      this.getVmOptions()
    ]).then(
      ([securityGroup, vmOptions]) =>
        this.setState({
          loading: false,
          emsId: securityGroup.ems_id,
          vmOptions: vmOptions,
          values: {
            id: securityGroup.id,
            emsRef: securityGroup.ems_ref,
            name: securityGroup.name,
            description: securityGroup.description,
            vms: securityGroup.vms.map(vm => vm.id)
          }      
        }),
      err => handleApiError(this, err)
    );
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
      <UpdateNsxtSecurityGroupForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
        values={this.state.values}
        vmOptions={this.state.vmOptions}
      />
    );
  }

  async getVmOptions() {
    const providers = await ProvidersApi.list(
      {filter: 'filter[]=type=ManageIQ::Providers::Vmware::InfraManager&filter[]=custom_attributes.name=supports_nsxt'}
    );
    if (providers.length === 0) { return []; }
    const vms = await VmsApi.list(
      {filter: `filter[]=${providers.map(p => `ems_id=${p.id}`).join('&filter[]=or ')}`}
    );
    return _.chain(vms)
      .map(vm => ({ value: vm.id, label: vm.name }))
      .sortBy(o => o.label)
      .value();
  }
}

UpdateNsxtSecurityGroupFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityGroupFormProvider);