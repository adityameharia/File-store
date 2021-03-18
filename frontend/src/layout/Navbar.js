import { useHistory } from 'react-router-dom';
import { GoogleLogout,useGoogleLogin } from 'react-google-login';
import { Navbar,  Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

const clientId =

    '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';

const NavbarCustom=()=>{
    let history = useHistory();

    const Success = () => {
        console.log('Logout made successfully');
        alert('Logout made successfully');
        history.push('/login')
    };
    
    return (
        
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
                <img
                    alt=""
                    src="https://www.freepik.com/free-icon/facebook-link_694830.htm"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
          File-Store
        </Navbar.Brand>
           
                <GoogleLogout
                    clientId={clientId}
                    render={renderProps => (
                        <Button variant="light" onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</Button>
                    )}
                    buttonText="Logout"
                    onLogoutSuccess={Success}
                ></GoogleLogout>
        </Navbar>
    );
}

export default NavbarCustom