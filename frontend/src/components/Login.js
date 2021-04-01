import React, { useState } from 'react';
import { useHistory,Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { auth } from '../utils/firebase'
import NavbarCustom from '../layout/Navbar'


const Login = () => {

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
    catch(e => {
      alert(e.message)
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
          <div style={{textAlign:'center'}}><Link to={`/forgotpassword`}>Forgot Password</Link> </div>
          <div style={{textAlign:'center'}}>Dont have an account <Link to={`/signup`}>SignUp</Link> </div>
          </Form>
          
        </div>
      </div>
    </>
  );

}
export default Login;

