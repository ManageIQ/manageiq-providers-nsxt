import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MiqFormRenderer from '@@ddf';
import createSchema from './nsxt-cloud-network-form.schema';
import { CloudNetworkApi } from '../../utils/cloud-network-api'
import { ProvidersApi } from '../../utils/providers.api';

const NsxtCloudNetworkForm = ({ recordId }) => {
  const [{ isLoading, initialValues }, setState] = useState({
    isLoading: !!recordId,
    initialValues: {},
  });

  useEffect(() => {
    if (recordId) {
      API.get(`/api/cloud_networks/${recordId}`).then(({ id, providerId, ...initialValues }) => {
        setState({
          isLoading: false,
          initialValues,
        });
      });
    }
  }, [recordId]);

  const initialize = (formOptions) => {
    ManageIQ.redux.store.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: true,
        pristine: true,
      },
    });

    ManageIQ.redux.store.dispatch({
      type: 'FormButtons.callbacks',
      payload: { addClicked: () => formOptions.submit() },
    });
  };

  const onSubmit = (values) => {
    miqSparkleOn();
    const request = recordId ? API.patch(`/api/cloud_networks/${recordId}`, values) : API.post('/api/cloud_networks', values);
    request.then(miqSparkleOff);
  };

  return !isLoading && (
    <MiqFormRenderer
      schema={createSchema(!!recordId)}
      onSubmit={onSubmit}
      showFormControls={false}
      initialValues={initialValues}
      initialize={initialize}
    />
  );
};

NsxtCloudNetworkForm.propTypes = {
  recordId: PropTypes.string,
};

NsxtCloudNetworkForm.defaultProps = {
  recordId: undefined,
};

export default NsxtCloudNetworkForm;
