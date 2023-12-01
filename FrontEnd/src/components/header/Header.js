import React, { useState } from "react";
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import DrawerComp from "./Drawer";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
    const [role, setRole] = useState("");
    useEffect(() => {
      let path = location.pathname;
      path = path.split("/");
      if(path[1]=="admin"){
        setRole("admin");
      }
      else{
        setRole("sec");
      }
      //console.log(role)
    }, [location.pathname])

  const [value, setValue] = useState();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const methods = require('.././methods.js');




  // EDIT HERE IF PAGES NEED TO ADD

    const pages = [];

    
    if(role=="sec"){
        if(localStorage.getItem("empID")){
            pages.push({ text:"Home", href:"/", icon:"fa fa-home" })
            pages.push({ text:"My Attendance", href:"/attendance", icon:"fa fa-calendar" })
            pages.push({ text:"Attendance History", href:"/attendance_history", icon:"fa fa-history" })
            pages.push({ text:"Change Password", href:"/change_password", icon:"fa fa-key" })
            pages.push({ text:"Admin Login", href:"/admin", icon:"fa fa-user-circle" })
            pages.push({ text:"LOGOUT", href:"/logout_sec", icon:"fa fa-sign-out" })
        }
        else{
            pages.push({ text:"Home", href:"/", icon:"fa fa-home" })
            pages.push({ text:"Admin Login", href:"/admin", icon:"fa fa-user-circle" })
        }
    }
    else if(role=="admin"){
        if(localStorage.getItem("admin_logged_in")){
            pages.push({ text:"SEC Home", href:"/", icon:"fa fa-home" })
            pages.push({ text:"Attendance Report", href:"/admin/report", icon:"fa fa-calendar" })
            pages.push({ text:"Manage SEC", href:"/admin/all_employee", icon:"fa fa-user-circle-o" })
            pages.push({ text:"Activity Logs", href:"/admin/view_activity_logs", icon:"fa fa-history" })
            pages.push({ text:"LOGOUT", href:"/logout_admin", icon:"fa fa-sign-out" })
        }
        else{
            pages.push({ text:"Home", href:"/", icon:"fa fa-home" })
            pages.push({ text:"Login", href:"/admin", icon:"fa fa-sign-in" })
        }
    }



  return (
    <React.Fragment>
      <AppBar sx={{ background: "#0052a3" }}  style={{zIndex:"11555"}}>
        <Toolbar style={{padding:"10px 8px 8px 8px"}}>
          <font size='5' style={{marginLeft:"10px"}}>SEC PORTAL</font>
          
          {isMatch ? (
            <>
              <DrawerComp data = {pages}/>
            </>
          ) : (
            <>
              <Tabs
                sx={{ marginLeft: "auto" }}
                indicatorColor="secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                {pages.map((page, index) => (
                <Tab label={page.text} onClick={()=>navigate(page.href)} />
                ))}
                

              </Tabs>


            </>
          )}
        </Toolbar>
      </AppBar><br/><br/><br/>
    </React.Fragment>
  );
};

export default Header;