import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

const ResponsiveAppBar = () => {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [curPath, setCurPath] = useState("");
    useEffect(() => {
        setInterval(() => setCurPath(getPath()), 250);
    }, [])

    function getPath() {
        let path = window.location.pathname;
        let who = path.split("/");
        return who[1];
    }

    return (
        <>
            <AppBar position="static" sx={{ position: "fixed", zIndex: "100" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 5,
                                display: { xs: 'none', md: 'flex' },
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            SEC Portal
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>

                            {
                                curPath == "admin" ?
                                    localStorage.getItem("admin_logged_in") == "true" ?
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                            }}
                                        >
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/") }}>Home</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/admin/report") }}>Report</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/admin/all_employee") }}>All SEC</MenuItem>
                                            <MenuItem onClick={() => { localStorage.setItem("admin_logged_in", "false"); handleCloseNavMenu(); navigate("/admin") }}>Logout</MenuItem>
                                        </Menu>
                                        :
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                            }}
                                        >
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/") }}>Home</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/admin") }}>Login</MenuItem>
                                        </Menu>

                                    :
                                    localStorage.getItem("empID") != null ?
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                            }}
                                        >
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/") }}>Home</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/attendance") }}>My Attendance</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/change_password") }}>Change Password</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/admin") }}>Admin Panel</MenuItem>
                                        </Menu>
                                        :
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                            }}
                                        >
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/") }}>Home</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/") }}>Login</MenuItem>
                                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/admin") }}>Admin Panel</MenuItem>
                                        </Menu>
                            }

                        </Box>

                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 6, flexGrow: 1,
                                display: { xs: 'flex', md: 'none' },
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            SEC Portal
                        </Typography>
                        {
                            curPath == "admin" ?
                                localStorage.getItem("admin_logged_in") == "true" ?
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        <Button onClick={() => navigate("/")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Home</Button>
                                        <Button onClick={() => navigate("/admin/report")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Report</Button>
                                        <Button onClick={() => navigate("/admin/all_employee")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>All Sec</Button>
                                        <Button onClick={() => { localStorage.setItem("admin_logged_in", "false"); navigate("/admin") }} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>logout</Button>
                                    </Box>
                                    :
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        <Button onClick={() => navigate("/")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Home</Button>
                                        <Button onClick={() => navigate("/admin")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Login</Button>
                                    </Box>

                                :
                                localStorage.getItem("empID") != null ?
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        <Button onClick={() => navigate("/")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Home</Button>
                                        <Button onClick={() => navigate("/attendance")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>My Attendance</Button>
                                        <Button onClick={() => navigate("/change_password")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Change password</Button>
                                        <Button onClick={() => navigate("/admin")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Admin panel</Button>
                                    </Box>
                                    :
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        <Button onClick={() => navigate("/")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Home</Button>
                                        <Button onClick={() => navigate("/")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Login</Button>
                                        <Button onClick={() => navigate("/admin")} sx={{ my: 1, color: 'white', display: 'block', mr: 3 }}>Admin panel</Button>
                                    </Box>
                        }

                    </Toolbar>
                </Container>
            </AppBar>
            <br /><br /></>
    );
};
export default ResponsiveAppBar;
