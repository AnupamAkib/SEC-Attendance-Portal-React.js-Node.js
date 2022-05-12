import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [empID, setEmpID] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        if (localStorage.getItem("empID")) {
            navigate("/attendance")
        }
    }, [])

    const formSubmit = (e) => {
        console.log(empID);
        console.log(password);

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
                    <input onChange={(e) => { setEmpID(e.target.value) }} type='text' placeholder='Enter Employee ID' required /><br />
                    <input onChange={(e) => { setPassword(e.target.value) }} type='password' placeholder='Enter Password' required /><br />
                    <button type='submit'>Login</button>
                </form>
            </div></div>
    )
}
