import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-security-group-form.schema';
import { ProvidersApi } from '../../utils/providers.api';
import { SecurityGroupApi } from '../../utils/security-group-api';
import { VmsApi } from '../../utils/vms.api';

class CreateNsxtSecurityGroupForm extends React.Component {
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
    const [nsxt_provider, vmOptions] = await Promise.all([
      ProvidersApi.find_nsxt_provider(), this.getVmOptions()
    ]);
    this.setState({
      ems_id: nsxt_provider.id,
      vmOptions: vmOptions
    });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    await SecurityGroupApi.create(values, this.state.ems_id);
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

  async getVmOptions() {
    miqSparkleOn();
    const providers = await ProvidersApi.list(
      { filter: 'filter[]=type=ManageIQ::Providers::Vmware::InfraManager&filter[]=custom_attributes.name=supports_nsxt' }
    );
    if (providers && providers.length === 0) { return []; }
    const vms = await VmsApi.list(
      { filter: `filter[]=${providers.map(p => `ems_id=${p.id}`).join('&filter[]=or ')}` }
    );
    return _.chain(vms)
      .map(vm => ({ value: vm.id, label: vm.name }))
      .sortBy(o => o.label)
      .value();
    miqSparkleOff();
  }
}

CreateNsxtSecurityGroupForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtSecurityGroupForm);
