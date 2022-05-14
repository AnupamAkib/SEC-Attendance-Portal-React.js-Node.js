import React from 'react'

export default function ChangePassword() {
    let t = require('./toast_bar.js')
    return (
        <div>
            Under Construction<br />
            <button onClick={() => t.msg("hello", "green", 4000)}>test btn</button>
        </div>
    )
}
