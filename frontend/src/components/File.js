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
import Draggable from 'react-draggable';
import { Plus } from 'react-bootstrap-icons';
import { Alert } from 'react-bootstrap';


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
    let [isVerified,setIsVerified]=useState()


    const changeHandler = async (event) => {

        if (event.target.files[0] == undefined)
            return


        const data = new FormData()
        data.append('file', event.target.files[0])


        if (userData.files.includes(event.target.files[0].name)) {
            alert("a file with the given name already exists")
            return
        }

        try {
            setUploading(true)
            toastId.current = toast(<Loading />);
            await axios.post("/upload", data)
            toast.dismiss(toastId.current);
            setUploading(false)
            axios.get('/home').then(response => {
                setUserData(response.data)
            })

            alert("uploaded")

        }
        catch (err) {
            alert(err.response.data.data)
            console.log(err)
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(async function(user) {
        console.log(user)
        if (user == null) {
            history.push('/login')
        } 

        else {
            let token = await auth.currentUser.getIdToken(/* forceRefresh */ true)
            setToken(token)
            refreshTokenSetup()
            setIsAuth(true)

            try {
                let response = await axios.get('/home')
                setUserData(response.data)
                setIsVerified(auth.currentUser.emailVerified)
                setLoading(false);
            }
            catch (err) {
                alert(err.response?.data?.data)
                console.log(err.response)
            }

        }
    })}, [])


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
                        <NavbarCustom isAuth={isAuth} />
                        {!uploading && isVerified && <Draggable>
                            <div style={{
                                position: 'fixed',
                                zIndex: '50',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: '90%',
                                left: '94%',
                                width: 20,
                                height: 20,
                                backgroundColor: '#fff',
                                borderRadius: 50,
                            }}>
                                <label style={{ height: '20rem' }} htmlFor="files"><Plus color="royalblue" size={60} /></label>
                                <input
                                    id="files"
                                    style={{
                                        display: "none",
                                        visibility: "none",

                                    }} type="file" name="file" onChange={changeHandler} />
                            </div></Draggable>}

                        <div>
                            {isVerified?(<Wrapper>
                                {
                                    !userData?.files.length && 
                                    <Alert variant='primary'>No files uploaded till now</Alert>
                                }
                                {
                                    userData !== null && userData.files.map((f) => (
                                        <FileItem key={f} filename={f} userData={userData} updateUserData={updateUserData} />))

                                }
                            </Wrapper>):<Alert variant='danger'>Pls Verofy Email before uploading</Alert>}
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