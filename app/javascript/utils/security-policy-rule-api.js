export class SecurityPolicyRuleApi {
  static get = async (id, option = { attributes: null }) => {
    const attributes = `attributes=ems_ref,name,description,ems_id${!option.attributes ? '' : `,${option.attributes}`}`;
    const url = `/api/security_policy_rules/${id}?${attributes}`;
    return API.get(url);
  }

  static create = async (values, id) => {
    const response = await API.post(`/api/providers/${id}/security_policy_rules`, {
      action: 'create',
      resource: { ...values },
    });
    response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
  };

  static update = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_policy_rules`, {
      action: 'edit',
      id: values.id,
      resource: { ...values },
    });
    response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
  };

  static delete = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_policy_rules`, {
      action: 'delete',
      id: values.id
    });
    var success = true;
    response['results'].forEach(res => {
      window.add_flash(res.message, res.success ? 'success' : 'error');
      success = success && res.success;
    });
    if (success) window.location.href = `/security_policy/show/${values.securityPolicyId}`;
  };
}