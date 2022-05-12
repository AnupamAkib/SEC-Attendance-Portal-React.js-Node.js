import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";
import Statistics from './Statistics';

export default function Dashboard() {
    const navigate = useNavigate();
    let empID = localStorage.getItem("empID");
    let password = localStorage.getItem("password");
    useEffect(() => {
        if (empID == null) {
            navigate("/")
        }
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
        setInterval(() => getLocation(), 1000);
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
                console.log(response.data[0])
                setloading_location(false)
            }, (error) => {
                console.log(error);
            });
    }, [])

    const [empName, setEmpName] = useState("")
    const [dayOff, setDayOff] = useState("")
    const [status, setStatus] = useState("")
    const [alreadyAttendanceGiven, setAlreadyAttendanceGiven] = useState();
    const [attendanceStatus, setAttendanceStatus] = useState("")
    const [loading_info, setLoading_info] = useState(true)
    const [loading_attendance, setLoading_attendance] = useState(true)
    //let methods = require("./methods.js");

    //Time & Date
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
                    localStorage.clear();
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


    const giveAttendance = (e) => {
        setLoading_attendance(true)
        let time = getTime();
        if (status == "Present") {
            setStatus(getTime());
        }
        let day = getDay();
        let month = getMonth();
        let year = getYear();
        axios.post('https://flash-shop-server.herokuapp.com/SEC/mark', {
            //parameters
            empID, day, month, year, time, status
        })
            .then((response) => {
                if (response.data.success == true) {
                    setAlreadyAttendanceGiven(true);
                    setAttendanceStatus(status == "Present" ? time : status)
                    setLoading_attendance(false)
                }

            }, (error) => {
                console.log(error);
            });

        e.preventDefault();
    }

    const logoutMe = () => {
        localStorage.clear();
        navigate("/")
    }


    /*const check_location = () => {
        //console.log("loc")
        //console.log(showroomLocation)
        //if(Math.abs(showroomLocation.latitude - geoLocation[0]) <= showroomLocation.range * 0.00001)
        return (
            <div>aaa</div>
        )
    }*/
    const check_location = () => {
        return "A"
    }

    let distance = Math.sqrt((showroomLocation.latitude - geoLocation[0]) * (showroomLocation.latitude - geoLocation[0]) + (showroomLocation.longitude - geoLocation[1]) * (showroomLocation.longitude - geoLocation[1]));
    return (
        <div className='container col-6'>

            latitude: {geoLocation[0]}<br />longitude: {geoLocation[1]}

            <img src='done.png' width='0px' />
            <div align='center' className='timedate'>
                <b>{getDay() + " " + getMonth() + ", " + getYear()}</b><br />
                {getTime("with sec")}<br /><br />
            </div>

            {loading_attendance || loading_info ?
                <h3>fetching data...</h3>
                :
                <>
                    <div className='attendanceButtonBody'>
                        SEC Name: <b>{empName}</b><br />
                        EmployeeID: <b>{empID}</b><br />
                        Day Off : <b>{dayOff}</b>
                    </div><br />

                    {alreadyAttendanceGiven ?
                        <>
                            <center>
                                <div className='attendanceButtonBody'>
                                    <h4 align='center'>Todays Attendance</h4><hr />
                                    <img src='done.png' width='90px' />
                                    <h3>Already Submitted</h3>

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
                                            <button style={{ background: "#87fc7e" }} onClick={() => { setStatus("Present") }} className='attendanceBtn' disabled={loading_location ? true : false}>{loading_location ? "Locating showroom..." : "PRESENT"}</button>
                                            :
                                            <button className='attendanceBtn' disabled={true}>{loading_your_location ? "Locating your position..." : <font color='red'>You are away from showroom</font>}<br />{distance / 0.00001} m</button>
                                    }
                                    <br />
                                    <button style={{ background: "#c1bfff" }} onClick={() => { setStatus("Day Off") }} className='attendanceBtn'>DAY OFF</button><br />
                                    <button style={{ background: "#ffa6a6" }} onClick={() => { setStatus("Sick Leave") }} className='attendanceBtn'>SICK LEAVE</button><br />
                                </form>
                            </div>
                            <Statistics empID={empID} day={getDay()} month={getMonth()} year={getYear()} />
                        </>
                    }
                </>
            }

            <br />

            <button onClick={logoutMe}>LOGOUT</button>
        </div>
    )
}
/*

(check_location) ? 
:"d"
                                    

*/