import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MRPayment = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [mrname, setMRName] = useState<any>("");
  const [searchDate, setSearchDate] = useState<any>();
  const [mrList, setMrList] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [nextpaydate, setNextpaydate] = useState("");
  const today = new Date()
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");
  const [display, setDisplay] = useState("");
  const [details, setDetails] = useState({
    companyname: "",
    contact: "",
    date: "0",
    dueamount: 0,
    email: "",
    invoiceno:"",
    mrname: "",
    nextpaydate: "",
    paidamount: 0,
    productlist:[] ,
    totalamount: 0,
    _id:""
    });
  const handleSubmit = async (e: any) => {
    // search by Date or mrname
    e.preventDefault();
    let formatedate = "";
    if (!mrname && !searchDate)
      return toast.warn("Please enter MR Name or Date");
    if (searchDate) {
      let [year, month, day] = searchDate.split("-");
      formatedate = `${day}/${month}/${year}`;
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
    }
  };

  const UpdateDuaAmount = async (e:any) => {
    e.preventDefault();
    let paidAmountNow = Number(amount);
    const totalPaid = Number(details.paidamount) + paidAmountNow;
    const newDue = Number(details.totalamount) - totalPaid;
    try {
      await axios.patch(`${URL}/mr-payment`, {
        _id: details._id,
        paidamount: totalPaid,
        dueamount: newDue,
        lastpaymentdate: today,
        lastpayment: amount,
        nextpaydate: nextpaydate,
      });
      toast.success("Payment Updated!");
      fetchMRList();
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    } finally {
      setNextpaydate("");
      setAmount(0);
      fetchMRList();
    }
  };
  const getMRList = async () => {
    try {
      const res = await axios.get(`${URL}/mrlist`);
      let list = res.data.filter((item:any)=> item.dueamount !== 0)
      setMrList(list);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMRList();
  }, []);
  const payMr = async (item: any) => {
    console.log(item)
    setDetails({ ...item });
    setDisplay("update");
  };
  const closefuntion = () =>{
    setDisplay("")
    setAmount(0)
    setNextpaydate("")
  }
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
              <div
                key={index}
                className="card"
                // onSubmit={(e: any) => UpdateDuaAmount(e)}
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
                <p>Last Payment Date:{item.lastpaymentdate || "NA"} </p>
                <p>Last Payment :₹{item.lastpayment || "NA"} </p>
                <p className="green">Total Amount ₹:{item.totalamount}</p>
                <p className="red">Due Amount ₹:{item.dueamount}</p>
                {display=== "" && <button type="button" className="history" onClick={()=> setDisplay(String(index))}>History</button>}
                { display === String(index) && <div>
                  <button type="button" className="close-btn" onClick={()=>setDisplay("")}>X</button>
                  {item.paymentHistory ? item.paymentHistory.map((data:any)=>
                  <div>
                    <p><strong>Date: </strong>{data.paymentDate} - <strong>Rs.</strong>{data.paymentAmount}</p>
                  </div>
                  ) : <p>No History of Payment</p> }
                </div>
                }
                
                <button type="button" onClick={()=>payMr(item)}>Pay</button>
                
              </div>
            ))}
          </>
        )}
        {mrList.length === 0 && <h1>No Data Found</h1>}
      </div>
      {display == "update" && (
        <div className="popup">
        <form  onSubmit={UpdateDuaAmount}>
          <h2>Update MR Amounts</h2>
          <div>
          <p><strong>Date: </strong>{details.date}</p>
          <p><strong>Company: </strong>{details.companyname}</p>
          <p><strong>MR: </strong>{details.mrname}</p>
          <p><strong>Due Amount: ₹ </strong>{details.dueamount}</p>
          <p><strong>Paid Amount: ₹ </strong>{details.paidamount}</p>
          <p><strong>Total Amount: ₹ </strong>{details.totalamount}</p>
          </div>
          <div>
          <label htmlFor="">Payment Amount</label>
          <input
            type="number"
            placeholder="Paid Amount" required
            value={amount === 0 ? "" : amount}
            max={details.dueamount}
            onChange={(e: any) => 
            {
              let val = e.target.value
              if(val > details.dueamount){
                val = details.dueamount
              }
              setAmount(val)
            }
            }
            />
          </div>

          <div>
            <label>Next Payment Date</label>{" "}
            <input
              type="date" required={amount !== details.dueamount}
              onChange={(e: any) => {
                setNextpaydate(e.target.value);
              }}
            />
          </div>
          <div >
          <button type="submit">Submit</button>
          <button type="button" onClick={closefuntion}>Close</button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
};

export default MRPayment;
