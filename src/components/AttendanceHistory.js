import React from 'react'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Navigate, useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import Title from "./Title"
import Statistics from './Statistics';

let d = new Date();
let month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function daysInMonth(month, year) {
    let m;
    if (month == "January") { m = 1 }
    if (month == "February") { m = 2 }
    if (month == "March") { m = 3 }
    if (month == "April") { m = 4 }
    if (month == "May") { m = 5 }
    if (month == "June") { m = 6 }
    if (month == "July") { m = 7 }
    if (month == "August") { m = 8 }
    if (month == "September") { m = 9 }
    if (month == "October") { m = 10 }
    if (month == "November") { m = 11 }
    if (month == "December") { m = 12 }
    return new Date(year, m, 0).getDate();
}

export default function AttendanceHistory() {
    const navigate = useNavigate();
    let emp_ID = localStorage.getItem("empID");
    let password = localStorage.getItem("password");
    useEffect(() => {
        if (emp_ID == null) {
            navigate("/")
        }
    }, [])

    const [month, setMonth] = useState(month_name[d.getMonth()]);
    const [monthTmp, setMonthTmp] = useState(month_name[d.getMonth()]);
    const [year, setYear] = useState(d.getFullYear() + "");
    const [yearTmp, setYearTmp] = useState(d.getFullYear() + "");
    const [attendance, setAttendance] = useState([])
    const [loading, setloading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [empID, setempID] = useState(localStorage.getItem("empID"))

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

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setloading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/allAttendance', {
            //parameters
            month, year
        })
            .then((response) => {
                //console.log(response.data.data)
                let ar = response.data.data;
                setNotFound(true);
                for (let i = 0; i < ar.length; i++) {
                    if (ar[i].empID == empID) {
                        console.log(ar[i].status)
                        setAttendance(ar[i].status)
                        setNotFound(false);
                        break;
                    }
                }
                setloading(false)
            }, (error) => {
                console.log(error);
            });
    }, [month, year])

    let att = [];

    for(let i=0; i<attendance.length; i++){
        att.push(
            <tr align='center'>
                <td>{i+1 + " " + month + ", " + year}</td>
                <td>{attendance[i]}</td>
            </tr>
        )
    }

    let sickLeave = [];
    let dayOff = [];
    let lateDate=[];
    let workingDay = 0, late=0;

    for (let i = 0; i < attendance.length; i++) {
        if (attendance[i] == "Sick Leave") {
            sickLeave.push(i+1)
        }
        else if (attendance[i] == "Day Off") {
            dayOff.push(i+1);
        }
        else if (attendance[i] != "-" && attendance.length) {
            workingDay++;

            //late and late fee count
            let time = attendance[i];
            let hour = time.split(':')[0];
            let minute = time.split(':')[1].split(' ')[0];
            let ampm = time.split(':')[1].split(' ')[1];
            //console.log({hour, minute, ampm})
            if(ampm=="PM"){
                late++;
                lateDate.push(i+1);
            }
            else if((parseInt(hour) == 10 && parseInt(minute) > 30 && ampm == "AM")){
                late++;
                lateDate.push(i+1);
            }
            else if((parseInt(hour) > 10 && ampm == "AM")){ 
                late++;
                lateDate.push(i+1);
            }
        }
    }

    const monthYearChange = (e) => {
        setYear(yearTmp);
        setMonth(monthTmp);
        save_activity("SEC", `${localStorage.getItem("sec_name")} viewed his/her attendance history for ${monthTmp}, ${yearTmp}`);
        e.preventDefault();
    }

    const printArray = (ar) => {
        let tmp = [];
        for (let i = 0; i < ar.length; i++) {
            if (i != ar.length - 1) tmp.push(ar[i] + ", ")
            else tmp.push(ar[i])
        }
        return tmp;
    }
    

    return (
        <>
        <Title text="Attendance History"/>
        <div className='container col-6'>
            <div className='container'>
                    <form onSubmit={monthYearChange}>
                        <center>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <FormControl variant='filled'>
                                                <InputLabel id="month">Month</InputLabel>
                                                <Select
                                                    label="Month"
                                                    variant="filled"
                                                    value={monthTmp}
                                                    onChange={(e) => { setMonthTmp(e.target.value) }}
                                                >
                                                    <MenuItem value="January">January</MenuItem>
                                                    <MenuItem value="February">February</MenuItem>
                                                    <MenuItem value="March">March</MenuItem>
                                                    <MenuItem value="April">April</MenuItem>
                                                    <MenuItem value="May">May</MenuItem>
                                                    <MenuItem value="June">June</MenuItem>
                                                    <MenuItem value="July">July</MenuItem>
                                                    <MenuItem value="August">August</MenuItem>
                                                    <MenuItem value="September">September</MenuItem>
                                                    <MenuItem value="October">October</MenuItem>
                                                    <MenuItem value="November">November</MenuItem>
                                                    <MenuItem value="December" >December</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td>
                                            <FormControl variant='filled'>
                                                <InputLabel id="day">Year</InputLabel>
                                                <Select
                                                    value={yearTmp}
                                                    label="Year"
                                                    variant="filled"
                                                    onChange={(e) => { setYearTmp(e.target.value) }}
                                                >
                                                    <MenuItem value="2022">2022</MenuItem>
                                                    <MenuItem value="2023">2023</MenuItem>
                                                    <MenuItem value="2024">2024</MenuItem>
                                                    <MenuItem value="2025">2025</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td>
                                            <Button type="submit" variant="contained" style={{ padding: "15px 0px" }}>VIEW</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </center>
                    </form>
                </div>
                
                <center>
                    <br/>
                    <Button variant="outlined" onClick={()=>{window.print();save_activity("SEC", localStorage.getItem("sec_name")+" printed his/her attendance history for "+month+", "+year)}}><i className='fa fa-print' style={{marginRight:"7px"}}></i>print this page</Button>
                </center>


                <div style={{ padding: "15px" }}>
                    <h3 align='center'>{month}, {year}</h3>
                    <hr/>
                    <center>
                        <b>SEC:</b> {localStorage.getItem("sec_name")}<br/>
                        <b>Employee ID:</b> {localStorage.getItem("empID")}<br/>
                    </center>
                    <hr />
                    {
                    loading?
                    <div align='center'><br /><br />
                        <CircularProgress /><br />
                        <font size="4">Loading</font>
                    </div>
                    :
                    notFound?
                    <div align='center'>
                        <h2 style={{color:"red"}}>404 Not Found!</h2>
                    </div>
                    :
                    <>
                    <font size='4'>
                        <h3>General Information:</h3>
                        Day Off:<b> {dayOff.length} Day{dayOff.length > 1 ? "s" : ""} </b>{dayOff.length ? <>({printArray(dayOff)})</> : ""} <br />
                        Casual/Sick leave:<b> {sickLeave.length} Day{sickLeave.length > 1 ? "s" : ""} </b>{sickLeave.length ? <>({printArray(sickLeave)})</> : ""} <br />
                        Working Days: <b>{workingDay} Day{workingDay > 1 ? "s" : ""}</b><br/>
                        <br/><h3>Late fee calculation:</h3>
                        Total Late Count: <b>{late} Day{late > 1 ? "s" : ""}</b><br/>
                        Late Dates: {printArray(lateDate)} {month}<br/>
                        Late Fee: <b>{late>3? <>{late}*100 = {late*100} Taka</> : "0 Taka"}</b><br/>
                        Comment: <b>{late<=3? "okay" : "late fee counted"}</b><br/>
                        
                    </font><hr />
                    <table className='table table-striped' width="100%" border="0px" cellSpacing="0px" cellPadding="8px">
                        <thead>
                            <tr align='center'>
                                <th>Date</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {att}
                        </tbody>
                    </table>
                    </>
                    }
                </div>
        </div></>
    )
}
