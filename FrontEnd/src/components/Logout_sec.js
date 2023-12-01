import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout_sec() {
    const navigate = useNavigate();
    let toast = require('./toast_bar.js')
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

    const logout = () => {
        save_activity("SEC", localStorage.getItem("sec_name")+" logged out from the portal")
        localStorage.removeItem("empID");
        localStorage.removeItem("password");
        localStorage.removeItem("sec_name");
        toast.msg("You have been logged out", "green", 3000)
        navigate("/")
    }
    useEffect(() => {
        logout();
    }, [])
    
    return <></>
}
