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
import { CircularProgress } from '@mui/material';


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
        document.body.style.backgroundColor = "#fff";
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
        range: "0"
    })
    const [loading_location, setloading_location] = useState(true)
    const [showroom_name, setshowroom_name] = useState("")

    /*useEffect(() => {
        setloading_location(true)
        axios.post('https://flash-rym7.onrender.com/SEC/showRoomLocation', {
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
    }, [])*/

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
        setloading_location(true)
        axios.post('https://flash-rym7.onrender.com/SEC/SEC_login', {
            //parameters
            empID, password
        })
            .then((response) => {
                //console.log(response.data)
                let res = response.data;
                if (res.result == "done") {
                    setEmpName(response.data.empName);
                    setDayOff(response.data.dayOff);
                    setshowroom_name(response.data.showroom_name)
                    setShowroomLocation({
                        latitude: response.data.latitude,
                        longitude: response.data.longitude,
                        range: response.data.range
                    })
                    setloading_location(false)
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
        axios.post('https://flash-rym7.onrender.com/SEC/checkAttendance', {
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
                toast.msg("Please refresh the page", "", 5000)
            });
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
                save_activity("SEC", `${empName} submitted his/her attendance as '${status}' `);
                axios.post('https://flash-rym7.onrender.com/SEC/mark', {
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
                            localStorage.clear();
                            navigate("/")
                        }

                    }, (error) => {
                        let toast = require("./toast_bar")
                        toast.msg("Sorry, something wrong. Try Again", "red", 3000)
                    });
            })
            .catch(() => { /* ... */ });

    }

    const logoutMe = () => {
        save_activity("SEC", empName+" logged out from the portal")
        localStorage.removeItem("empID");
        localStorage.removeItem("password");
        toast.msg("You have been logged out", "green", 3000)
        navigate("/")
    }


    function getDistance(lat1, lat2, lon1, lon2) {
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371 * 1000;

        // calculate the result
        return (c * r);
    }

    //let distance = Math.sqrt((parseFloat(showroomLocation.latitude) - geoLocation[0]) * (parseFloat(showroomLocation.latitude) - geoLocation[0]) + (showroomLocation.longitude - geoLocation[1]) * (showroomLocation.longitude - geoLocation[1]));
    let distance = getDistance(parseFloat(showroomLocation.latitude), geoLocation[0], parseFloat(showroomLocation.longitude), geoLocation[1])

    return (
        <>
            <Title text="My Attendance" />
            <div className='container col-6'>
                {/*<div align='center' className='timedate'>
                    <b>{getDay() + " " + getMonth() + ", " + getYear()}</b><br />
                    {getTime("with sec")}
                    <h3 align="center">Welcome back!</h3>
                </div><br />*/}
                

                {loading_attendance || loading_info ?
                    <div align='center'>
                        <br />
                        <CircularProgress/><br/>
                    {/*<img src='dog-loading.gif' width='100px'/><br/>*/}
                    <font size="4" color='gray'>
                        <b>
                        Connecting to Server<br/>
                        </b></font>
                        <font size="3" color='gray'>Refresh the page if it takes long time to load.</font>
                    </div>
                    :
                    <>
                        <div className='attendanceButtonBody' style={{marginBottom:"20px", marginTop:"20px"}}>
                            <table>
                                <tr>
                                    <td>
                                        <img src="/sec.png" width="70" style={{opacity:"0.5"}}/>
                                    </td>
                                    <td style={{paddingLeft:"10px"}}>
                                        <h3 style={{color:"#000"}} className="">{empName.toUpperCase()}</h3>
                                        <font style={{fontSize:"20px"}}>{showroom_name}</font>
                                        {/* (in {distance.toFixed(0)} m)*/}
                                    </td>
                                </tr>
                            </table>
                            <div style={{padding:"15px 10px 5px 8px", borderTop:"0px solid #d0d0d0", fontSize:"18px"}}>
                                <b>Employee ID:</b> {empID}<br/>
                                <b>Day off :</b> {dayOff}
                            </div>
                        </div>

                        {alreadyAttendanceGiven ?
                            <>
                                <center>
                                    <div className='attendanceButtonBody'>
                                        <h4 align='center'>Today's Attendance</h4><hr />
                                        {/*<img src='done.png' width='90px' />*/}
                                        <i className="fa fa-check-square-o" style={{fontSize:"100px", color:"green"}}></i><br/>
                                        <h3><b>Successfully Submitted</b></h3>

                                        <table className="table table-bordered" width="100%" border="1px" cellSpacing="0px" cellPadding="9px" style={{border:"1px solid #c9c9c9", boxShadow:"0 0 5px rgba(0, 0, 0, 0.20)"}}>
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
                                    <h4 align='center'>Today's Attendance</h4><hr />
                                    <form onSubmit={giveAttendance}>
                                        {
                                            (distance <= showroomLocation.range) ?
                                                <Button className='attendance_btn' style={{ background: "#06bf00", color: "white", padding: "15px 0px 15px 0px", fontSize: "23px", marginBottom: "7px" }} onClick={() => { setStatus("Present") }} disabled={loading_location ? true : false} type="submit" fullWidth>{loading_location ? "Locating showroom..." : <><i className='fa fa-calendar-check-o' style={{marginRight:"9px"}}></i><b>PRESENT</b></>}</Button>
                                                :
                                                <Button style={{ marginBottom: "5px" }} fullWidth>{loading_your_location ? "Locating your position..." : <font color='red' size="4">You are <b>{(distance).toFixed(2)} meter </b>away from showroom</font>}</Button>
                                        }
                                        <br />
                                        <Button className='attendance_btn' style={{ background: "#1976d2", color: "white", padding: "15px 0px 15px 0px", fontSize: "23px", marginBottom: "7px" }} onClick={() => { setStatus("Day Off") }} type="submit" fullWidth><><i className='fa fa-calendar-minus-o' style={{marginRight:"10px"}}></i><b>DAY OFF</b></></Button><br />
                                        <Button className='attendance_btn' style={{ background: "#707070", color: "#fff", padding: "15px 0px 15px 0px", fontSize: "23px" }} onClick={() => { setStatus("Sick Leave") }} type="submit" fullWidth><><i className='fa fa-calendar-times-o' style={{marginRight:"9px"}}></i><b>SICK LEAVE</b></></Button><br />
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
