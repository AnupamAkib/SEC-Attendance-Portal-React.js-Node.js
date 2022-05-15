import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";
import Title from './Title';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ChangePassword() {
    let navigate = useNavigate();
    let toast = require('./toast_bar.js')

    const [cur_pass, setcur_pass] = useState("")
    const [new_pass, setnew_pass] = useState("")
    const [new_pass_again, setnew_pass_again] = useState("")
    const [loading, setloading] = useState(false)


    useEffect(() => {
        if (localStorage.getItem("empID") == null) {
            toast.msg("Login first", "red", 3000);
            navigate("/")
        }
    }, [])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const changePass = (e) => {
        e.preventDefault();
        if (new_pass == new_pass_again) {
            if (localStorage.getItem("password") == cur_pass) {
                //change
                setloading(true)
                axios.post('https://flash-shop-server.herokuapp.com/SEC/change_Password', {
                    //parameters
                    empID: localStorage.getItem("empID"),
                    new_password: new_pass
                })
                    .then((response) => {
                        setloading(false)
                        toast.msg(<font>Password Changed Successfully</font>, "green", 3000)
                        localStorage.setItem("password", new_pass);
                        navigate("/attendance")
                    }, (error) => {
                        setloading(false)
                        toast.msg(<font>Something went wrong</font>, "red", 2000)
                    });
            }
            else {
                toast.msg("Incorrect Password", "red", 2500)
            }
        }
        else {
            toast.msg("Password didn't match", "red", 2500)
        }
    }


    return (
        <>
            <Title text="Change Password" />
            <div className='container col-4'>
                <div className='login_box'>
                    <form onSubmit={changePass}>
                        <TextField onChange={(e) => setcur_pass(e.target.value)} value={cur_pass} variant='filled' label="Current Password" type="password" fullWidth required /><br />
                        <TextField onChange={(e) => setnew_pass(e.target.value)} value={new_pass} variant='filled' label="New Password" type="password" fullWidth required /><br />
                        <TextField onChange={(e) => setnew_pass_again(e.target.value)} value={new_pass_again} variant='filled' label="Re-write the password" type="password" fullWidth required /><br />
                        <Button size="large" type="submit" variant='contained' fullWidth disabled={loading}>{loading ? "Please wait" : "Change password"}</Button>
                    </form>
                </div>
            </div>
        </>
    )
}
