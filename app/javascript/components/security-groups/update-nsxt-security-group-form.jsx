import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-security-group-form.schema';
import { ProvidersApi } from '../../utils/providers.api';
import { SecurityGroupApi } from '../../utils/security-group-api';
import { VmsApi } from '../../utils/vms.api';

class UpdateNsxtSecurityGroupForm extends React.Component {
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
    const [securityGroup, vmOptions] = await Promise.all([
      SecurityGroupApi.get(ManageIQ.record.recordId, { attributes: 'vms' }),
      this.getVmOptions()
    ]);
    this.setState({
      ems_id: securityGroup.ems_id,
      vmOptions: vmOptions,
      values: {
        id: securityGroup.id,
        emsRef: securityGroup.ems_ref,
        name: securityGroup.name,
        description: securityGroup.description,
        vms: securityGroup.vms.map(vm => vm.id)
      }
    });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    await SecurityGroupApi.update(values, this.state.ems_id);
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

  async getVmOptions() {
    miqSparkleOn();
    const providers = await ProvidersApi.list(
      { filter: 'filter[]=type=ManageIQ::Providers::Vmware::InfraManager&filter[]=custom_attributes.name=supports_nsxt' }
    );
    if (providers && providers.length === 0) { return []; }
    const vms = await VmsApi.list(
      { filter: `filter[]=${providers.map(p => `ems_id=${p.id}`).join('&filter[]=or ')}` }
    );
    miqSparkleOff();
    return _.chain(vms)
      .map(vm => ({ value: vm.id, label: vm.name }))
      .sortBy(o => o.label)
      .value();
  }
}

UpdateNsxtSecurityGroupForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityGroupForm);
