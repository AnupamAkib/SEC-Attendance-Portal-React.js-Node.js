import React from 'react'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(true); }
    const handleClose = () => { setTakeTime(false); setOpen(false); }

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
        axios.post('https://flash-shop-server.herokuapp.com/SEC/allAttendance', {
            month, year
        })
            .then((response) => {
                //console.log(response.data.data);
                setAttendance(response.data.data);
                if (response.data.data.length == 0) {
                    setNotFound(true)
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
    tmp.push(<th>SEC Name</th>)
    let x = daysInMonth(month, year)
    for (let i = 0; i < x; i++) {
        tmp.push(<th>{(i + 1) + "-" + month[0] + month[1] + month[2] + "-" + year[2] + year[3]}</th>)
    }
    report_header.push(<tr align='center'>{tmp}</tr>)

    const changeValue = () => {
        handleOpen();
    }

    report = []
    for (let i = 0; i < attendance.length; i++) {
        tmp = [];
        let dayOff = [];
        let sickLeave = [], workingDay = 0;
        tmp.push(<td><font color="darkgreen"><b>{attendance[i].empName}</b></font></td>)
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
                changeValue()
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
        console.log(year)
        e.preventDefault();
    }

    const changeIndividual = (e) => {
        //setStateValue({ ...stateValue, status: takeTime })
        console.log(stateValue)
        axios.post('https://flash-shop-server.herokuapp.com/SEC/editAttendanceIndividual', {
            empID: stateValue.empID, day: stateValue.day + "", month: stateValue.month, year: stateValue.year, new_status: stateValue.status
        })
            .then((response) => {
                //done
                console.log(stateValue)
                console.log(response.data)
                setloading_after_edit((prev) => !prev);
            }, (error) => {
                //something wrong
                setloading(false)
            });
        handleClose()
        e.preventDefault();
    }

    return (
        <div className='container'>
            <h2 align='center'>SEC Attendance Report</h2>
            <form onSubmit={monthYearChange}>
                <select onChange={(e) => { setMonthTmp(e.target.value) }}>
                    <option value="January" selected={month == "January"}>January</option>
                    <option value="February" selected={month == "February"}>February</option>
                    <option value="March" selected={month == "March"}>March</option>
                    <option value="April" selected={month == "April"}>April</option>
                    <option value="May" selected={month == "May"}>May</option>
                    <option value="June" selected={month == "June"}>June</option>
                    <option value="July" selected={month == "July"}>July</option>
                    <option value="August" selected={month == "August"}>August</option>
                    <option value="September" selected={month == "September"}>September</option>
                    <option value="October" selected={month == "October"}>October</option>
                    <option value="November" selected={month == "November"}>November</option>
                    <option value="December" selected={month == "December"}>December</option>
                </select>
                <select onChange={(e) => { setYearTmp(e.target.value) }}>
                    <option value="2022" selected={year == "2022"}>2022</option>
                    <option value="2023" selected={year == "2023"}>2023</option>
                    <option value="2024" selected={year == "2024"}>2024</option>
                    <option value="2025" selected={year == "2025"}>2025</option>
                </select>
                <button type="submit">Find</button>
            </form>
            {loading ? <h2>Loading...</h2> :
                <div className="table-responsive">
                    {notFound ?
                        <h2>NOT FOUND</h2>
                        :
                        <>
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button"
                                table="table-to-xls"
                                filename={"SEC_Attendance_Report_" + month + year}
                                sheet="tablexls"
                                buttonText="Download Report as XLS" />


                            <table className='table table-striped table-bordered' width="100%" border="1" id="table-to-xls">
                                <thead>
                                    <tr><td colSpan={daysInMonth(month, year) + 1}><br />
                                        <font size='4'><b>Pragati Sarani SEC Attendance</b></font>
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
                <Box sx={style} className='col-6'>
                    {stateValue.empName}<br />
                    {stateValue.empID}<br />
                    {stateValue.day + " " + stateValue.month + ", " + stateValue.year}
                    <br />
                    <form onSubmit={changeIndividual}>

                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
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
                        {(stateValue.status == "Present" || (stateValue.status != "-" && stateValue.status != "Sick Leave" && stateValue.status != "Day Off")) ?
                            <input onChange={(e) => {
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
                            }} value={takeTime} placeholder="10:35 AM" type="time" required /> : ""}

                        <br />
                        <button type='submit'>SAVE</button>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}
