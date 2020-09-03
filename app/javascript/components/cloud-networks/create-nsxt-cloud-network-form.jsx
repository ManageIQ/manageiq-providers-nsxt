import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-cloud-network-form.schema';
import { CloudNetworkApi } from '../../utils/cloud-network-api'
import { ProvidersApi } from '../../utils/providers.api';

class CreateNsxtCloudNetworkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.setInitialState();
  }

  setInitialState = async () => {
    miqSparkleOn();
    const nsxt_provider = await ProvidersApi.find_nsxt_provider();
    this.setState({ ems_id: nsxt_provider.id });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    await CloudNetworkApi.create(values, this.state.ems_id);
    miqSparkleOff();
  };

  initialize = (formOptions) => {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true
      }
    });
    this.props.dispatch({
      type: 'FormButtons.callbacks',
      payload: { addClicked: () => formOptions.submit() },
    });
  }

  render() {
    if (this.state.loading) return null;
    return (
      <MiqFormRenderer
        schema={createSchema()}
        onSubmit={this.submitValues}
        showFormControls={false}
        initialize={this.initialize}
      />
    )
  }
}

CreateNsxtCloudNetworkForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateNsxtCloudNetworkForm);
