import { useHistory } from 'react-router-dom';
import { auth } from '../utils/firebase'
import { Navbar, Button } from 'react-bootstrap';
import React from 'react';

const clientId =

    '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';

const NavbarCustom = ({ isAuth }) => {
    let history = useHistory();

    const logout = () => {
        auth.signOut().then(() => {
            console.log('Logout made successfully');
            alert('Logout made successfully');
            history.push('/login')
        }).catch((error) => {
            alert('Unable to Logout')
        });


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

            {isAuth &&
                <Button style={{ marginLeft: "auto" }} variant="light" onClick={logout}>Logout</Button>}

        </Navbar>
    );
}

export default NavbarCustom