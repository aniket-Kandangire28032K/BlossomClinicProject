import axios from "axios"
import { useState,useEffect } from "react"
import { toast } from "react-toastify";
import { IoMdTrash } from "react-icons/io";

const staff = () => {
    const URL:string = import.meta.env.VITE_Backend_URL;
    const [staffList,setStaffList] = useState([]);
    const [staffData,setStaffData] = useState({
        fullname:"",
        dob:"",
        gender:"",
        contact:"",
        email:"",
        address:""
    })
    const handleChange=(e:any)=>{
        // ! handle changes of data states
        const {name,value} = e.target
        if (name === "contact") {
      // for Conatct
      const cleand = value.replace(/\D/g, "").slice(0, 12);
      setStaffData({
        ...staffData,
        contact: cleand,
      });
      return;
    }
        setStaffData({
            ...staffData,
            [name]:value
        })
    }

    const handleSubmit =async (e:React.FormEvent<HTMLFormElement>) =>{
        // ! Submit Form Data
        e.preventDefault();
        let postData = {
            ...staffData,
            dob:staffData.dob.split("-").reverse().join("/")
        }
        try {
            const res = await axios.post(`${URL}/staff`,postData);
            console.log(res.data)
            toast.success('Staff Added Successfuly')
        } catch (error) {
            console.log(error)
            toast.warn('Internal Server Error')
        }finally{
          getStaffdetails();  
        }

    }
    const getStaffdetails = async () => {
        try {
            const res = await axios.get(`${URL}/staff`)
            setStaffList(res.data.staff)
            // toast.success("success " + res.data.message )
        } catch (error) {
            console.log(error)
            toast.warn('Internal server Error')
        }
    }
    useEffect(()=>{
        getStaffdetails()
    },[])

    const deleteStaff=async(_id:string)=>{
        console.log(_id)
        try {
            await axios.delete(`${URL}/staff/${_id}`);
            toast.success('Staff Deleted From DB')
        } catch (error) {
            console.log(error)
            toast.warn("Internal Server Error")
        }finally{
             try {
            const res = await axios.get(`${URL}/staff`)
            setStaffList(res.data.staff)
            // toast.success("success " + res.data.message )
        } catch (error) {
            console.log(error)
            toast.warn('Internal server Error')
        }
        }
    }
  return (
    <div className="staff">
        <h1>Staff Details</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter Full Name" name="fullname" value={staffData.fullname} onChange={handleChange}/>
            <div>
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={staffData.dob} onChange={handleChange}/>
            </div>
            <select name="gender" id="" value={staffData.gender} onChange={handleChange} required>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <input type="tel" placeholder="Contact No." name="contact" value={staffData.contact} onChange={handleChange}  required
            maxLength={10}
            inputMode="numeric"/>
            <input type="email" name="email" placeholder="Email" value={staffData.email} onChange={handleChange}/>
            <textarea name="address" placeholder="Current Address" value={staffData.address} onChange={handleChange}></textarea>
            <button type="submit">Submit</button>
        </form>
        {staffList.length > 0 && <table border={1}>
            <thead>
                <tr>
                    <th colSpan={6}>Staff Details</th>
                </tr>
                <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th colSpan={2}>Address</th>
                    
                </tr>
            </thead>
            <tbody>
                {
                    staffList.map((item:any,num:number)=>(
                        <tr key={item._id}>
                            <td>{num+1}</td>
                            <td>{item.fullname}</td>
                            <td>{item.contact}</td>
                            <td>{item.email || "NA"}</td>
                            <td>{item.address}</td>
                            <td><button type="button" onClick={()=> deleteStaff(item._id)}><IoMdTrash/></button> </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>}
    </div>
  )
}

export default staff