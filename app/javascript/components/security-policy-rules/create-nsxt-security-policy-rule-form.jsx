import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-security-policy-rule-form.schema';
import { NetworkServiceApi } from '../../utils/network-service-api';
import { ProvidersApi } from '../../utils/providers.api';
import { SecurityPolicyRuleApi } from '../../utils/security-policy-rule-api';
import { SecurityGroupApi } from '../../utils/security-group-api';

class CreateNsxtSecurityPolicyRuleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true
      }
    });
    this.setInitialState();
  }

  setInitialState = async () => {
    miqSparkleOn();
    const  nsxt_provider = await ProvidersApi.find_nsxt_provider();
    const [groupOptions, serviceOptions] = await Promise.all([
      this.getGroupOptions(nsxt_provider.id),
      this.getServiceOptions(nsxt_provider.id),
    ]);
    this.setState({
      ems_id: nsxt_provider.id,
      groupOptions: groupOptions,
      serviceOptions: serviceOptions
    });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    values.security_policy_id = ManageIQ.record.recordId;
    await SecurityPolicyRuleApi.create(values, this.state.ems_id);
    miqSparkleOff();
  };

  handleFormStateUpdate = (formState) => {
    this.props.dispatch({ type: 'FormButtons.saveable', payload: formState.valid });
    this.props.dispatch({ type: 'FormButtons.pristine', payload: formState.pristine });
    this.props.dispatch({
      type: 'FormButtons.callbacks',
      payload: { addClicked: () => this.submitValues(formState.values) },
    });
  }

  render() {
    if (this.state.loading) return null;
    return (
      <MiqFormRenderer
        schema={createSchema(this.state)}
        onSubmit={this.submitValues}
        showFormControls={false}
        onStateUpdate={this.handleFormStateUpdate}
      />
    )
  }

  async getGroupOptions(ems_id) {
    const groups = await SecurityGroupApi.list(ems_id)
    return _.chain(groups.resources)
      .map(group => ({ value: group.id, label: group.name }))
      .sortBy(o => o.label)
      .value();
  }

  async getServiceOptions(ems_id) {
    const services = await NetworkServiceApi.list(ems_id)
    return _.chain(services.resources)
      .map(service => ({ value: service.id, label: service.name }))
      .sortBy(o => o.label)
      .value();
  }
}

CreateNsxtSecurityPolicyRuleForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtSecurityPolicyRuleForm);
