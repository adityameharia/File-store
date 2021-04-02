import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { auth, provider } from '../utils/firebase'
import NavbarCustom from '../layout/Navbar'
import axios from 'axios'
import { backendUrl } from '../utils/url'

const SignUp = () => {

    let history = useHistory();

    const [user, setUser] = useState({ email: '', password: '', confirmPassword: '', username: '' })

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault()
        if (user.password === user.confirmPassword) {
            e.preventDefault()
            try {
                await axios.post(`${backendUrl}/register`, { name: user.username, email: user.email })
            } catch (err) {
                alert(err.response?.data?.data)
                return
            }
            auth.createUserWithEmailAndPassword(user.email, user.password)
                .then(async (user) => {
                    auth.currentUser?.sendEmailVerification();
                    history.push('/')
                })
                .catch(e => {
                    alert(e.message)
                });
        } else {
            alert('Passwords do not match');
        }
    };

    const signInGoogle = (e) => {
        e.preventDefault()
        auth.signInWithPopup(provider)
            .then(async (res) => {
                try {
                    await axios.post(`${backendUrl}/checkuser`, { name: res.user.displayName, email: res.user.email })
                } catch (err) {

                    console.log(err.response)
                    if (err.response?.data?.data === "No account with the given emailId exists") {

                        await axios.post(`${backendUrl}/register`, { name: res.user.displayName, email: res.user.email })
                        console.log("hi")
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
                        <h2 className="text-center">Sign Up</h2>
                        <br></br>
                        <Form.Group size="lg" controlId="email">

                            <Form.Label>Display Name</Form.Label>
                            <Form.Control
                                name='username'
                                type='text'
                                placeholder='Enter your name'
                                className='form-control'
                                aria-describedby='username'
                                value={user.username}
                                onChange={onChange}
                                required></Form.Control><br />

                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name='email'
                                type='email'
                                placeholder='Enter your Email'
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
                                placeholder='Choose a Password'
                                minLength='6'
                                value={user.password}
                                onChange={onChange}
                                required></Form.Control>

                        </Form.Group>
                        <Form.Group size="lg" controlId="password">

                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                name='confirmPassword'
                                className='form-control'
                                placeholder='Confirm your Password'
                                minLength='6'
                                value={user.confirmPassword}
                                onChange={onChange}
                                required></Form.Control>

                        </Form.Group>
                        <Button block size="lg" type='submit' className='btn btn-primary'>
                            Sign Up
                      </Button>
                        <div style={{ textAlign: 'center' }}>Already have an account <Link to={`/login`}>SignIn</Link>
                            <br />
                            <div style={{ textAlign: 'center' }}>OR</div><br />
                            <Button block size="lg" onClick={signInGoogle} className='btn btn-danger'>
                                Sign In/Sign Up with Google
					        </Button>
                        </div>
                    </Form>


                </div>
            </div>
        </>
    );

}
export default SignUp;