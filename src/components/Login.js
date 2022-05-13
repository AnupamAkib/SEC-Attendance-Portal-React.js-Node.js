import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login() {
    const navigate = useNavigate();
    const [empID, setEmpID] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setloading] = useState(false)
    useEffect(() => {
        if (localStorage.getItem("empID")) {
            navigate("/attendance")
        }
    }, [])

    const formSubmit = (e) => {
        console.log(empID);
        console.log(password);
        setloading(true)
        axios.post('https://flash-shop-server.herokuapp.com/SEC/SEC_login', {
            //parameters
            empID, password
        })
            .then((response) => {
                console.log(response.data)
                let res = response.data;
                if (res.result == "done") {
                    localStorage.setItem("empID", empID);
                    localStorage.setItem("password", password);
                    navigate("/attendance");
                }
                else {
                    alert("incorrect login")
                }
                setloading(false)
            }, (error) => {
                console.log(error);
            });


        e.preventDefault();
    }
    return (
        <div className='container' align='center'>
            <br />
            <div className='col-5 login_box'>
                <h2>SEC Login</h2><hr />
                <form onSubmit={formSubmit}>
                    <TextField fullWidth label="Enter Employee ID" variant="filled" onChange={(e) => { setEmpID(e.target.value) }} type='text' placeholder='' required /><br />
                    <TextField fullWidth label="Enter Password" variant="filled" onChange={(e) => { setPassword(e.target.value) }} type='password' placeholder='' required /><br />
                    <Button type='submit' variant='contained' size="large" fullWidth disabled={loading}>{loading ? "please wait" : <><i class="fa fa-sign-in" style={{ marginRight: "8px" }}></i>Login</>}</Button>
                </form>
            </div></div>
    )
}
