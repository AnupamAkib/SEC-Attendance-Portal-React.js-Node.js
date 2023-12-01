import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom'

const DrawerComp = (props) => {
    const methods = require("../methods")
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
    


    const [openDrawer, setOpenDrawer] = useState(false);

    const pages = props.data;

    return (
      <React.Fragment>
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
            <br/><br/><br/>
          <div style={{padding:"10px"}}>
            <h4>PRAGATI SARANI<br/>SEC ATTENDANCE<br/>SYSTEM</h4>
            Hello, <b>{role.toUpperCase()} </b>
          </div>
          
          <List sx={{width:"220px"}} onClick={()=>setOpenDrawer(false)}>
            {pages.map((page, index) => (
              <ListItemButton key={index} onClick={()=>navigate(page.href)}>
                <ListItemIcon>
                  <ListItemText><i className={page.icon} style={{marginRight:"8px"}}></i>{page.text}</ListItemText>
                </ListItemIcon>
              </ListItemButton>
            ))}
            
          </List>

        </Drawer>
        <IconButton
          sx={{ color: "white", marginLeft: "auto" }}
          onClick={() => setOpenDrawer(!openDrawer)}
        >
          <MenuIcon color="white" />
        </IconButton>
      </React.Fragment>
    );
};

export default DrawerComp;