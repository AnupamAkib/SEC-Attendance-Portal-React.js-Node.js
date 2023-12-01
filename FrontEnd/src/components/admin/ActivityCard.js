import React from 'react'

export default function ActivityCard(props) {
    const time = props.time;
    const role = props.role;
    const activity = props.activity;
    return (
            <div style={{padding:"8px", margin:"8px", background:"#f0f0f0"}}>

                ({role}) <b>{activity}</b><br/>
                <font size="2">
                    Date & Time: {time}
                    
                </font>
            </div>
    )
}
