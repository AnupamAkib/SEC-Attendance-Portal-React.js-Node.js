import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout_admin() {
    const navigate = useNavigate();
    let toast = require('./toast_bar.js')

    const logout = () => {
        localStorage.removeItem("admin_logged_in");
        toast.msg("You have been logged out", "green", 3000)
        navigate("/admin")
    }
    useEffect(() => {
        logout();
    }, [])
    
    return <></>
}
