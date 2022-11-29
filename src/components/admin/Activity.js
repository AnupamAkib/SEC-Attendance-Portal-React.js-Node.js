import React from 'react'
import axios from 'axios'
import {useState} from 'react'
import {useEffect} from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import ActivityCard from './ActivityCard';
import Title from '../Title';
import CircularProgress from '@mui/material/CircularProgress';

export default function Activity() {
    let navigate = useNavigate();
    const [loading, setloading] = useState(false)
    const [activity, setActivity] = useState([])
    const [consoleText, setConsoleText] = useState("")
    const [tmp, settmp] = useState("")
    const [activity_flag, setactivity_flag] = useState(false)
    const [wrongText, setwrongText] = useState(false)
    const [versionflag, setversionflag] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("admin_logged_in") != "true") {
            navigate("/admin")
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setloading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/view_activity', {

        })
            .then((response) => {
                setloading(false)
                setActivity(response.data)
                //console.log(response.data)
            }, (error) => {
                console.log(error);
            });
    }, [])

    let act = [];
    for(let i=activity.length-1, j=0; (j<200 && i>=0); i--, j++){
        act.push(
            <ActivityCard 
            time={activity[i].time}
            role={activity[i].role}
            activity={activity[i].activity}
            />
        )
    }
    //act.reverse();


  return (
    <>
    <Title text="Activity Logs"/>
    <div className='container col-6'>
        
        {loading? <div align='center' style={{paddingTop:"30px"}}>
            <CircularProgress/><br/>Please Wait
        </div>:<>
        <h2 align='center'>{activity.length} activities found!</h2>
        <center><font style={{fontSize:"18px"}}>latest 200 activities is displayed</font></center>
        <hr/>
        {act}</>
        }
    </div>
    </>
  )
}
