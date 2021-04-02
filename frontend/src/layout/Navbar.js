import { useHistory } from 'react-router-dom';
import { auth } from '../utils/firebase'
import { Navbar, Button } from 'react-bootstrap';
import React from 'react';

const NavbarCustom = ({ isAuth, changeHandler, isVerified, uploading }) => {
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

    const onChange = (e) => {
        e.preventDefault()

        //defined in File.js
        changeHandler(e)
    }

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
            <div style={{ marginLeft: "auto" }} >
                {isAuth &&
                    <>
                        <Button style={{ height: "2.4rem", marginRight: "0.5rem" }} variant="light" disabled={uploading}>
                            <label htmlFor="files">{uploading ? 'Uploading' : 'Upload'}</label>
                            <input
                                id="files"
                                style={{
                                    display: "none",
                                    visibility: "none",

                                }} type="file" name="file" onChange={onChange} disabled={uploading} /></Button>
                    </>}

                {isAuth &&
                    <Button style={{ marginLeft: "0.5rem" }} variant="light" onClick={logout}>Logout</Button>}
            </div>


        </Navbar>
    );
}

export default NavbarCustom