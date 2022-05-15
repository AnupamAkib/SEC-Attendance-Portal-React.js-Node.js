import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";
import Statistics from './Statistics';
import Button from '@mui/material/Button';
import { useConfirm } from 'material-ui-confirm';
import LinearProgress from '@mui/material/LinearProgress';
import Title from './Title';
import Footer from './Footer';

export default function Dashboard() {
    const navigate = useNavigate();
    let toast = require('./toast_bar.js')
    let empID = localStorage.getItem("empID");
    let password = localStorage.getItem("password");
    useEffect(() => {
        if (empID == null) {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [geoLocation, setGeoLocation] = useState([])
    const [loading_your_location, setloading_your_location] = useState(true)
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                //console.log("Latitude: " + pos.coords.latitude)
                //console.log("Longitude: " + pos.coords.longitude)
                //console.log(pos.coords.accuracy);
                setGeoLocation([pos.coords.latitude, pos.coords.longitude])
                setloading_your_location(false)
            });
        }
    }

    useEffect(() => {
        setInterval(() => getLocation(), 500);
    }, []);

    const [showroomLocation, setShowroomLocation] = useState({
        latitude: "0",
        longitude: "0",
        range: "0",
        _id: "0"
    })
    const [loading_location, setloading_location] = useState(true)

    useEffect(() => {
        setloading_location(true)
        axios.post('https://flash-shop-server.herokuapp.com/SEC/showRoomLocation', {
            //parameters
        })
            .then((response) => {
                setShowroomLocation(response.data[0]);
                //console.log(response.data[0])
                setloading_location(false)
            }, (error) => {
                let toast = require("./toast_bar")
                toast.msg(<font>Please <b>REFRESH</b> the page. Server was sleeping</font>, "red", 5000)
            });
    }, [])

    const [empName, setEmpName] = useState("")
    const [dayOff, setDayOff] = useState("")
    const [status, setStatus] = useState("")
    const [alreadyAttendanceGiven, setAlreadyAttendanceGiven] = useState();
    const [attendanceStatus, setAttendanceStatus] = useState("")
    const [loading_info, setLoading_info] = useState(true)
    const [loading_attendance, setLoading_attendance] = useState(true)


    const [timedate, settimedate] = useState(new Date());
    useEffect(() => {
        setInterval(() => settimedate(new Date()), 1000);
    }, []);

    const getTime = (st) => {
        var hours = timedate.getHours();
        var minutes = timedate.getMinutes();
        var sec = timedate.getSeconds();
        if (sec < 10) sec = "0" + sec;
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        if (hours < 10) hours = "0" + hours;
        var strTime = "";
        if (st == "with sec") {
            strTime = hours + ':' + minutes + ':' + sec + ' ' + ampm;
        }
        else {
            strTime = hours + ':' + minutes + ' ' + ampm;
        }
        return strTime;
    }
    const getDay = () => {
        return timedate.getDate();
    }
    const getMonth = () => {
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let m = timedate.getMonth();
        return month[m];
    }
    const getYear = () => {
        return timedate.getFullYear();
    }



    useEffect(() => {
        axios.post('https://flash-shop-server.herokuapp.com/SEC/SEC_login', {
            //parameters
            empID, password
        })
            .then((response) => {
                //console.log(response.data)
                let res = response.data;
                if (res.result == "done") {
                    setEmpName(response.data.empName);
                    setDayOff(response.data.dayOff);
                }
                else {
                    //something wrong
                    localStorage.removeItem("empID");
                    localStorage.removeItem("password");
                    let toast = require("./toast_bar")
                    toast.msg("Please login", "red", 3000)
                    navigate("/")
                }
                setLoading_info(false)
            }, (error) => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        let day = getDay();
        let month = getMonth();
        let year = getYear();
        axios.post('https://flash-shop-server.herokuapp.com/SEC/checkAttendance', {
            //parameters
            empID, day, month, year
        })
            .then((response) => {
                //console.log(response.data)
                setAttendanceStatus(response.data.status);
                if (response.data.status == "not given") {
                    setAlreadyAttendanceGiven(false)
                }
                else {
                    setAlreadyAttendanceGiven(true)
                }
                setLoading_attendance(false)
            }, (error) => {
                console.log(error);
            });
    }, [])

    const confirm = useConfirm();
    const giveAttendance = (e) => {
        e.preventDefault();
        let time = getTime();
        if (status == "Present") {
            setStatus(getTime());
        }
        let day = getDay();
        let month = getMonth();
        let year = getYear();
        confirm({ description: "Attendance will be saved as \"" + status + "\" & you can not change it later." })
            .then(() => {
                setLoading_attendance(true)
                axios.post('https://flash-shop-server.herokuapp.com/SEC/mark', {
                    //parameters
                    empID, day, month, year, time, status
                })
                    .then((response) => {
                        if (response.data.success == true) {
                            setAlreadyAttendanceGiven(true);
                            setAttendanceStatus(status == "Present" ? time : status)
                            setLoading_attendance(false)
                            let toast = require("./toast_bar")
                            toast.msg("Attendance Submitted Successfully", "green", 3000)
                        }

                    }, (error) => {
                        let toast = require("./toast_bar")
                        toast.msg("Sorry, something wrong. Try Again", "red", 3000)
                    });
            })
            .catch(() => { /* ... */ });

    }

    const logoutMe = () => {
        localStorage.removeItem("empID");
        localStorage.removeItem("password");
        toast.msg("You have been logged out", "green", 3000)
        navigate("/")
    }

    let distance = Math.sqrt((showroomLocation.latitude - geoLocation[0]) * (showroomLocation.latitude - geoLocation[0]) + (showroomLocation.longitude - geoLocation[1]) * (showroomLocation.longitude - geoLocation[1]));
    return (
        <>
            <Title text="My Attendance" />
            <div className='container col-6'>
                <div align='center' className='timedate'>
                    <b>{getDay() + " " + getMonth() + ", " + getYear()}</b><br />
                    {getTime("with sec")}
                </div><br />

                {loading_attendance || loading_info ?
                    <div>
                        <br />
                        <font size="5">Please Wait</font>
                        <LinearProgress />
                    </div>
                    :
                    <>
                        <div className='attendanceButtonBody'>
                            <table border="0" width="100%">
                                <tbody>
                                    <tr><td colSpan={2}>SEC Name: <b>{empName}</b></td></tr>
                                    <tr><td colSpan={2}>EmployeeID: <b>{empID}</b></td></tr>
                                    <tr>
                                        <td>Day Off : <b>{dayOff}</b></td>
                                        <td align='right'><Button onClick={logoutMe} variant="outlined" size="small"><i className="fa fa-sign-out" style={{ marginRight: "5px" }}></i> LOGOUT</Button></td>
                                    </tr>
                                </tbody>
                            </table>


                        </div><br />

                        {alreadyAttendanceGiven ?
                            <>
                                <center>
                                    <div className='attendanceButtonBody'>
                                        <h4 align='center'>Todays Attendance</h4><hr />
                                        <img src='done.png' width='90px' />
                                        <h3><b>Attendance Submitted</b></h3>

                                        <table className="table table-bordered" width="100%" border="1px" cellSpacing="0px" cellPadding="9px">
                                            <thead>
                                                <tr align='center'>
                                                    <th width="50%">Date</th>
                                                    <th>Attendance</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr align='center'>
                                                    <td>{getDay() + " " + getMonth() + ", " + getYear()}</td>
                                                    <td>{(attendanceStatus[0] == 'D' || attendanceStatus[0] == 'S') ? <font color="blue"><b>{attendanceStatus}</b></font> :
                                                        <><font color='green'><b>Present</b></font> ({attendanceStatus})</>
                                                    }</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </center>
                                <Statistics empID={empID} day={getDay()} month={getMonth()} year={getYear()} />
                            </>
                            :
                            <>
                                <div className='attendanceButtonBody'>
                                    <h4 align='center'>Todays Attendance</h4><hr />
                                    <form onSubmit={giveAttendance}>
                                        {
                                            (distance <= showroomLocation.range * 0.00001) ?
                                                <button style={{ background: "#06bf00", color: "white" }} onClick={() => { setStatus("Present") }} className='attendanceBtn' disabled={loading_location ? true : false}>{loading_location ? "Locating showroom..." : "PRESENT"}</button>
                                                :
                                                <button className='attendanceBtn' disabled={true}>{loading_your_location ? "Locating your position..." : <font color='red' size="5">You are {(distance / 0.00001).toFixed(2)} meter away from showroom</font>}</button>
                                        }
                                        <br />
                                        <button style={{ background: "#1976d2", color: "white" }} onClick={() => { setStatus("Day Off") }} className='attendanceBtn'>DAY OFF</button><br />
                                        <button style={{ background: "#c1bfff", color: "#000" }} onClick={() => { setStatus("Sick Leave") }} className='attendanceBtn'>SICK LEAVE</button><br />
                                    </form>
                                </div>
                                <Statistics empID={empID} day={getDay()} month={getMonth()} year={getYear()} />
                            </>
                        }
                    </>
                }

                <img src='done.png' width='0px' />

            </div >
            {
                (!loading_attendance && !loading_info) ? <Footer /> : ""
            }

        </>
    )
}
