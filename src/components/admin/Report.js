import React from 'react'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
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
import Title from "../Title"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

let tmp = [];
let report = [];
let report_header = [];
let d = new Date();
let details = [];
let cur_month = d.getMonth();
let cur_year = d.getFullYear();

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

export default function Report() {
    const navigate = useNavigate();
    const [month, setMonth] = useState(month_name[d.getMonth()]);
    const [monthTmp, setMonthTmp] = useState(month_name[d.getMonth()]);
    const [year, setYear] = useState(d.getFullYear() + "");
    const [yearTmp, setYearTmp] = useState(d.getFullYear() + "");
    const [attendance, setAttendance] = useState([])
    const [loading, setloading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [stateValue, setStateValue] = useState({})
    const [takeTime, setTakeTime] = useState("")
    const [loading_after_edit, setloading_after_edit] = useState(false)

    const [individualChangeLoading, setIndividualChangeLoading] = useState(false)

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(true); }
    const handleClose = () => { setTakeTime(false); setOpen(false); }

    useEffect(() => {
        if (localStorage.getItem("admin_logged_in") != "true") {
            navigate("/admin")
        }
    }, [])

    useEffect(() => {
        document.body.style.backgroundColor = "#fff";
    window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (stateValue.status == "Present") {
            setTakeTime("")
        }
        else {
            setTakeTime(takeTime)
        }
    }, [stateValue.status])

    useEffect(() => {
        setloading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/allAttendance', {
            month, year
        })
            .then((response) => {
                //console.log(response.data.data);
                setAttendance(response.data.data);
                if (response.data.data.length == 0) {
                    setNotFound(true)
                    let toast = require("../toast_bar")
                    toast.msg("Not Found", "red", 3000)
                }
                else {
                    setNotFound(false)
                }
                setloading(false)
            }, (error) => {
                console.log(error);
                setloading(false)
            });
    }, [month, year, loading_after_edit])

    const printArray = (ar) => {
        let tmp = [];
        for (let i = 0; i < ar.length; i++) {
            if (i != ar.length - 1) tmp.push(ar[i] + ", ")
            else tmp.push(ar[i])
        }
        return tmp;
    }

    details = [];
    tmp = []
    report_header = []
    tmp.push(<th style={{ background: "#fffc99" }}>SEC Name</th>)
    let x = daysInMonth(month, year)
    for (let i = 0; i < x; i++) {
        tmp.push(<th style={{ background: "#bae1ff" }}>{(i + 1) + "-" + month[0] + month[1] + month[2] + "-" + year[2] + year[3]}</th>)
    }
    report_header.push(<tr align='center'>{tmp}</tr>)

    const changeValue = (q) => {
        //console.log(q)
        q = q.split(" ");
        let z = q[0].split(":");
        if (q[1] == "PM" && z[0] != "12") {
            z[0] = parseInt(z[0])
            z[0] += 12;
        }
        else if (q[1] == "AM" && z[0] == "12") {
            z[0] = "00";
        }
        setTakeTime(z[0] + ":" + z[1])
        handleOpen();
    }

    report = []
    for (let i = 0; i < attendance.length; i++) {
        tmp = [];
        let dayOff = [];
        let sickLeave = [], workingDay = 0;
        tmp.push(<td style={{ background: "#fffc99" }}><font color="#000"><b>{attendance[i].empName}</b></font></td>)
        let status = attendance[i].status;
        let x = daysInMonth(month, year)
        for (let j = 0; j < x; j++) {
            tmp.push(<td onClick={() => {
                setStateValue({
                    empID: attendance[i].empID,
                    empName: attendance[i].empName,
                    day: j + 1,
                    month: month,
                    year: year,
                    status: status[j]
                })
                changeValue(status[j])
            }}>{status[j]}</td>)

            if (status[j] == "Day Off") dayOff.push(j + 1);
            else if (status[j] == "Sick Leave") sickLeave.push(j + 1);
            else if (status[j] != "-") workingDay++;
        }
        report.push(<tr align='center'>{tmp}</tr>)
        details.push({
            empName: attendance[i].empName,
            dayOff,
            sickLeave,
            workingDay
        })
    }

    const monthYearChange = (e) => {
        setYear(yearTmp);
        setMonth(monthTmp);
        save_activity("Admin", "Viewed attendance history for "+monthTmp+" "+yearTmp);
        //console.log(year)
        e.preventDefault();
    }

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

    const changeIndividual = (e) => {
        //console.log(stateValue)

        save_activity("Admin", "Edited "+stateValue.empName+"'s attendance")

        setIndividualChangeLoading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/editAttendanceIndividual', {
            empID: stateValue.empID, day: stateValue.day + "", month: stateValue.month, year: stateValue.year, new_status: stateValue.status
        })
            .then((response) => {
                //done
                //console.log(stateValue)
                //console.log(response.data)
                setIndividualChangeLoading(false)
                handleClose()
                setloading_after_edit((prev) => !prev);
                let toast = require("../toast_bar")
                toast.msg("Saved", "green", 2000)
            }, (error) => {
                //something wrong
                setloading(false)
                let toast = require("../toast_bar")
                toast.msg("Sorry, something wrong", "red", 3000)
            });
        e.preventDefault();
    }

    return (
        <>
            <Title text="SEC Attendance Report" />
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

                {loading ?
                    <div className='container col-4'>
                        <br /><br /><br />
                        <font size="5">Please Wait</font>
                        <LinearProgress />
                    </div>
                    :
                    <div className="table-responsive">
                        {notFound ?
                            <>
                                <br />
                                <div style={{ background: "#f0f0f0", margin: "30px", padding: "30px" }}>
                                    <h2 align='center'>No Record Found!</h2>
                                </div>
                            </>
                            :
                            <>
                                <br />
                                <center>
                                    <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="download-table-xls-button btn btn-primary"
                                        table="table-to-xls"
                                        filename={"SEC_Attendance_Report_" + month + year}
                                        sheet="tablexls"
                                        buttonText={<font onClick={(e)=>save_activity("Admin", "Downloaded Report for "+month+" "+year)}><i className="fa fa-download" style={{ marginRight: "5px" }}></i> Download Report as XLS</font>}
                                    />
                                </center>


                                <table className='table table-striped table-bordered' width="100%" border="1" id="table-to-xls">
                                    <thead>
                                        <tr><td colSpan={daysInMonth(month, year) + 1}><br />
                                            <font size='4'><b>Pragati Sarani SEC Attendance ({month}, {year})</b></font>
                                            <br /><br /></td></tr>
                                        {report_header}
                                    </thead>
                                    <tbody>
                                        {report}
                                        <tr><td colSpan={daysInMonth(month, year) + 1}><br />
                                            <font size='4'><b>Day Off / Casual Leave / Sick Leave </b></font>
                                            <br /><br /></td></tr>
                                        <tr align='center'>
                                            <th colSpan={2}>SEC Name</th>
                                            <th colSpan={2}>Casual/Sick Leave</th>
                                            <th colSpan={2}>Day Off</th>
                                            <th colSpan={2}>Working Days</th>
                                        </tr>
                                        {details.map((d) =>
                                            <tr align='center'>
                                                <td colSpan={2}>{d.empName}</td>
                                                {
                                                    d.sickLeave.length ?
                                                        <td colSpan={2}>{d.sickLeave.length}{d.sickLeave.length > 1 ? " Days (" : " Day ("}<b>{printArray(d.sickLeave)}</b>{")"}</td>
                                                        :
                                                        <td colSpan={2}>-</td>
                                                }
                                                {
                                                    d.dayOff.length ?
                                                        <td colSpan={2}>{d.dayOff.length}{d.dayOff.length > 1 ? " Days (" : " Day ("}<b>{printArray(d.dayOff)}</b>{")"}</td>
                                                        :
                                                        <td colSpan={2}>-</td>
                                                }
                                                <td colSpan={2}>{d.workingDay}</td>

                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan={daysInMonth(month, year) + 1} align='center'>
                                                Generated by <b>SEC Portal App</b><br />
                                                Date: {d.getDate() + " " + month_name[d.getMonth()] + ", " + d.getFullYear()}<br />
                                                Developed by <a href="http://facebook.com/anupam.akib">Mir Anupam Hossain Akib</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table></>
                        }
                    </div>
                }
                <div>
                </div>


                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} className='col-4'>
                        <button style={{ float: "right", background: "transparent", border: "0px", fontSize: "large" }} onClick={handleClose}><i className="fa fa-close"></i></button>
                        <h3>Edit Attendance</h3><hr />
                        SEC Name: <b>{stateValue.empName}</b><br />
                        EmployeeID: <b>{stateValue.empID}</b><br />
                        Date: <b>{stateValue.day + " " + stateValue.month + ", " + stateValue.year}</b>
                        <br />
                        <form onSubmit={changeIndividual} align="center">
                            <FormControl variant='filled' style={{width:"45%"}}>
                                <InputLabel id="dayOff_label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={(stateValue.status != "-" && stateValue.status != "Sick Leave" && stateValue.status != "Day Off") ? "Present" : stateValue.status}
                                    label="Status"
                                    onChange={(e) => {
                                        setStateValue({ ...stateValue, status: e.target.value })
                                    }}
                                    
                                >
                                    <MenuItem value="-">-</MenuItem>
                                    <MenuItem value="Present">Present</MenuItem>
                                    <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                                    <MenuItem value="Day Off">Day Off</MenuItem>
                                </Select>
                            </FormControl>
                            {(stateValue.status == "Present" || (stateValue.status != "-" && stateValue.status != "Sick Leave" && stateValue.status != "Day Off")) ?
                                <TextField onChange={(e) => {
                                    let t = e.target.value;
                                    let mh = t.split(":");
                                    let hours = mh[0];
                                    let minutes = mh[1];
                                    let ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12;
                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                    if (hours < 10) hours = "0" + hours;
                                    var strTime = "";
                                    strTime = hours + ':' + minutes + ' ' + ampm;
                                    setTakeTime(e.target.value)
                                    setStateValue({ ...stateValue, status: strTime })
                                }} value={takeTime} placeholder="10:35 AM" type="time" label="Time" variant="filled" required /> : ""}

                            <br /><br />
                            <center>
                                <Button type='submit' variant="contained" style={{ width: "120px", marginRight: "5px" }} disabled={individualChangeLoading}>{individualChangeLoading ? "Loading" : "SAVE"}</Button>
                                <Button variant="outlined" onClick={handleClose} style={{ width: "120px" }}>Cancel</Button>
                            </center>
                        </form>
                    </Box>
                </Modal>
            </div></>
    )
}
