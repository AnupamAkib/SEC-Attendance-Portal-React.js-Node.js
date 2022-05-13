import React from 'react'
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({});
    const [loading, setloading] = useState(false)

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    useEffect(() => {
        if (localStorage.getItem("admin_logged_in") == "true") {
            navigate("/admin/report")
        }
    }, [])

    useEffect(() => {
        setloading(true)
        axios.post('https://flash-shop-server.herokuapp.com/SEC/showRoomLocation', {})
            .then((response) => {
                //console.log(response.data);
                setLoginData(response.data[0])
                setloading(false)
            }, (error) => {
                console.log(error);
            });
    }, [])

    const check_login = (e) => {
        e.preventDefault();
        if (username == loginData.admin_username && password == loginData.admin_password) {
            localStorage.setItem("admin_logged_in", "true")
            navigate("/admin/report")
        }
        else {
            alert("incorrect login")
        }
    }
    return (
        <div className='container col-4'>
            <h2 align='center'>Admin login</h2>
            <form onSubmit={check_login}>
                <TextField fullWidth label="Username" variant="filled" value={username} onChange={(e) => setusername(e.target.value)} type="text" required />
                <TextField fullWidth label="Password" variant="filled" value={password} onChange={(e) => setpassword(e.target.value)} type="password" required />
                <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? "data fetching" : "LOGIN"}</Button>
            </form>
        </div>
    )
}
