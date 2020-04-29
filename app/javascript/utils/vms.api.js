
export class VmsApi {
  static list = async (options = { attributes: undefined, filter: undefined }) => {
    options.attributes = options.attributes == undefined ? 'id,name,uid_ems' : options.attributes;
    const attributes = !options.attributes ? '' : `&attributes=${options.attributes}`;
    const filter = !options.filter ? '' : `&${options.filter}`;
    const url = `/api/vms?expand=resources${attributes}${filter}`;
    const response = await API.get(url);
    return !response ? [] : response.resources;
  }
}