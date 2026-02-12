import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const MRPayment = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [mrname, setMRName] = useState<any>("");
  const [searchDate, setSearchDate] = useState<any>();
  const [mrList, setMrList] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: any) => {
    // search by Data or mrname
    e.preventDefault();
    let formatedate = "";
    if (!mrname && !searchDate)
      return toast.warn("Please enter MR Name or Date");
    if (searchDate) {
      let [year, month, day] = searchDate.split("-");
      formatedate = `${day}/${month}/${year}`;
      console.log(formatedate);
    }
    try {
      const res = await axios.post(`${URL}/mr-payment`, {
        mrname,
        date: formatedate,
      });
      let message: string = res.data.message;
      const filterList = res.data.mrList.filter(
        (item: any) => Number(item.dueamount) > 0,
      );
      setMrList(filterList);
      // if(filterList.length > 0) { toast.success(message)} else {toast.warn('MR Not found with dueAmount')}
      toast.info(message);
    } catch (error) {
      toast.error("MR not Found try again");
      console.log(error);
    } finally {
      setSearchDate("");
    }
  };

  const fetchMRList = async () => {
    try {
      const res = await axios.post(`${URL}/mr-payment`, { mrname });
      const filterList = res.data.mrList.filter(
        (item: any) => Number(item.dueamount) > 0,
      );
      setMrList(filterList);
      setAmount(0);
    } catch (error) {
      toast.error("MR not Found");
      console.log(error);
    } finally {
    }
  };

  const UpdateDuaAmount = async (e: any, item: any) => {
    e.preventDefault();
    let paidAmountNow = Number(amount);
    const totalPaid = Number(item.paidamount) + paidAmountNow;
    const newDue = Number(item.totalamount) - totalPaid;
    try {
      await axios.patch(`${URL}/mr-payment`, {
        _id: item._id,
        paidamount: totalPaid,
        dueamount: newDue,
      });
      toast.success("Payment Updated!");
      fetchMRList();
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="mr-payment">
      <h1>Update MR</h1>
      <form onSubmit={handleSubmit}>
          <div className="inputfield">
            <input
              type="text"
              placeholder=""
              value={mrname}
              onChange={(e: any) => setMRName(e.target.value)}
            />
            <label htmlFor="">MR Name</label>
          </div>
        
          <div className="inputfield">
            <input
              type="date"
              placeholder=""
              value={searchDate}
              onChange={(e: any) => setSearchDate(e.target.value)}
            />
            <label htmlFor="">Date</label>
          </div>
        
        <div className="btn-group">
          <button type="submit">Submit</button>
          <button
            type="reset"
            onClick={() => {
              setSearchDate("");
              setMRName("");
              setMrList([]);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mrlist">
        {mrList.length > 0 && (
          <>
            {mrList.map((item: any, index: number) => (
              <form
                key={index}
                className="card"
                onSubmit={(e: any) => UpdateDuaAmount(e, item)}
              >
                <p>
                  <b>Date:</b> {item.date}
                </p>
                <p>
                  <b>Company Name:</b> {item.companyname}
                </p>
                <p>
                  <b>MR Name:</b> {item.mrname}
                </p>
                <p className="green">Total Amount ₹:{item.totalamount}</p>
                <p className="red">Due Amount ₹:{item.dueamount}</p>
                <input
                  type="number"
                  max={item.dueamount}
                  placeholder="Paid Amount"
                  value={amount}
                  onChange={(e: any) => setAmount(e.target.value)}
                />
                <button type="submit">Pay</button>
              </form>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MRPayment;
