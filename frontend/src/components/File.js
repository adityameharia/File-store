import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { refreshTokenSetup } from '../utils/refreshToken';
import setToken from '../utils/setToken'
import FileItem from './FileItem'
import { auth } from '../utils/firebase'
import NavbarCustom from '../layout/Navbar'
import axios from 'axios';
import styled from "styled-components"
import { Alert } from 'react-bootstrap';
import {backendUrl} from '../utils/url'

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
    flex-wrap:wrap;
	font-size: 1.5rem;
	justify-content: space-evenly;
	align-items: center;
	background-color: white;
	font-family: Raleway, sans-serif;
	padding: 1em;
`



const Loading = () => (
    <div style={{
        display: 'flex',
        flexDirection: "row",
    }}>
        Uploading &nbsp;<Loader type="ThreeDots" color="#00BFFF" height={30} width={30} />
    </div>
)

function File() {

    let history = useHistory();

    const toastId = React.useRef(null);

    let [loading, setLoading] = useState(true)
    let [userData, setUserData] = useState(null)
    let [uploading, setUploading] = useState(false)
    let [isAuth, setIsAuth] = useState(false)
    let [isVerified, setIsVerified] = useState()


    const changeHandler = async (event) => {

        if (event.target.files[0] === undefined)
            return

        if (event.target.files[0].size >10e6)
        {    
            alert("Pls select a File less than 10MB")
            return
        }

        const data = new FormData()
        data.append('file', event.target.files[0])


        if (userData.files.includes(event.target.files[0].name)) {
            alert("a file with the given name already exists")
            return
        }

        try {

            setUploading(true)

            toastId.current = toast(<Loading />);

            let res = await axios.get(`${backendUrl}/upload/${userData.ID}/${event.target.files[0].name}`)

            await axios.put(res.data.url, data)

            toast.dismiss(toastId.current);
            setUploading(false)

            axios.get(`${backendUrl}/home`).then(response => {
                setUserData(response.data)
            })
        }
        catch (err) {
            //alert("fuck")
            alert(err.response.data.data)
            console.log(err.response)
        }
    };

    useEffect(() => {
        let unmounted = false;
        if(!unmounted){
        auth.onAuthStateChanged(async function (user) {
            if (user == null) {
                history.push('/login')
            }

            else {
                let token = await auth.currentUser.getIdToken(/* forceRefresh */ true)
                setToken(token)
                refreshTokenSetup()
                setIsAuth(true)
                try {
                    let response = await axios.get(`${backendUrl}/home`)
                    setUserData(response.data)
                    setIsVerified(auth.currentUser.emailVerified)
                    setLoading(false);
                    
                }
                catch (err) {
                    if(err.response?.data?.data!=="No account with the given emailId exists")
                    {
                        console.log("nope")
                        alert(err.response?.data?.data)
                        history.push('/login')
                    }
                    console.log(err.response)
                    
                }

            }
        })}
        return () => { unmounted = true };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    const updateUserData = (data) => {
        setUserData(data)
    }

    return (
        <div>
            {loading ? (<div style={{ textAlign: "center", padding: "2rem" }}>
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            </div>) :
                (
                    <div>
                        <NavbarCustom
                            isAuth={isAuth}
                            changeHandler={changeHandler}
                            isVerified={isVerified}
                            uploading={uploading} />

                        <div>
                            {isVerified ? (<Wrapper>
                                {
                                    !userData?.files.length &&
                                    <Alert variant='primary'>No files uploaded till now</Alert>
                                }
                                {
                                    userData !== null && userData.files.slice(0).reverse().map((f) => (
                                        <FileItem key={f} filename={f} userData={userData} updateUserData={updateUserData} />))

                                }
                            </Wrapper>) : <Alert variant='danger'>Pls Verify Email before uploading</Alert>}
                        </div>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={false}
                            hideProgressBar={true}
                            draggable />
                    </div>
                )}


        </div>
    );
}

export default File;