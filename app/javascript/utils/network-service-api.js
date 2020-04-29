export class NetworkServiceApi {
  static list = async (emsId, option = { attributes: null }) => {
    const attributes = `attributes=ems_ref,name,ems_id${!option.attributes ? '' : `,${option.attributes}`}`;
    const url = `/api/providers/${emsId}/network_services/?${attributes}&expand=resources`;
    return API.get(url);
  }
}