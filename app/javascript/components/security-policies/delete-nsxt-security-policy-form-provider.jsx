import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Spinner } from 'patternfly-react';
import { SecurityPolicyApi } from '../../utils/security-policy-api'
import { handleApiError } from '../../utils/handle-api-error'

class DeleteNsxtSecurityPolicyFormProvider extends React.Component {
  constructor(props) {
    super(props);
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
        addClicked: () => 
          SecurityPolicyApi.delete(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({type: "FormButtons.customLabel", payload: __('Delete')});
    SecurityPolicyApi.get(ManageIQ.record.recordId).then(
      securityPolicy => {
        this.setState({
          emsId: securityPolicy.ems_id,
          values: {
            id: securityPolicy.id,
            emsRef: securityPolicy.ems_ref,
            name: securityPolicy.name,
          }
        })
        this.props.dispatch({type: 'FormButtons.saveable', payload: true});
        this.setState({ loading: false });
      },
      err => handleApiError(this, err)
    );
  }

  render() {
    if(this.state.error) {
      return <p>{ this.state.error }</p>
    }

    if(this.state.loading){
      return (
        <Spinner loading size="lg" />
      );
    }

    return (
      <Modal.Body className="warning-modal-body">
        <div>
          <h2>{ this.state.values.name }</h2>
          <h4>Are you sure you want to permanently delete this security policy?</h4>
        </div>
      </Modal.Body>
    );
  }
}

DeleteNsxtSecurityPolicyFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityPolicyFormProvider);