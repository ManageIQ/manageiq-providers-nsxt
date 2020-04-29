export class SecurityPolicyApi {
  static get = async (id, option = { attributes: null }) => {
    const attributes = `attributes=ems_ref,name,description,ems_id${!option.attributes ? '' : `,${option.attributes}`}`;
    const url = `/api/security_policies/${id}?${attributes}`;
    return API.get(url);
  }

  static create = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_policies`, {
      action: 'create',
      resource: { ...values },
    });
    response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
  };

  static update = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_policies`, {
      action: 'edit',
      id: values.id,
      resource: { ...values },
    });
    response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
  };

  static delete = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_policies`, {
      action: 'delete',
      id: values.id
    });
    var success = true;
    response['results'].forEach(res => {
      window.add_flash(res.message, res.success ? 'success' : 'error');
      success = success && res.success;
    });
    if (success) window.location.href = "/security_policy/show_list";
  };

}