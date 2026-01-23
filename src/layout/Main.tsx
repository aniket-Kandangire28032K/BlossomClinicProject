import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Login = lazy(()=>import("../pages/Login"))
const Dashboard = lazy(()=> import('../pages/Dashboard.tsx'))
const Patientform = lazy(()=> import('../pages/Patientform.tsx'))
const ErrorPage = lazy(()=> import('../pages/ErrorPage'))
const Inventory = lazy(()=> import('../pages/Inventory.tsx'))
const Access = lazy(()=> import('../pages/Access.tsx'))
const MRlist = lazy(()=> import('../pages/MRlist.tsx'))
const PatientList = lazy(()=> import('../pages/PatientList.tsx'))
const MedsList = lazy(()=> import('../pages/MedsList.tsx'))
const MrForm = lazy(()=> import("../pages/MrForm.tsx"))
const StockUpdate = lazy(()=> import('../pages/StockUpdate.tsx'))
const Sales = lazy(()=> import('../pages/Sales.tsx'))
const Reminders = lazy(()=> import('../pages/Reminders.tsx'))
const Mrreminders = lazy(()=> import('../pages/MRreminders.tsx'))
const MrPayment = lazy(()=> import('../pages/MRPayment.tsx'))
const Prescription = lazy(()=> import('../pages/PrescriptionPage.tsx'))
const Disabled = lazy(()=>import('../pages/LockFeatures.tsx'))
import Loader from "./Loader";

const Main = () => {
  const [loading,setLoading]=useState(false);
  const loc=useLocation();
  const [jobRole, setRole] = useState(() => sessionStorage.getItem("role") || 'recep');
  
  useEffect(() => {
    setLoading(true)
    // setRole('rep')
    const Role:any = sessionStorage.getItem("role");
    setRole(Role);
    setLoading(false)
  }, [loc.pathname]);
  
  // if (jobRole == null) return <Login/>;
  if(loading) return <Loader/>
  
  return (
    <>
      <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/home' element={jobRole === 'doctor' ? <Dashboard/> : <Navigate to='/patientform'/> }/>
            <Route path='/inventory' element={ jobRole == 'doctor' ? <Inventory/> : <Navigate to='/patientform'/>}/>
            <Route path='/mr' element={ jobRole == 'doctor' ? <MRlist/> : <Navigate to='/patientform'/> }/>
            <Route path='/mrform' element={ jobRole == 'doctor' ? <MrForm/> : <Navigate to='/patientform'/>}/>
            <Route path='/mr-payment' element={ jobRole == 'doctor' ? <MrPayment/> : <Navigate to='/patientform'/>}/>
            <Route path='/medicine' element={ jobRole == 'doctor' ? <MedsList/> : <Navigate to='/patientform'/>}/>
            <Route path='/users' element={ jobRole == 'doctor' ? <Access/> : <Navigate to='/patientform'/> }/>
            <Route path='/stock' element={ jobRole == 'doctor' ? <StockUpdate/> : <Navigate to='/patientform'/>}/>
            <Route path='/sales' element={ jobRole == 'doctor' ? <Sales/> : <Navigate to='/patientform'/>}/>
            <Route path='/prescriptions' element={ jobRole == 'doctor' ? <Prescription/> : <Navigate to='/patientform'/>}/>
            <Route path='/sms' element={ jobRole == 'doctor' ? <Disabled/> : <Navigate to='/patientform'/>}/>
            <Route path='/whatsapp' element={ jobRole == 'doctor' ? <Disabled/> : <Navigate to='/patientform'/>}/>
            <Route path='/reminders' element={<Reminders/>}/>
            <Route path='/mr-reminders' element={<Mrreminders/>}/>
            <Route path='/patientform' element={<Patientform/>}/>
            <Route path='/patientlist' element={<PatientList/>}/>
            
            <Route path='*' element={<ErrorPage/>} />
            <Route path='/load' element={<Loader/>} />
        </Routes>
    </>
  );
};

export default Main;
