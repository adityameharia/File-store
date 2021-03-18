import React,{useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
const Login = () => {
  const clientId =
    '272242194309-sdgchprjq0s7auu186ofilo3o9ij6eir.apps.googleusercontent.com';

  let history = useHistory();

    
    const onSuccess =async (res) => {
      await axios.post('http://localhost:8080/',{token:res.tokenId})
      console.log(res)
      history.push('/')
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
          onSuccess={onSuccess}
          buttonText="Login"
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          style={{ marginTop: '100px' }}
          isSignedIn={true}
        />
        <GoogleLogin
          clientId={clientId}
          onSuccess={onSuccess}
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

