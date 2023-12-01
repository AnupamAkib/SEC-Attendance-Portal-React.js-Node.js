import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';

export default function Statistics(props) {
    let empID = props.empID;
    let month = props.month;
    let year = props.year;
    let day = props.day;

    //console.log({empID, day, month, year})
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
    let lateDate=[];
    let workingDay = 0, late=0;
    for (let i = 1; i <= day; i++) {
        if (prevAttendance[i - 1] == "Sick Leave") {
            sickLeave.push(i)
        }
        else if (prevAttendance[i - 1] == "Day Off") {
            dayOff.push(i);
        }
        else if (prevAttendance[i - 1] != "-" && prevAttendance.length) {
            workingDay++;

            //late and late fee count
            let time = prevAttendance[i - 1];
            let hour = time.split(':')[0];
            let minute = time.split(':')[1].split(' ')[0];
            let ampm = time.split(':')[1].split(' ')[1];
            //console.log({hour, minute, ampm})
            if(ampm=="PM"){
                late++;
                lateDate.push(i);
            }
            else if((parseInt(hour) == 10 && parseInt(minute) > 30 && ampm == "AM")){
                late++;
                lateDate.push(i);
            }
            else if((parseInt(hour) > 10 && ampm == "AM")){ 
                late++;
                lateDate.push(i);
            }
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
        <div style={{ padding: "15px" }}>
            <h3 align='center'>Your Attendance (till {day + " " + month + ", " + year})</h3><hr />
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
                    {attendanceHistory}
                </tbody>
            </table>
        </div>
    )
}
