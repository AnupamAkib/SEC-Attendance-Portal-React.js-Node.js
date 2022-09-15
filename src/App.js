import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import MuiHeader from './components/MuiHeader';
import Report from './components/admin/Report';
import All_Employee from './components/admin/All_Employee';
import ChangeLocation from './components/admin/ChangeLocation';
import AdminLogin from './components/admin/Login';
import Activity from './components/admin/Activity';
import ChangePassword from './components/ChangePassword';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <MuiHeader />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/attendance' element={<ConfirmProvider><Dashboard /></ConfirmProvider>} />
        <Route path='/change_password' element={<ChangePassword />} />
        <Route path='/admin/report' element={<Report />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/showroom_location' element={<ChangeLocation />} />
        <Route path='/admin/console' element={<Activity />} />
        <Route path='/admin/all_employee' element={<ConfirmProvider><All_Employee /></ConfirmProvider>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
