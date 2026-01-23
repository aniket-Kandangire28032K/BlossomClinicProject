import axios from "axios";
import { useState, useEffect } from "react";

const MRreminders = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [MRList, setMRList] = useState([]);
  useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get(`${URL}/mrlist`);
        
        const filteredList = res.data.filter((e: any) => e.dueamount > 0);
        setMRList(filteredList);
      } catch (error) {
        console.log(error);
      }
    };
    getList();
  }, []);
  return (
    <div className="mr-reminders">
      <h1>MR Payment Reminders</h1>
      <div className="card-grid">
        {MRList.map((e: any, index) => (
          <div key={index} className="reminder-card">
            <p>MR Name: <strong>{e.mrname}</strong></p>
            <p>Company Name: <strong>{e.companyname}</strong></p>
            <span>Due Amount: ₹ {e.dueamount}/-</span>
            <span>Paid Amount: ₹ {e.paidamount}/-</span>
            <p>Total Amount: ₹ {e.totalamount}/-</p>
            <p><strong>Date:</strong>{e.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MRreminders;
