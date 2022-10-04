import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';

export default function Statistics(props) {
    let empID = props.empID;
    let month = props.month;
    let year = props.year;
    let day = props.day;
    const [prevAttendance, setPrevAttendance] = useState([])
    const [loading, setloading] = useState(true)
    useEffect(() => {
        axios.post('https://flash-rym7.onrender.com/SEC/allAttendance', {
            //parameters
            month, year
        })
            .then((response) => {
                //console.log(response.data.data)
                let ar = response.data.data;
                for (let i = 0; i < ar.length; i++) {
                    if (ar[i].empID == empID) {
                        //console.log(ar[i].status)
                        setPrevAttendance(ar[i].status)
                        break;
                    }
                }
                setloading(false)
            }, (error) => {
                console.log(error);
            });
    }, [])

    let attendanceHistory = [];

    for (let i = day; i >= 1; i--) {
        attendanceHistory.push(<tr align='center'><td>{i + " " + month + ", " + year}</td><td>{prevAttendance[i - 1]}</td></tr>)
    }
    let sickLeave = [];
    let dayOff = [];
    let workingDay = 0;
    for (let i = 1; i <= day; i++) {
        if (prevAttendance[i - 1] == "Sick Leave") {
            sickLeave.push(i)
        }
        else if (prevAttendance[i - 1] == "Day Off") {
            dayOff.push(i);
        }
        else if (prevAttendance[i - 1] != "-" && prevAttendance.length) {
            workingDay++;
        }
    }

    const printArray = (ar) => {
        let tmp = [];
        for (let i = 0; i < ar.length; i++) {
            if (i != ar.length - 1) tmp.push(ar[i] + ", ")
            else tmp.push(ar[i])
        }
        return tmp;
    }
    if (loading) {
        return (
            <div align='center'><br /><br />
                <CircularProgress /><br />
                <font size="4">Loading</font>
            </div>
        )
    }
    return (
        <div style={{ padding: "15px" }}><br />
            <h3 align='center'>Attendance (till {day + " " + month + ", " + year})</h3><hr />
            <font size='4'>
                Day Off:<b> {dayOff.length} Day{dayOff.length > 1 ? "s" : ""} </b>{dayOff.length ? <>({printArray(dayOff)})</> : ""} <br />
                Casual/Sick leave:<b> {sickLeave.length} Day{sickLeave.length > 1 ? "s" : ""} </b>{sickLeave.length ? <>({printArray(sickLeave)})</> : ""} <br />
                Working Days: <b>{workingDay} Day{workingDay > 1 ? "s" : ""}</b>
            </font><hr />
            <table className='table table-striped' width="100%" border="0px" cellSpacing="0px" cellPadding="8px">
                <thead>
                    <tr align='center'>
                        <th>Date</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceHistory}
                </tbody>
            </table>
        </div>
    )
}
