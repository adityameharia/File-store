import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import setToken from '../utils/setToken'
import { auth } from '../utils/firebase'
import NavbarCustom from '../layout/Navbar'
import { refreshTokenSetup } from '../utils/refreshToken';

const Login = () => {
  // const clientId =
  //   '272242194309-sdgchprjq0s7auu186ofilo3o9ij6eir.apps.googleusercontent.com';

  let history = useHistory();

  const [user, setUser] = useState({ email: '', password: '' });


  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit =(e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(user.email, user.password).
    then(async(user) => { 
      history.push('/')
    }).
    catch(error => {
      alert("Invalid Credentials")
    });
    
  };

  return (
    <>
      <NavbarCustom isAuth={false}></NavbarCustom>

      <div style={{ padding: '60px 0' }}>

        <div className='container'>
          <Form
            style={{ margin: '0 auto', maxWidth: '320px' }}
            onSubmit={onSubmit}>
            <h2 className="text-center">Login</h2>
            <br></br>
            <Form.Group size="lg" controlId="email">


              <Form.Label>Email</Form.Label>
              <Form.Control
                name='email'
                type='email'
                className='form-control'
                aria-describedby='emailHelp'
                value={user.email}
                onChange={onChange}
                required></Form.Control>

            </Form.Group>
            <Form.Group size="lg" controlId="password">

              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                className='form-control'
                value={user.password}
                onChange={onChange}
                required></Form.Control>

            </Form.Group>
            <Button block size="lg" type='submit' className='btn btn-primary'>
              Login
					</Button>
          </Form>
          {/* <GoogleLogin
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
      /> */}
        </div>
      </div>
    </>
  );

}
export default Login;

