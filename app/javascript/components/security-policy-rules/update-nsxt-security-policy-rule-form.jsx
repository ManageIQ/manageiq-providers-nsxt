import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-security-policy-rule-form.schema';
import { NetworkServiceApi } from '../../utils/network-service-api';
import { SecurityGroupApi } from '../../utils/security-group-api';
import { SecurityPolicyRuleApi } from '../../utils/security-policy-rule-api';

class UpdateNsxtSecurityPolicyRuleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update') });
    this.setInitialState();
  }

  setInitialState = async () => {
    miqSparkleOn();
    const securityPolicyRule = await SecurityPolicyRuleApi.get(
      ManageIQ.record.recordId,
      { attributes: 'source_security_groups,destination_security_groups,network_services' }
    );
    const [groupOptions, serviceOptions] = await Promise.all([
      this.getGroupOptions(securityPolicyRule.ems_id),
      this.getServiceOptions(securityPolicyRule.ems_id),
    ]);
    this.setState({
      ems_id: securityPolicyRule.ems_id,
      groupOptions: groupOptions,
      serviceOptions: serviceOptions,
      values: {
        id: securityPolicyRule.id,
        emsRef: securityPolicyRule.ems_ref,
        name: securityPolicyRule.name,
        description: securityPolicyRule.description,
        source_groups: securityPolicyRule.source_security_groups.map(group => group.id),
        destination_groups: securityPolicyRule.destination_security_groups.map(group => group.id),
        services: securityPolicyRule.network_services.map(service => service.id)
      }
    });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    await SecurityPolicyRuleApi.update(values, this.state.ems_id);
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
        initialValues={this.state.values}
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

UpdateNsxtSecurityPolicyRuleForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityPolicyRuleForm);
