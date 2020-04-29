export class SecurityGroupApi {
  static list = async (emsId, option = { attributes: null }) => {
    const attributes = `attributes=ems_ref,name,ems_id${!option.attributes ? '' : `,${option.attributes}`}`;
    const url = `/api/providers/${emsId}/security_groups/?${attributes}&expand=resources`;
    return API.get(url);
  }

  static get = async (id, option = { attributes: null }) => {
    const attributes = `attributes=ems_ref,name,description,ems_id${!option.attributes ? '' : `,${option.attributes}`}`;
    const url = `/api/security_groups/${id}?${attributes}`;
    return API.get(url);
  }

  static create = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_groups`, {
      action: 'create',
      resource: { ...values },
    });
    response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
  };

  static update = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_groups`, {
      action: 'edit',
      id: values.id,
      resource: { ...values },
    });
    response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
  };

  static delete = async (values, emsId) => {
    const response = await API.post(`/api/providers/${emsId}/security_groups`, {
      action: 'delete',
      id: values.id
    });
    var success = true;
    response['results'].forEach(res => {
      window.add_flash(res.message, res.success ? 'success' : 'error');
      success = success && res.success;
    });
    if (success) window.location.href = "/security_group/show_list";
  };
}