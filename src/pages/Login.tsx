import axios from "axios";
import {  useState } from "react"
import { useNavigate,Link } from "react-router-dom"
import { toast } from "react-toastify";

const Login = () => {
  
  const navigate=useNavigate();
  const URL = import.meta.env.VITE_Backend_URL;
  const [formData,setFormData]=useState({
    name:'',
    password:''
  })
  const handleChange=(e:any)=>{
    const {name,value}=e.target;
    setFormData({
      ...formData,
      [name]:value
  })
  }
  const handleLogin= async(e:any)=>{
    e.preventDefault();
    try {
      const res=await axios.post(`${URL}/user`,formData)
      // toast.success(res.data.message)
      if(res.data.success){
        sessionStorage.setItem('token',res.data.token);
        sessionStorage.setItem('role',res.data.role);
        navigate('/home');
        
      }
      else{
        toast.info(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.warning('Insternal Server Error')
    }
  }
  return (
    <div className="login">
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="inputfield">
                <input type="text" placeholder=" " id="username" name="name" onChange={handleChange} required/>
                <label htmlFor="username">Username</label>
            </div>
            <div className="inputfield">
                <input type="password" autoComplete="off" placeholder=" " id="password" name="password" onChange={handleChange} required/>
                <label htmlFor="password">Password</label>
            </div>
            <Link to='/new-password'>Forgot Password?</Link>
            <button type="submit">Login</button>
            {/* <p><strong>Create an Account</strong></p> */}
        </form>
    </div>
  )
}

export default Login