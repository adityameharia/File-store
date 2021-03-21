import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import setToken from '../utils/setToken'

const Login = () => {
  const clientId =
    '272242194309-sdgchprjq0s7auu186ofilo3o9ij6eir.apps.googleusercontent.com';

  let history = useHistory();


  const Success = async (res) => {
    
    
    setToken(res.tokenId)
    try {
      await axios.post('/register', { name: res.profileObj.name, email: res.profileObj.email })
      
      history.push('/')
    }
    catch (err) {
      alert(err.response.data.data)      
    }
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login.`
    );
  };

  const onSuccess = async (res) => {
    
   
    setToken(res.tokenId)
    try {
      await axios.post('/checkuser', { name: res.profileObj.name, email: res.profileObj.email })
      
      history.push('/')
    } catch (error) {      
      alert(error.response.data.data)
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        buttonText="Login"
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
      <GoogleLogin
        clientId={clientId}
        onSuccess={Success}
        buttonText="sign up"
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );

}
export default Login;

