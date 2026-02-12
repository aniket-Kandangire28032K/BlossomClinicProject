import { useState } from "react"
import { TbEye,TbEyeClosed } from "react-icons/tb";
import { FaCircleUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewPassword = () => {
    const URL = import.meta.env.VITE_Backend_URL
   const navi = useNavigate(); 
  const [userData,SetUserData] = useState({
    email:"",
    newpassword:"",
    confirmpassword:""
  })
  const [passvisible,setPassvisible] = useState(false)
  const handleChange = (e:any)=>{
    const {name,value } = e.target;
    SetUserData({
        ...userData,
        [name]:value
    })
  }
  const handleSubmit =async (e:any)=>{
    e.preventDefault();
    if(!userData.newpassword || !userData.confirmpassword){
        alert("Password fields connot be empty");
        return;
    }
    if(userData.newpassword !== userData.confirmpassword){
        alert("Both Password do not Match");
        return;
    }
    const postData = {
        email:userData.email,
        newpassword:userData.newpassword
    }
    try {
        // console.log(postData)
        const res = await axios.patch(`${URL}/user-update`,postData);
        console.log(res.data)
        toast.success('Password Update successfuly')
        navi("/")
    } catch (error) {
        console.log(error)
        toast.error('Internal Server Error')
    }
  }
    return (
    <div className="new-password-page">
        <h1>Create New Password</h1>
        <form onSubmit={handleSubmit}>
            <span><FaCircleUser size={150} /></span>
            <label>Enter Your Email</label>
            <input type="email" name="email" value={userData.email}  onChange={handleChange}/>
            <label>New Password</label>
            <input type={passvisible ? "text" : "password"} name="newpassword" value={userData.newpassword} onChange={handleChange}/>
            <label>Confirm Password</label>
            <input type={passvisible ? "text" : "password"} name="confirmpassword" value={userData.confirmpassword} onChange={handleChange}/>
            <button type="button" className="eye-btn" onClick={()=> setPassvisible(!passvisible)}>{passvisible ? <TbEye size={30}/> : <TbEyeClosed size={30}/>}</button>
            <button type="submit">Change Password</button>
        </form>
    </div>
  )
}

export default NewPassword