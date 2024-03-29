import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useConfirm } from 'material-ui-confirm';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router-dom';
import Title from '../Title';

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

export default function All_Employee() {
    const navigate = useNavigate()
    const [empName, setEmpName] = useState("")
    const [empPass, setEmpPass] = useState("")
    const [empID, setEmpID] = useState("")
    const [empDayOff, setEmpDayOff] = useState("")
    const [showroom_name, setshowroom_name] = useState("")
    const [latitude, setlatitude] = useState("")
    const [longtide, setlongitude] = useState("")
    const [range, setrange] = useState("")

    const [removebtnloading, setRemovebtnloading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("admin_logged_in") != "true") {
            navigate("/admin")
        }
    }, [])

    useEffect(() => {
        document.body.style.backgroundColor = "#fff";
    window.scrollTo(0, 0)
    }, [])

    const confirm = useConfirm();
    const handleClick = (e_name, e_id) => {
        confirm({ description: 'SEC ' + e_name + ' will be removed permanently!' })
            .then(() => {
                setRemovebtnloading(true)
                save_activity("Admin", "Removed  "+empName+" as SEC");
                axios.post('https://flash-rym7.onrender.com/SEC/removeEmployee', {
                    //parameter
                    empID: e_id
                })
                    .then((response) => {
                        //console.log(response.data.data)
                        let ar = response.data;
                        if (ar.result == "done") {
                            setloading_after_edit((prev) => !prev);
                            let toast = require("../toast_bar")
                            toast.msg("SEC Removed", "green", 3000)
                        }
                        else {
                            //something wrong
                            let toast = require("../toast_bar")
                            toast.msg("something wrong", "red", 3000)
                        }
                        setRemovebtnloading(false)
                        handleClose()
                    }, (error) => {
                        console.log(error);
                    });
            })
            .catch(() => { /* ... */ });
    };
    const [open, setOpen] = React.useState(false);
    const [open_add, setOpen_add] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleOpen_add = () => {
        setEmpName("");
        setEmpID("");
        setEmpPass("");
        setshowroom_name("");
        setlatitude("")
        setlongitude("")
        setrange("")
        setEmpDayOff("Friday");
        setOpen_add(true);
    }
    const handleClose = () => setOpen(false);
    const handleClose_add = () => setOpen_add(false);

    const [loading, setloading] = useState(true)
    const [btn_loading, setbtn_loading] = useState(false)
    const [loading_after_edit, setloading_after_edit] = useState(false)
    const [allEmp, setAllEmp] = useState([])
    useEffect(() => {
        setloading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/getAllEmployee', {
            //parameter
        })
            .then((response) => {
                //console.log(response.data.data)
                let ar = response.data;
                //console.log(ar.data)
                setAllEmp(ar.data);
                setloading(false)
            }, (error) => {
                console.log(error);
                let toast = require("../toast_bar")
                toast.msg("something wrong", "red", 3000)
            });
    }, [loading_after_edit])

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

    const editEmp = (e) => {
        save_activity("Admin", "Edited "+empName+"'s information");
        setRemovebtnloading(true);
        axios.post('https://flash-rym7.onrender.com/SEC/editEmployee', {
            //parameter
            empName, empID, password: empPass, dayOff: empDayOff, showroom_name: capital_letter(showroom_name), latitude, longitude: longtide, range
        })
            .then((response) => {
                //console.log(response.data.data)
                setloading_after_edit((prev) => !prev);
                setRemovebtnloading(false);
                handleClose();
                let toast = require("../toast_bar")
                toast.msg("Edit Successful", "green", 3000)
            }, (error) => {
                console.log(error);
                let toast = require("../toast_bar")
                toast.msg("Something wrong", "red", 3000)
            });
        e.preventDefault();
    }

    function capital_letter(str) {
        str = str.split(" ");

        for (var i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }

        return str.join(" ");
    }

    const addEmp = (e) => {
        save_activity("Admin", "Added "+empName+" as SEC");
        setEmpName((prev) => capital_letter(prev))
        let e_n = capital_letter(empName)
        setbtn_loading(true);
        axios.post('https://flash-rym7.onrender.com/SEC/addEmployee', {
            //parameter
            empName: e_n, empID, password: empPass, dayOff: empDayOff, showroom_name: capital_letter(showroom_name), latitude, longitude: longtide, range
        })
            .then((response) => {
                //console.log(response.data)
                if (response.data.result == "done") {
                    //success
                    let toast = require("../toast_bar")
                    toast.msg("SEC Added Successfully", "green", 3000)
                }
                else {
                    let toast = require("../toast_bar")
                    toast.msg("EmployeeID already added", "red", 3000)
                }
                setloading_after_edit((prev) => !prev);
                setbtn_loading(false);
                handleClose_add();
            }, (error) => {
                console.log(error);
            });
        e.preventDefault();
    }



    let emp = [];
    for (let i = 0; i < allEmp.length; i++) {
        emp.push(
            <tr>
                <td>{allEmp[i].empName} <font color="#a3a3a3">({allEmp[i].showroom_name})</font></td>
                <td>{allEmp[i].dayOff}</td>
                <td><center>
                    <Button variant="contained" onClick={() => {
                        //console.log(allEmp[i].empName)
                        setEmpID(allEmp[i].empID);
                        setEmpName(allEmp[i].empName);
                        setEmpPass(allEmp[i].password);
                        setEmpDayOff(allEmp[i].dayOff);
                        setshowroom_name(allEmp[i].showroom_name);
                        setlatitude(allEmp[i].latitude);
                        setlongitude(allEmp[i].longitude);
                        setrange(allEmp[i].range);
                        handleOpen();
                    }}><i className='fa fa-edit' style={{marginRight:"5px"}}></i>Edit
                    </Button></center>
                </td>
            </tr>
        )
    }



    const locateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setlatitude(pos.coords.latitude)
                setlongitude(pos.coords.longitude)
            });
        }
    }

    return (
        <>
            <Title text="Manage SEC" />
            <center>
                <Button onClick={handleOpen_add} variant="outlined" size="large"><i className="fa fa-plus" style={{marginRight:"8px"}}></i>ADD NEW SEC</Button><br/><br/>
            </center>
            <div className='container col-6'>
                {loading ?
                    <div className="col-5 container">
                        <br /><br /><br />
                        <font size="5">Please Wait</font>
                        <LinearProgress />
                    </div>
                    :
                    <>
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>Name & Showroom</th>
                                <th>Day Off</th>
                                <th><center>Action</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {emp}
                        </tbody>
                    </table><br/>
                    </>
                }


                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} className='col-4'>
                            <button style={{ float: "right", background: "transparent", border: "0px", fontSize: "large" }} onClick={handleClose}><i className="fa fa-close"></i></button>
                            <h3>Edit SEC info</h3><hr />
                            <form onSubmit={editEmp}>
                                <TextField fullWidth onChange={(e) => { setEmpName(e.target.value) }} value={empName} label="SEC Name" variant="filled" InputProps={{ readOnly: true }} required /><br />
                                <TextField fullWidth onChange={(e) => { setEmpID(e.target.value) }} value={empID} label="EmployeeID" variant="filled" InputProps={{ readOnly: true }} required /><br />
                                <TextField fullWidth onChange={(e) => { setEmpPass(e.target.value) }} value={empPass} label="Password" variant="filled" required /><br />

                                <TextField fullWidth onChange={(e) => { setshowroom_name(e.target.value) }} value={showroom_name} label="Showroom Name" variant="filled" required /><br />
                                <TextField type="text" fullWidth onChange={(e) => { setlatitude(e.target.value) }} value={latitude} label="Showroom latitude" variant="filled" required /><br />
                                <TextField type="text" fullWidth onChange={(e) => { setlongitude(e.target.value) }} value={longtide} label="Showroom longitude" variant="filled" required /><br />
                                <TextField type="number" fullWidth onChange={(e) => { setrange(e.target.value) }} value={range} label="Range (Meter)" variant="filled" required /><br />

                                <FormControl variant='filled' fullWidth>
                                    <InputLabel id="dayOff_label">Day Off</InputLabel>
                                    <Select
                                        labelId='dayOff_label'
                                        label="Day Off"
                                        value={empDayOff}
                                        onChange={(e) => { setEmpDayOff(e.target.value) }}
                                    >
                                        <MenuItem value='Saturday'>Saturday</MenuItem>
                                        <MenuItem value='Sunday'>Sunday</MenuItem>
                                        <MenuItem value='Monday'>Monday</MenuItem>
                                        <MenuItem value='Tuesday'>Tuesday</MenuItem>
                                        <MenuItem value='Wednesday'>Wednesday</MenuItem>
                                        <MenuItem value='Thursday'>Thursday</MenuItem>
                                        <MenuItem value='Friday'>Friday</MenuItem>
                                    </Select>
                                </FormControl>

                                <br />
                                <center>
                                    <Button onClick={() => locateMe()}>Locate my position</Button><br />
                                    <Button type='submit' variant="contained" disabled={removebtnloading} style={{ marginRight: "5px", width: "128px" }}>{removebtnloading ? "Working..." : <font size="3"><i className="fa fa-save" style={{ marginRight: "5px" }}></i> SAVE</font>}</Button>
                                    <Button variant="contained" color="error" onClick={() => {
                                        handleClick(empName, empID)
                                    }} disabled={removebtnloading} style={{ width: "128px" }}>{removebtnloading ? "Working..." : <font size="3"><i className="fa fa-trash-o" style={{ marginRight: "5px" }}></i> REMOVE</font>}</Button>
                                </center>
                            </form>
                        </Box>
                    </Modal>


                    <Modal
                        open={open_add}
                        onClose={handleClose_add}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} className='col-4'>
                            <button style={{ float: "right", background: "transparent", border: "0px", fontSize: "large" }} onClick={handleClose_add}><i className="fa fa-close"></i></button>
                            <h3>Add New SEC</h3><hr />
                            <form onSubmit={addEmp}>
                                <TextField fullWidth onChange={(e) => { setEmpName(e.target.value) }} value={empName} placeholder="SEC Name" label="SEC Name" variant="filled" required /><br />
                                <TextField fullWidth onChange={(e) => { setEmpID(e.target.value) }} value={empID} placeholder="SEC EmployeeID" label="SEC EmployeeID" variant="filled" required /><br />
                                <TextField fullWidth onChange={(e) => { setEmpPass(e.target.value) }} value={empPass} placeholder="Password" label="Password" variant="filled" required /><br />

                                <TextField fullWidth onChange={(e) => { setshowroom_name(e.target.value) }} value={showroom_name} label="Showroom Name" variant="filled" required /><br />
                                <TextField type="text" fullWidth onChange={(e) => { setlatitude(e.target.value) }} value={latitude} label="Showroom latitude" variant="filled" required /><br />
                                <TextField type="text" fullWidth onChange={(e) => { setlongitude(e.target.value) }} value={longtide} label="Showroom longitude" variant="filled" required /><br />
                                <TextField type="number" fullWidth onChange={(e) => { setrange(e.target.value) }} value={range} label="Range (Meter)" variant="filled" required /><br />


                                <FormControl variant='filled' fullWidth>
                                    <InputLabel id="dayOff_label">Day Off</InputLabel>
                                    <Select
                                        labelId='dayOff_label'
                                        label="Day Off"
                                        value={empDayOff}
                                        onChange={(e) => { setEmpDayOff(e.target.value) }}
                                    >
                                        <MenuItem value='Saturday'>Saturday</MenuItem>
                                        <MenuItem value='Sunday'>Sunday</MenuItem>
                                        <MenuItem value='Monday'>Monday</MenuItem>
                                        <MenuItem value='Tuesday'>Tuesday</MenuItem>
                                        <MenuItem value='Wednesday'>Wednesday</MenuItem>
                                        <MenuItem value='Thursday'>Thursday</MenuItem>
                                        <MenuItem value='Friday'>Friday</MenuItem>
                                    </Select>
                                </FormControl>
                                <br />
                                <center>
                                    <Button onClick={() => locateMe()}>Locate my position</Button><br />
                                    <Button type='submit' variant="contained" disabled={btn_loading}>{btn_loading ? "Please Wait" : <font size='3'><i className="fa fa-plus-square" style={{ marginRight: "5px" }}></i>ADD {empName.split(" ")[empName.split(" ").length - 1]}</font>}</Button>
                                </center>
                            </form>
                        </Box>
                    </Modal>
                </div>

                
            </div></>
    )
}
