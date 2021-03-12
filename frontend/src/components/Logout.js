import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';

const clientId =
  '272242194309-sdgchprjq0s7auu186ofilo3o9ij6eir.apps.googleusercontent.com';

function Logout() {

  let history = useHistory();

  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully');
    history.push('/')
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;