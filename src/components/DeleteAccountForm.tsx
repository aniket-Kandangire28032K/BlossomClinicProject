import axios from "axios";
import { useState } from "react"
import { toast } from "react-toastify";

const DeleteAccountForm = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [email,setEmail]=useState('');
  const handleFormSubmit = async (e:any) => {
    e.preventDefault();
    if(!email){
      toast.warning('Please Enter Email');
      return;}
    try {
      // const res=await axios.delete(`http://localhost:3000/api/user/${email}`);
      await axios.delete(`${URL}/user/${email}`);
      toast.success(`${email}'s Account Deleted`)
    } catch (error) {
      toast.error('Internal Server Error')
    }finally{
      setEmail('')
    }
  }
  return (
    <form onSubmit={handleFormSubmit} className="del-acc-form">
    <p>Delete Account</p>
    <input type="email" placeholder="Enter Email" onChange={e=> setEmail(e.target.value)}/>
    <div>
    <button type="submit">Delete</button>
    <button type="reset">Clear</button>
    </div>
    </form>
  )
}

export default DeleteAccountForm