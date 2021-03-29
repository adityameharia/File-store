import React from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import {  Button } from 'react-bootstrap';
import setToken from '../utils/setToken'
import NavbarCustom from '../layout/Navbar'

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
    <div className="Login">
      <NavbarCustom isAuth={false}></NavbarCustom>
			<div className='container'>
      
      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        render={renderProps => (
          <Button block style={{width:'10rem',margin:'auto',marginTop:'40vh'}} size="lg" type='submit' className='btn btn-primary' onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign In</Button>
        )}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
      <GoogleLogin
        clientId={clientId}
        onSuccess={Success}
        render={renderProps => (<Button block style={{width:'10rem',margin:'auto',marginTop:'2vh'}} size="lg" type='submit' className='btn btn-primary' onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign Up</Button>)}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
    </div>
  );

}
export default Login;

