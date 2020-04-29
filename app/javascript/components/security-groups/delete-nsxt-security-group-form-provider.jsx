import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Spinner } from 'patternfly-react';
import { SecurityGroupApi } from '../../utils/security-group-api'
import { handleApiError } from '../../utils/handle-api-error'

class DeleteNsxtSecurityGroupFormProvider extends React.Component {
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
          SecurityGroupApi.delete(this.state.values, this.state.emsId)
            .catch(err => { handleApiError(this, err) })
      }
    });
    this.props.dispatch({ type: "FormButtons.customLabel", payload: __('Delete')});
    SecurityGroupApi.get(ManageIQ.record.recordId, { 
      attributes: 'total_security_policy_rules_as_source,total_security_policy_rules_as_destination'
    }).then(
      securityGroup => {
        this.setState({
          emsId: securityGroup.ems_id,
          values: {
            id: securityGroup.id,
            emsRef: securityGroup.ems_ref,
            name: securityGroup.name,
          }
        });
        if (
          0 < securityGroup.total_security_policy_rules_as_source ||
          0 < securityGroup.total_security_policy_rules_as_destination) {
          this.setState({ message: 'This security group cannot be deleted as it is still in use.' });
        } else {
          this.setState({ message: 'Are you sure you want to permanently delete this security group?' });
          this.props.dispatch({ type: 'FormButtons.saveable', payload: true });
        }
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
          <h4>{ this.state.message }</h4>
        </div>
      </Modal.Body>
    );
  }
}

DeleteNsxtSecurityGroupFormProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeleteNsxtSecurityGroupFormProvider);