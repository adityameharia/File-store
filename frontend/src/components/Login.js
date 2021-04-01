import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { auth, provider } from '../utils/firebase'
import NavbarCustom from '../layout/Navbar'
import axios from 'axios';


const Login = () => {

  console.log(auth.currentUser)

  let history = useHistory();

  const [user, setUser] = useState({ email: '', password: '' });


  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(user.email, user.password)
      .then(async (user) => {
        history.push('/')
      })
      .catch(e => {
        alert(e.message)
      });

  };

  const signInGoogle = (e) => {
    e.preventDefault()
    auth.signInWithPopup(provider)
      .then(async (res) => {
        try {
          await axios.post('/checkuser', { name: res.user.displayName, email: res.user.email })
        } catch (err) {

          console.log(err.response)
          if (err.response?.data?.data === "No account with the given emailId exists") {

            await axios.post('/register', { name: res.user.displayName, email: res.user.email })
          }
        }

        history.push('/')
      })
      .catch(err => {
        console.log(err)
      })
  }

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
                placeholder='Enter your name'
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
                placeholder='Enter Password'
                value={user.password}
                onChange={onChange}
                required></Form.Control>

            </Form.Group>
            <Button block size="lg" type='submit' className='btn btn-primary'>
              Login
					</Button>

            <div style={{ textAlign: 'center' }}><Link to={`/forgotpassword`}>Forgot Password</Link> </div>
            <div style={{ textAlign: 'center' }}>Dont have an account <Link to={`/signup`}>SignUp</Link> </div>
            <br /><div style={{ textAlign: 'center' }}>Or Login With</div><br />
            <Button block size="lg" onClick={signInGoogle} className='btn btn-danger'>
              Sign In with Google
					</Button>
          </Form>

        </div>
      </div>
    </>
  );

}
export default Login;

