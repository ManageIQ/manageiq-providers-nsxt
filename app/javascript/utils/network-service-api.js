export class NetworkServiceApi {
  static list = async (ems_id, option = { attributes: null }) => {
    const attributes = `attributes=ems_ref,name,ems_id${!option.attributes ? '' : `,${option.attributes}`}`;
    const url = `/api/providers/${ems_id}/network_services/?${attributes}&expand=resources`;
    return API.get(url);
  }
}