import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MuiHeader from './components/MuiHeader';
import Report from './components/admin/Report';
import All_Employee from './components/admin/All_Employee';
import ChangeLocation from './components/admin/ChangeLocation';
import AdminLogin from './components/admin/Login';
import Activity from './components/admin/Activity';
import ChangePassword from './components/ChangePassword';
import Footer from './components/Footer';
import Header from './components/header/Header';
import Logout_sec from './components/Logout_sec';
import Logout_admin from './components/Logout_admin';
import AttendanceHistory from './components/AttendanceHistory';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/logout_sec' element={<Logout_sec />} />
        <Route path='/logout_admin' element={<Logout_admin />} />
        <Route path='/attendance' element={<ConfirmProvider><Dashboard /></ConfirmProvider>} />
        <Route path='/change_password' element={<ChangePassword />} />
        <Route path='/attendance_history' element={<AttendanceHistory />} />
        
        <Route path='/admin/report' element={<Report />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/showroom_location' element={<ChangeLocation />} />
        <Route path='/admin/view_activity_logs' element={<Activity />} />
        <Route path='/admin/all_employee' element={<ConfirmProvider><All_Employee /></ConfirmProvider>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
