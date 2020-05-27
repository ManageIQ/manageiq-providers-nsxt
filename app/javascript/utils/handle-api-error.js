export const handleApiError = (dialog, error) => {
  if (error.hasOwnProperty('status') && error.status === 401) { return; }
  console.error(getErrorMessage(error));
  window.add_flash(getErrorMessage(error), 'error');
  dialog.setState({ loading: false, error: getDialogMessage(error) });
  miqSparkleOff();
};

const getErrorMessage = (error) => {
  if (error.hasOwnProperty('data')) {
    return error.data.error.message;
  } else if (error.hasOwnProperty('message')) {
    return error.message;
  }
  return JSON.stringify(error);
}

const getDialogMessage = (error) => {
  if (error.hasOwnProperty('status')) {
    if (error.status === 403) { return 'Insufficient access rights on on record'; }
    if (error.status === 404) { return 'Record not found'; }
    if (error.status === 408) { return 'Request timeout'; }
  }
  return 'An error has occurred.';
}