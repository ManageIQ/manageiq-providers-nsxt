import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MiqFormRenderer from '@@ddf';
import createSchema from './update-nsxt-cloud-network-form.schema';
import { CloudNetworkApi } from '../../utils/cloud-network-api';
import { handleApiError } from '../../utils/handle-api-error';

class UpdateNsxtCloudNetworkForm extends React.Component {
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
    try {
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
    } catch (error) {
      handleApiError(this, error);
    }
    this.setState({ loading: false });
    miqSparkleOff();
  }

  submitValues = async (values) => {
    miqSparkleOn();
    try {
      await CloudNetworkApi.update(values, this.state.ems_id);
    } catch (error) {
      handleApiError(this, error);
    }
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
    if (this.state.error) { return <p>{this.state.error}</p> }
    return (
      <MiqFormRenderer
        initialValues={this.state.values}
        schema={createSchema()}
        onSubmit={this.submitValues}
        showFormControls={false}
        onStateUpdate={this.handleFormStateUpdate}
      />
    )
  }
}

UpdateNsxtCloudNetworkForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtCloudNetworkForm);
