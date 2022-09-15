import React from 'react'

export default function ActivityCard(props) {
    const time = props.time;
    const role = props.role;
    const activity = props.activity;
    return (
            <div style={{padding:"8px", margin:"0px"}}>
                <font color="yellow">{time}</font> <font color="#02c73a">({role})</font>
                <br/>
                <font size="2">{role} {activity}</font>
            </div>
    )
}
