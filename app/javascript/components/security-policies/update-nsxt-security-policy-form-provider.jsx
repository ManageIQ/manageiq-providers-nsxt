import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateNsxtSecurityPolicyForm from './forms/update-nsxt-security-policy-form'
import { SecurityPolicyApi } from '../../utils/security-policy-api'
import { handleApiError } from '../../utils/handle-api-error'

class UpdateNsxtSecurityPolicyFormProvider extends React.Component {
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
          SecurityPolicyApi.update(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Update')});
    SecurityPolicyApi.get(ManageIQ.record.recordId, { attributes: 'sequence_number'}).then(
      securityPolicy => 
        this.setState({
          loading: false,
          emsId: securityPolicy.ems_id,
          values: {
            id: securityPolicy.id,
            emsRef: securityPolicy.ems_ref,
            name: securityPolicy.name,
            sequence_number: securityPolicy.sequence_number
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
      <UpdateNsxtSecurityPolicyForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
        values={this.state.values}
      />
    );
  }
}

UpdateNsxtSecurityPolicyFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UpdateNsxtSecurityPolicyFormProvider);