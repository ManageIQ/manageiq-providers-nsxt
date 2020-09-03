import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-cloud-network-form.schema';
import { CloudNetworkApi } from '../../utils/cloud-network-api';

class UpdateNsxtCloudNetworkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    this.setInitialState();
  }

  setInitialState = async () => {
    miqSparkleOn();
    const cloudNetwork = await CloudNetworkApi.get(ManageIQ.record.recordId);
    this.setState({
      ems_id: cloudNetwork.ems_id,
      values: {
        id: cloudNetwork.id,
        emsRef: cloudNetwork.ems_ref,
        name: cloudNetwork.name,
        description: cloudNetwork.description
      }
    });
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    await CloudNetworkApi.update(values, this.state.ems_id);
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

    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update') });

    this.props.dispatch({
      type: 'FormButtons.callbacks',
      payload: { addClicked: () => formOptions.submit() },
    });
  }

  render() {
    if (this.state.loading) return null;
    return (
      <MiqFormRenderer
        initialValues={this.state.values}
        schema={createSchema()}
        onSubmit={this.submitValues}
        showFormControls={false}
        initialize={this.initialize}
      />
    )
  }
}

UpdateNsxtCloudNetworkForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtCloudNetworkForm);
