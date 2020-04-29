import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateNsxtSecurityPolicyRuleForm from './forms/create-nsxt-security-policy-rule-form'
import { SecurityPolicyRuleApi } from '../../utils/security-policy-rule-api';
import { SecurityGroupApi } from '../../utils/security-group-api';
import { NetworkServiceApi } from '../../utils/network-service-api';
import { ProvidersApi } from '../../utils/providers.api';
import { handleApiError } from '../../utils/handle-api-error'

class CreateNsxtSecurityPolicyRuleFormProvider extends React.Component {
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
        addClicked: () => {
          const values = _.clone(this.state.values);
          values.security_policy_id = ManageIQ.record.recordId;
          SecurityPolicyRuleApi.create(values, this.state.emsId).catch(err => { handleApiError(this, err) });
        }
      }
    });
    ProvidersApi.find_nsxt_provider().then(
      nsxt_provider => Promise.all([
        this.getGroupOptions(nsxt_provider.id), 
        this.getServiceOptions(nsxt_provider.id),
        Promise.resolve(nsxt_provider)
      ])
    ).then(
      ([groupOptions, serviceOptions, nsxt_provider]) =>
        this.setState({ 
          loading: false,
          emsId: nsxt_provider.id,
          groupOptions: groupOptions,
          serviceOptions: serviceOptions, 
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
      <CreateNsxtSecurityPolicyRuleForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
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
}

CreateNsxtSecurityPolicyRuleFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtSecurityPolicyRuleFormProvider);