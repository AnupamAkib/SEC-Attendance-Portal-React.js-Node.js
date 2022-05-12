import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Report from './components/admin/Report';
import All_Employee from './components/admin/All_Employee';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/attendance' element={<Dashboard />} />
        <Route path='/admin/report' element={<Report />} />
        <Route path='/admin/all_employee' element={<ConfirmProvider><All_Employee /></ConfirmProvider>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
