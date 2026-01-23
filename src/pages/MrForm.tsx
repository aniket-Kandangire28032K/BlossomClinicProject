import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MrForm = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [today,setToday]= useState<string>('')
  useEffect(()=>{
      const day=new Date;
      setToday(`${day.getDate()}/${day.getMonth()+ 1}/${day.getFullYear()}`)
    },[])
  const [formData, setFormData] = useState<any>({
    companyname: "",
    mrname: "",
    contact: "",
    email: "",
    productlist: "",
    paidamount: 0,
    dueamount: 0,
    totalamount: 0,
    invoiceno:""
  });
  const reset = () => {
    setFormData({
      companyname: " ",
      mrname: " ",
      contact: " ",
      email: " ",
      productlist: " ",
      paidamount: " ",
      dueamount: " ",
      totalamount: " ",
      invoiceno:" "
    });
  };
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  const calDue = () => {
    setFormData({
      ...formData,
      dueamount: Number(formData.totalamount) - Number(formData.paidamount),
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const postData ={
      ...formData,
      date:today
    }
    try {
      await axios.post(`${URL}/mr`,postData);
      toast.success('MR added Successfully')
    } catch (error) {
      console.log(error);
      toast.warn('Internal Server Error')
    }
  };
  return (
    <div className="mr-form">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h1>MR Form</h1>
        <div className="inputfield">
          <h3>Date: {today}</h3>
        </div>
        <div className="inputfield">
          
          <input
            type="text"
            placeholder=" "
            id="companyname"
            onChange={handleChange}
          />
          <label htmlFor="name">Company Name</label>
        </div>

        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="mrname"
            onChange={handleChange}
          />
          <label htmlFor="mrname">MR Name</label>
        </div>

        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="contact"
            onChange={handleChange}
          />
          <label htmlFor="contact">Contact No.</label>
        </div>

        <div className="inputfield">
          <input
            type="email"
            placeholder=""
            id="email"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="productlist"
            onChange={handleChange}
          />
          <label htmlFor="productlist">Product List</label>
        </div>
        <div className="inputfield">
          <input
            type="number"
            placeholder=""
            id="totalamount"
            onChange={handleChange}
          />
          <label htmlFor="totalamount">total Amount</label>
        </div>
        <div className="inputfield">
          <input
            type="number"
            placeholder=""
            id="paidamount"
            onChange={handleChange}
            max={formData.totalamount}
          />
          <label htmlFor="paid">Paid Amount</label>
        </div>
        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="invoiceno"
            onChange={handleChange}
            pattern="[A-Z0-9]+"
            maxLength={15}
            value={formData.invoiceno}
          />
          <label htmlFor="paid">Invoice No.</label>
        </div>

        <div className="inputfield">
          <input
            type="number"
            placeholder=""
            id="dueamount"
            readOnly
            min={0}
            value={formData.dueamount}
            onClick={calDue}
          />
          <label htmlFor="due">due Amount</label>
        </div>
      
        <div className="btn-grp">
          <button type="submit">Sumbit</button>
          <button type="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default MrForm;
