export class ProvidersApi {
  static list = async (options = { attributes: undefined, filter: undefined }) => {
    options.attributes = options.attributes == undefined ? 'id,name' : options.attributes;
    const attributes = !options.attributes ? '' : `&attributes=${options.attributes}`;
    const filter = !options.filter ? '' : `&${options.filter}`;
    const url = `/api/providers?expand=resources${attributes}${filter}`;
    const response = await API.get(url);
    return !response ? [] : response.resources;
  }

  static find_nsxt_provider = async () => {
    const providers = await ProvidersApi.list(
      {filter: 'filter[]=type=ManageIQ::Providers::Nsxt::NetworkManager'}
    );
    if (1 < providers.length) {
      throw 'The NSX-T provider is missing';
    }
    if (providers.length < 1) {
      throw 'More than one NSX-T provider found, could not determine the correct provider';
    }
    return providers[0];
  }
}