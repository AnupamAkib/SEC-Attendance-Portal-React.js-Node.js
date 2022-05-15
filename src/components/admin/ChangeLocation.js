import React from 'react'
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Title from '../Title';

export default function ChangeLocation() {
    const navigate = useNavigate();
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [range, setRange] = useState("")
    const [key, setKey] = useState("")
    const [loading, setloading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("admin_logged_in") != "true") {
            navigate("/admin")
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setloading(true)
        axios.post('https://flash-shop-server.herokuapp.com/SEC/showRoomLocation', {

        })
            .then((response) => {
                //console.log(response.data);
                setLatitude(response.data[0].latitude)
                setLongitude(response.data[0].longitude)
                setRange(response.data[0].range)
                setKey(response.data[0]._id)
                setloading(false)
            }, (error) => {
                console.log(error);
                let toast = require("../toast_bar")
                toast.msg("something wrong", "red", 3000)
            });
    }, [])


    const locateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude)
                setLongitude(pos.coords.longitude)
            });
        }
    }

    const changeShowRoomLocation = (e) => {
        e.preventDefault();
        setloading(true)
        axios.post('https://flash-shop-server.herokuapp.com/SEC/change_showroom_location', {
            latitude, longitude, range, id: key
        })
            .then((response) => {
                let toast = require("../toast_bar")
                toast.msg("Changes saved successfully", "green", 3000)
                setloading(false)
            }, (error) => {
                console.log(error);
                let toast = require("../toast_bar")
                toast.msg("try again", "red", 3000)
            });
    }

    return (
        <>
            <Title text="Showroom Location" />
            <div className='container col-4'>
                <div className='login_box'>
                    <form onSubmit={changeShowRoomLocation}>
                        <TextField fullWidth variant="filled" label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required /><br />
                        <TextField fullWidth variant="filled" label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required /><br />
                        <TextField fullWidth variant="filled" label="Range (Meter)" value={range} onChange={(e) => setRange(e.target.value)} required /><br />
                        <Button size="large" fullWidth onClick={locateMe}>Locate my position</Button><br />
                        <Button size="large" fullWidth variant="contained" type='submit' disabled={loading}>{loading ? "please wait" : "SAVE Changes"}</Button>
                    </form>
                </div></div></>
    )
}
