import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useConfirm } from 'material-ui-confirm';

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
    const [empName, setEmpName] = useState("")
    const [empPass, setEmpPass] = useState("")
    const [empID, setEmpID] = useState("")
    const [empDayOff, setEmpDayOff] = useState("")

    const confirm = useConfirm();
    const handleClick = (e_name, e_id) => {
        confirm({ description: 'SEC ' + e_name + ' will be removed permanently!' })
            .then(() => {
                axios.post('https://flash-shop-server.herokuapp.com/SEC/removeEmployee', {
                    //parameter
                    empID: e_id
                })
                    .then((response) => {
                        //console.log(response.data.data)
                        let ar = response.data;
                        if (ar.result == "done") {
                            setloading_after_edit((prev) => !prev);
                        }
                        else {
                            //something wrong
                        }
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
        setEmpDayOff("Saturday");
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
        axios.post('https://flash-shop-server.herokuapp.com/SEC/getAllEmployee', {
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
            });
    }, [loading_after_edit])

    const editEmp = (e) => {
        setbtn_loading(true);
        axios.post('https://flash-shop-server.herokuapp.com/SEC/editEmployee', {
            //parameter
            empName, empID, password: empPass, dayOff: empDayOff
        })
            .then((response) => {
                //console.log(response.data.data)
                setloading_after_edit((prev) => !prev);
                setbtn_loading(false);
                handleClose();
            }, (error) => {
                console.log(error);
            });
        e.preventDefault();
    }

    const addEmp = (e) => {
        console.log(empName, empID, empDayOff, empPass)
        setbtn_loading(true);
        axios.post('https://flash-shop-server.herokuapp.com/SEC/addEmployee', {
            //parameter
            empName, empID, password: empPass, dayOff: empDayOff
        })
            .then((response) => {
                //console.log(response.data.data)
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
                <td>{allEmp[i].empName}</td>
                <td>{allEmp[i].dayOff}</td>
                <td>
                    <button onClick={() => {
                        //console.log(allEmp[i].empName)
                        setEmpID(allEmp[i].empID);
                        setEmpName(allEmp[i].empName);
                        setEmpPass(allEmp[i].password);
                        setEmpDayOff(allEmp[i].dayOff);
                        handleOpen();
                    }}>
                        Edit
                    </button>
                    <button onClick={() => {
                        handleClick(allEmp[i].empName, allEmp[i].empID)
                    }}>REMOVE</button>
                </td>
            </tr>
        )
    }

    return (
        <div className='container'>
            <h1 align='center'>
                All SEC
            </h1>
            {loading ? <h1>loading...</h1> :
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>SEC Name</th>
                            <th>Day Off</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emp}
                    </tbody>
                </table>
            }


            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} className='col-6'>
                        <form onSubmit={editEmp}>
                            <input onChange={(e) => { setEmpName(e.target.value) }} value={empName} required /><br />
                            <input onChange={(e) => { setEmpID(e.target.value) }} value={empID} required /><br />
                            <input onChange={(e) => { setEmpPass(e.target.value) }} value={empPass} required /><br />

                            <select onChange={(e) => { setEmpDayOff(e.target.value) }} value={empDayOff} required>
                                <option value='Saturday'>Saturday</option>
                                <option value='Sunday'>Sunday</option>
                                <option value='Monday'>Monday</option>
                                <option value='Tuesday'>Tuesday</option>
                                <option value='Wednesday'>Wednesday</option>
                                <option value='Thursday'>Thursday</option>
                                <option value='Friday'>Friday</option>
                            </select>
                            <br />
                            <button type='submit'>{btn_loading ? "Please Wait" : "SAVE"}</button>
                        </form>
                    </Box>
                </Modal>


                <Modal
                    open={open_add}
                    onClose={handleClose_add}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} className='col-6'>
                        <form onSubmit={addEmp}>
                            <input onChange={(e) => { setEmpName(e.target.value) }} value={empName} placeholder="SEC Name" required /><br />
                            <input onChange={(e) => { setEmpID(e.target.value) }} value={empID} placeholder="SEC Employee ID" required /><br />
                            <input onChange={(e) => { setEmpPass(e.target.value) }} value={empPass} placeholder="Password" required /><br />

                            <select onChange={(e) => { setEmpDayOff(e.target.value) }} value={empDayOff} required>
                                <option value='Saturday'>Saturday</option>
                                <option value='Sunday'>Sunday</option>
                                <option value='Monday'>Monday</option>
                                <option value='Tuesday'>Tuesday</option>
                                <option value='Wednesday'>Wednesday</option>
                                <option value='Thursday'>Thursday</option>
                                <option value='Friday'>Friday</option>
                            </select>
                            <br />
                            <button type='submit'>{btn_loading ? "Please Wait" : "ADD"}</button>
                        </form>
                    </Box>
                </Modal>
            </div>

            <button onClick={handleOpen_add}>ADD</button>
        </div>
    )
}
