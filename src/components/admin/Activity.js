import React from 'react'
import axios from 'axios'
import {useState} from 'react'
import {useEffect} from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import ActivityCard from './ActivityCard';

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
        document.body.style.backgroundColor = "#000";
    window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setloading(true)
        axios.post('https://flash-rym7.onrender.com/SEC/view_activity', {

        })
            .then((response) => {
                setloading(false)
                setActivity(response.data)
                console.log(response.data)
            }, (error) => {
                console.log(error);
            });
    }, [])

    let act = [];
    for(let i=0; i<activity.length; i++){
        act.push(
            <ActivityCard 
            time={activity[i].time}
            role={activity[i].role}
            activity={activity[i].activity}
            />
        )
    }
    act.reverse();


    const consoleQuery = (e) =>{
        settmp(consoleText);
        if(consoleText=="portal --activity"){
            setactivity_flag(true);
            setConsoleText("")
        }
        else if(consoleText=="portal --v"){
            setversionflag(true);
            setConsoleText("")
        }
        else if(consoleText!=''){
            setwrongText(true);
            setConsoleText("")
        }
        e.preventDefault();
    }
  return (
    <div style={{background:"#000", color:"#fff"}} className='container'><pre>
        <br/>
        {activity_flag? 
        <div>
            <br/><br/>
            <font color='green'>@SEC_Portal/console</font><br/>
            $ {tmp.length? 
            tmp
            
            : <>No activity log found!</>}
             
            {loading? <font size='3'><br/><br/>Connecting to server...</font> : 
            <><br/><br/><font style={{fontSize:12, color:"#fff"}}><font size='3'>{act.length} activities found!</font> {act}</font>
            </>
            }
        
        </div> : ""}
       
        {wrongText?
        <div>
            <br/><br/>
            <font color='green'>@SEC_Portal/console</font><br/>
            $ {tmp}<br/>
            <font color="red">couldn't identify '{tmp}'</font>
        </div>:""}

        {versionflag?
        <div>
            <br/><br/>
            <font color='green'>@SEC_Portal/console</font><br/>
            $ {tmp}<br/>
            <font color="white">version 2.0.1   -last update 16 Sep, 22</font>
        </div>:""}

        <form onSubmit={consoleQuery}>
        <br/><br/><font color='green'>@SEC_Portal/console</font><br/>
            $ <input value={consoleText} onChange={(e)=>setConsoleText(e.target.value)} style={{background:"#000", border:"0px", outline:"none", color:"#fff", width:"90%", paddingBottom:"180px"}}/>
        </form>
        
        
    </pre></div>
  )
}
