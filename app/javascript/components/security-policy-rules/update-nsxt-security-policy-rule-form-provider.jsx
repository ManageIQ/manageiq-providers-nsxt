import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateNsxtSecurityPolicyRuleForm from './forms/update-nsxt-security-policy-rule-form'
import { NetworkServiceApi } from '../../utils/network-service-api'
import { ProvidersApi } from '../../utils/providers.api'
import { SecurityGroupApi } from '../../utils/security-group-api';
import { SecurityPolicyRuleApi } from '../../utils/security-policy-rule-api';
import { handleApiError } from '../../utils/handle-api-error'

class UpdateNsxtSecurityPolicyRuleFormProvider extends React.Component {
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
        addClicked: () => SecurityPolicyRuleApi.update(this.state.values, this.state.emsId).catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update')});
    ProvidersApi.find_nsxt_provider()
    .then(
      nsxt_provider => Promise.all([
        this.getGroupOptions(nsxt_provider.id), 
        this.getServiceOptions(nsxt_provider.id),
        this.getSecurityPolicyRule()
      ])
    ).then(
      ([groupOptions, serviceOptions, securityPolicyRule]) =>
        this.setState({
          loading: false,
          emsId: securityPolicyRule.ems_id,
          groupOptions: groupOptions,
          serviceOptions: serviceOptions,
          values: {
            id: securityPolicyRule.id,
            emsRef: securityPolicyRule.ems_ref,
            name: securityPolicyRule.name,
            description: securityPolicyRule.description,
            security_policy_id: securityPolicyRule.security_policy_id,
            source_groups: securityPolicyRule.source_security_groups.map(group => group.id),
            destination_groups: securityPolicyRule.destination_security_groups.map(group => group.id),
            services: securityPolicyRule.network_services.map(service => service.id)
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
      <UpdateNsxtSecurityPolicyRuleForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
        values={this.state.values}
        groupOptions={this.state.groupOptions}
        serviceOptions={this.state.serviceOptions}
      />
    );
  }

  async getGroupOptions(emsId) {
    const groups = await SecurityGroupApi.list(emsId)
    return _.chain(groups.resources)
      .map(group => ({ value: group.id, label: group.name }))
      .sortBy(o => o.label)
      .value();
  }

  async getServiceOptions(emsId) {
    const services = await NetworkServiceApi.list(emsId)
    return _.chain(services.resources)
      .map(service => ({ value: service.id, label: service.name }))
      .sortBy(o => o.label)
      .value();
  }

  async getSecurityPolicyRule() {
    const securityPolicyRule = await SecurityPolicyRuleApi.get(
      ManageIQ.record.recordId, 
      { attributes: 'source_security_groups,destination_security_groups,network_services' })
    return securityPolicyRule;
  }
}

UpdateNsxtSecurityPolicyRuleFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityPolicyRuleFormProvider);