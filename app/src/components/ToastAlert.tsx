import React, { useEffect, useState } from 'react';
import { Snackbar } from 'react-native-paper';

const ToastAlert = ({ message, status, show }) => {
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);



  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      duration={2000} // Snackbar will auto-dismiss after 2 seconds
      style={{
        backgroundColor:
          status === 'error' ? '#E23E32' :
          status === 'warning' ? '#ECB90D' :
          status === 'success' ? '#03B30A' :
          status === 'info' ? '#723230' : '#111010'
      }}
    >
      {message}
    </Snackbar>
  );
};

export default ToastAlert;
