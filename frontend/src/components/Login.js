import React from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const clientId =
    '272242194309-sdgchprjq0s7auu186ofilo3o9ij6eir.apps.googleusercontent.com';

  let history = useHistory();

  
    const onSuccess = (res) => {
      console.log('Login Success: currentUser:', res.profileObj);
      alert(
        `Logged in successfully welcome ${res.profileObj.name} `
      );
      history.push('/logout')
    };



    const onFailure = (res) => {
      console.log('Login failed: res:', res);
      alert(
        `Failed to login.`
      );
    };

    return (
      <div>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          style={{ marginTop: '100px' }}
          isSignedIn={true}
        />
      </div>
    );
  
}
export default Login;