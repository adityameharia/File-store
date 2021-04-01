import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { auth } from '../utils/firebase'
import NavbarCustom from '../layout/Navbar'

const ForgotPassword = () => {

    let history = useHistory();

    const [email, setEmail] = useState('');

    const onChange = (e) => {
        setEmail(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault()
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert('If an account with the given email exits,a reset link has been sent to it')
                history.push('/')
            })
            .catch(() => {
                alert("Error resetting password");
            });

    }

    return (
        <>
            <NavbarCustom isAuth={false}></NavbarCustom>

            <div style={{ padding: '60px 0' }}>

                <div className='container'>
                    <Form
                        style={{ margin: '0 auto', maxWidth: '320px' }}
                        onSubmit={onSubmit}>
                        <h2 className="text-center">Reset Password</h2>
                        <br></br>
                        <Form.Group size="lg" controlId="email">

                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name='email'
                                type='email'
                                className='form-control'
                                placeholder='Enter email to which link will be sent'
                                value={email}
                                onChange={onChange}
                                required></Form.Control>

                        </Form.Group>
                        <Button block size="lg" type='submit' className='btn btn-primary'>
                            Submit
					    </Button>
                    </Form>
                </div>
            </div>
        </>
    )

}

export default ForgotPassword