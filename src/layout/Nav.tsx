import { Link, useLocation, useNavigate } from "react-router-dom"
import { MdFormatListBulleted  } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { IoPersonAdd,IoPersonCircleSharp } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import { FaClipboardList,FaChartLine,FaWhatsapp,FaSms,FaFileMedicalAlt} from "react-icons/fa";
import { FaBoxOpen,FaFile } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FcLock } from "react-icons/fc";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { CiInboxIn } from "react-icons/ci";

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
            <span><FaFileMedicalAlt className="icon"/>Patient{open==="patient"? <FaChevronUp className="icon arrow"/> : <FaChevronDown className="icon arrow"/>} </span>
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
            <span><IoPersonCircleSharp className="icon"/>MR{open==="MR" ? <FaChevronUp className="icon arrow"/> :<FaChevronDown className="icon arrow"/>} </span>
            
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
            <span><CiInboxIn className="icon"/>Inventory{open==="medicine"? <FaChevronUp className="icon arrow"/> :<FaChevronDown className="icon arrow"/>}</span>
            
          </div>
            {
              open === 'medicine' && (
                <div className="dropdown-menu">
                  {/* <Link to='/inventory'>< FaFile className="icon"/>Medicine Form</Link> */}
                  <Link to='/medicine'><MdFormatListBulleted className="icon"/>Products</Link>
                  <Link to='/stock'><FaBoxOpen className="icon"/>Stock Update</Link>
                </div>
              )
            }
        </div>
        <div className="dropdown">
          <div className="dropdown-title" onClick={()=>toggle("reminder")}>
            <span><IoIosNotifications className="icon"/>Reminders{open==="reminder"? <FaChevronUp className="icon arrow"/> :<FaChevronDown className="icon arrow"/>}</span>
            
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
            <span><FcLock className="icon"/>Marketing{open==="marketing"? <FaChevronUp className="icon arrow"/> :<FaChevronDown className="icon arrow"/>}</span>
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
        <Link to="/other_expenses"><FaMoneyBillTrendUp className="icon"/>Other Expenses</Link>
        <Link to='/sales'><FaChartLine className="icon"/>Sales Report</Link>
        <Link to='/users'><HiUsers  className="icon"/>Accounts</Link>
        <Link to='/staff'><HiUsers  className="icon"/>Staff</Link>
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
