import { Link, useLocation, useNavigate } from "react-router-dom"
import { MdFormatListBulleted  } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { IoPersonAdd } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import { FaClipboardList,FaChartLine,FaWhatsapp,FaSms} from "react-icons/fa";
import { FaBoxOpen,FaFile } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FcLock } from "react-icons/fc";

const Nav = () => {
  const [open,setOpen]= useState<string | null>(null);
  const navigate=useNavigate();
  const loc=useLocation();
  const [role,setRole]=useState<string | null>(null)
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate('/',)
};
useEffect(()=>{
  const token:string= sessionStorage.getItem('role') || ''
  setRole(token);
},[loc.pathname])

const toggle=(name:string)=>{
  setOpen( open === name ? null : name)
}
  return (
    <>
   {role==='doctor' && <div>
        <Link to='/home'><GoHomeFill className="icon"/>Home</Link>
        <div className="dropdown">
          <div className="dropdown-title" onClick={()=>toggle("patient")}>
            <span>Patient</span>
            {open==="patient"? <FaChevronUp className="icon"/> : <FaChevronDown className="icon"/>}
          </div>
            {
              open === 'patient' && (
                <div className="dropdown-menu">
                <Link to='/patientform'><IoPersonAdd className="icon"/>Patient Form</Link>
                <Link to='/patientList'><MdFormatListBulleted  className="icon"/>Patient List</Link>
                <Link to='/prescriptions'><FaFile  className="icon"/>Prescriptions</Link>
                </div>
              )
            }
        </div>
        <div className="dropdown">
          <div className="dropdown-title" onClick={()=>toggle("MR")}>
            <span>MR</span>
            {open==="MR" ? <FaChevronUp className="icon"/> :<FaChevronDown className="icon"/>}
          </div>
            {
              open === 'MR' && (
                <div className="dropdown-menu">
                  <Link to='/mrform'><FaClipboardList className="icon"/>MR Form</Link>
                  <Link to='/mr'><MdFormatListBulleted className="icon"/>MR List</Link>
                  <Link to='/mr-payment'><MdFormatListBulleted className="icon"/>MR Payment</Link>
                </div>
              )
            }
        </div>
        <div className="dropdown">
          <div className="dropdown-title" onClick={()=>toggle("medicine")}>
            <span>Medicine</span>
            {open==="medicine"? <FaChevronUp className="icon"/> :<FaChevronDown className="icon"/>}
          </div>
            {
              open === 'medicine' && (
                <div className="dropdown-menu">
                  <Link to='/inventory'>< FaFile className="icon"/>Medicine Form</Link>
                  <Link to='/medicine'><MdFormatListBulleted className="icon"/>Medicine List</Link>
                  <Link to='/stock'><FaBoxOpen className="icon"/>Stock</Link>
                </div>
              )
            }
        </div>
        <div className="dropdown">
          <div className="dropdown-title" onClick={()=>toggle("reminder")}>
            <span>Reminders</span>
            {open==="reminder"? <FaChevronUp className="icon"/> :<FaChevronDown className="icon"/>}
            </div>
            {
              open === 'reminder' && (
                <div className="dropdown-menu">
                  <Link to='/reminders'><IoIosNotifications className="icon"/>Patients</Link>
                  <Link to='/mr-reminders'><IoIosNotifications className="icon"/>MR payment</Link>
                </div>
              )
            }
        </div>
        <div className="dropdown">
          <div className="dropdown-title" onClick={()=>toggle("marketing")}>
            <span>Marketing <FcLock className="icon"/></span>
            {open==="marketing"? <FaChevronUp className="icon"/> :<FaChevronDown className="icon"/>}
            </div>
            {
              open === 'marketing' && (
                <div className="dropdown-menu">
                  <Link to='/sms'><FaSms  className="icon"/>SMS</Link>
                  <Link to='/whatsapp'><FaWhatsapp className="icon"/>Whatsapp</Link>
                </div>
              )
            }
        </div>
        <Link to='/sales'><FaChartLine className="icon"/>Sales Report</Link>
        <Link to='/users'><HiUsers  className="icon"/>Accounts</Link>
        <button onClick={logout} >Logout</button>
    </div>}

    {
      role != 'doctor' &&  <div>
        <Link to='/home'><IoPersonAdd className="icon"/>Home</Link>
        <Link to='/patientList'><MdFormatListBulleted  className="icon"/>Patient List</Link>
        <Link to='/reminders'><IoIosNotifications  className="icon"/>Patient Reminders</Link>
        <button onClick={logout} >Logout</button>
    </div>
    }
    </>
  )
}

export default Nav
