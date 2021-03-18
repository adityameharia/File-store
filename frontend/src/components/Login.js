import React,{useEffect} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import Cookies from 'universal-cookie';

const Login = () => {
  const clientId =
    '272242194309-sdgchprjq0s7auu186ofilo3o9ij6eir.apps.googleusercontent.com';

  let history = useHistory();

    const cookies = new Cookies();
    const onSuccess =async (res) => {
      console.log(res)
      // const resp= await axios.post(`http://localhost:8080/`,{token:token})
      // console.log(resp)
     
      cookies.set("profileObj",res,{ path: '/' })
      console.log(cookies.get('token'));
     // cookies.get('token').reloadAuthResponse()
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
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          style={{ marginTop: '100px' }}
          isSignedIn={true}
        />
      </div>
    );
  
}
export default Login;

