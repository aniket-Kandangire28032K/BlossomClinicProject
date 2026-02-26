import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoMdCloseCircle } from "react-icons/io";

const MRreminders = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [MRList, setMRList] = useState([]);
  const [display,setDisplay] = useState(false);
  const [date,setDate] = useState("")
  const [object,setObject] = useState<any>({})
  
  const displayoption=(item:any)=>{
    setDisplay(!display)
    setObject({...item})
  }
  const Reschedule =async(e:any) =>{
    e.preventDefault();
    try {
      let nextpaydate = date.split("-").reverse().join("/");
      await axios.patch(`${URL}/mrlist/${object._id}`,{date:nextpaydate})
      toast.success("Payment Rescheduled")
    } catch (error) {
      console.log(error);
      toast.warn("Internal Server Error")
    }finally{
      getList();
      setDisplay(!display)
      setDate("")
    }
  }

  const getList = async () => {
    // Get Payments
    try {
      const res = await axios.get(`${URL}/mrlist`);        
      const filteredList = res.data.filter((e: any) => e.dueamount > 0);
      setMRList(filteredList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="mr-reminders">
      <h1>MR Payment Reminders</h1>
      <div className="card-grid">
        {MRList.map((item: any, index) => (
          <div key={index} className="reminder-card">
            <p>Date:<strong> {item.date}</strong></p>
            <p>MR Name: <strong>{item.mrname}</strong></p>
            <p>Company Name: <strong>{item.companyname}</strong></p>
            <p>Next Payment Date:<strong> {item.nextpaydate}</strong></p>
            <p className="due">Due Amount: ₹{item.dueamount}/-</p>
            <p className="paid">Paid Amount: ₹{item.paidamount}/-</p>
            <p className="total">Total Amount: ₹{item.totalamount}/-</p>
            <button type="button" onClick={()=>displayoption(item)}>Re-schedule</button>
          </div>
        ))}
      </div>
      {display &&  <form onSubmit={Reschedule} className="reschedule-form">
        <h3>Next Payment Date</h3>
        {object.mrname && <p>Name: {object?.mrname}</p>}
        {object.nextpaydate && <p>Next Payment Date: {object?.nextpaydate}</p>}
        <input type="date" value={date} onChange={(e)=> setDate(e.target.value)}/>
        <button type="submit">Submit</button><button type="reset" onClick={()=>setDate("")}>reset</button>
        <button className="close" type="button" onClick={()=>setDisplay(!display)}><IoMdCloseCircle/></button>
      </form>}
    </div>
  );
};

export default MRreminders;
