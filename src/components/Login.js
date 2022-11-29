import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Title from './Title';

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

    useEffect(() => {
        document.body.style.backgroundColor = "#fff";
    window.scrollTo(0, 0)
    }, [])

    const save_activity = (_role, _activity) => {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        const t = d+"/"+m+"/"+y+" "+strTime;
        axios.post('https://flash-rym7.onrender.com/SEC/add_activity', {
                time : t,
                role : _role,
                activity: _activity
        })
            .then((response) => {
            }, (error) => {
            });
    }


    const formSubmit = (e) => {
        //console.log(empID);
        //console.log(password);
        setloading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/SEC_login', {
            //parameters
            empID, password
        })
            .then((response) => {
                //console.log(response.data)
                let res = response.data;
                if (res.result == "done") {
                    localStorage.setItem("empID", empID);
                    localStorage.setItem("password", password);
                    localStorage.setItem("sec_name", res.empName);
                    let toast = require("./toast_bar")
                    toast.msg("Login Successful", "green", 3000)
                    save_activity("SEC", res.empName+" logged in")
                    navigate("/attendance");
                }
                else {
                    let toast = require("./toast_bar")
                    toast.msg("Incorrect Login Information", "red", 3000)
                }
                setloading(false)
            }, (error) => {
                let toast = require("./toast_bar")
                toast.msg("Sorry, something wrong", "red", 3000)
            });


        e.preventDefault();
    }
    return (
        <>
            <Title text="SEC Login" />
            <div className='container' align='center'>
                <div className='col-5 login_box'>
                    <font size="5">Login with your EmployeeID and Password</font><br /><br />
                    <form onSubmit={formSubmit}>
                        <TextField fullWidth label="Enter Employee ID" variant="filled" onChange={(e) => { setEmpID(e.target.value) }} type='text' placeholder='' required /><br />
                        <TextField fullWidth label="Enter Password" variant="filled" onChange={(e) => { setPassword(e.target.value) }} type='password' placeholder='' required /><br />
                        <Button type='submit' variant='contained' size="large" fullWidth disabled={loading}>{loading ? "please wait" : <><i class="fa fa-sign-in" style={{ marginRight: "8px" }}></i>Login</>}</Button>
                    </form>
                </div></div></>
    )
}
