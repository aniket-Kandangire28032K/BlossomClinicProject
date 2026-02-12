import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NameChecker from "../components/NameChecker";

const Patientform = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const initialState={
    name: "",
    history: "",
    reference:"",
    gender: "",
    DOB: "",
    age: 0,
    bloodgroup: "",
    materialstatus: "",
    contact: "",
    email: "",
    address: "",
  }
  const [formData, setFormData] = useState(initialState);
  const [today,setDate]=useState<string>('');
  const [opd,setOpdNo]=useState<string>('');
  
   const calculateAge = (dob:any):number=>{
    if(!dob) return 0;
    const birthDate = new Date(dob);
    const year = new Date().getFullYear();
    let age = year - birthDate.getFullYear();
    if (age <0 ) return 0;
    return age;
  }
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if(name === 'name'){
      // For Name
      const formatted = value.toLowerCase().replace(/\n\w/g, (char:string) => char.toUpperCase());
      setFormData({
        ...formData,
        [name]:formatted
      })
      return;
    }
    if(name === 'contact'){
      // for Conatct
      const cleand = value.replace(/\D/g, "").slice(0, 12);
      setFormData({
        ...formData,
        contact:cleand,
      })
      return;
    }
    if(name === "DOB"){
      const dob = value;
      setFormData({
        ...formData,
        DOB:value,
        age:calculateAge(dob)   
      })
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
      
    });
  };
  const getCount = async () => {
    const res = await axios.get(`${URL}/patient-count`);
    // console.log(res.data)
    let count = String(res.data.count+1).padStart(3,"0")
    // console.log(count)
    let day = new Date().toLocaleDateString("en-gb").split("/").reverse().join("");
    setOpdNo(`${day}${count}`)
  }
  useEffect(()=>{
    const d=new Date;
    const day = String(d.getDate()).padStart(2,"0");
    const month = String(d.getMonth() + 1).padStart(2,"0");
    const year = d.getFullYear();
    const today = `${day}/${month}/${year}`;
    setDate(today)
    getCount();
  },[])
  const handleReset = ()=>{
    setFormData(initialState)
  }
 
  const handleSubmit=async (e:any) => {
    console.log(opd)
    e.preventDefault();
    const postData={
      ...formData,
      date:today,
      opdno:opd
    };
    try {
      await axios.post(`${URL}/patient/`,postData)
      toast.success(`${formData.name}'s Data Added`)
    } catch (error) {
      console.log(error)
      toast.error(`Server Internal Error`)
    }finally{
      setTimeout(getCount,1000);
      setFormData(initialState);
    }
  }
  return (
    <div className="patientform">
      <p>Date: {today}</p>
     <NameChecker/>
      <form onSubmit={handleSubmit} autoComplete="off">
        <h3>OPD No:{opd}</h3>
        <input
          type="text"
          name="name"
          required value={formData.name}
          placeholder="Patient's Full name*"
          onChange={handleChange}
        />
        <input
          type="text" required
          name="history" value={formData.history}
          placeholder="History*"
          onChange={handleChange}
        />
        <input
          type="text" required
          name="reference" value={formData.reference}
          placeholder="Reference"
          onChange={handleChange}
        />
        <select
          name="gender" 
          id="gender" required
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Gender*</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">other</option>
        </select>
        <div className="DOB">
          <label htmlFor="DOB">Date of Birth:</label>
          <input
            type="date"
            name="DOB" id="ODB"  value={formData.DOB}
            placeholder="Date of Birth"
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
        <input
          type="number"
          name="age"  value={formData.age}
          placeholder="Age*" 
          readOnly
        />
        <select
          value={formData.bloodgroup}
          name="bloodgroup"
          // placeholder="Blood Group"
          onChange={handleChange}
        >
          <option value="" disabled>Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <select
          name="materialstatus" 
          
          value={formData.materialstatus}
          onChange={handleChange}
        >
          <option value="" disabled>Marital Status*</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
        </select>
        <input
          type="tel"
          name="contact"
          required 
          value={formData.contact}
          placeholder="Phone No.*"
          maxLength={10}
          inputMode="numeric"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email" value={formData.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="text"
          name="address" value={formData.address}
          placeholder="Address"
          onChange={handleChange}
        />
        <div className="btngrp">
          <button type="submit">Submit</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default Patientform;
