import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const MrForm = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const firstDay =new Date().toISOString().split("T")[0]
  const date= firstDay.split("-").reverse().join("/")
  const [today, setToday] = useState<string>("");
  const [loading,setLoading] = useState(false)
  const [products, setProducts] = useState<any>({
    medicinename: "",
    qty: 0,
    unitprice: 0,
    totalprice:0
  });
  useEffect(() => {
    const day = new Date();
    const currentDate = String(day.getDate()).padStart(2, "0");
    const currentMOnth = String(day.getMonth() + 1).padStart(2, "0");
    setToday(`${currentDate}/${currentMOnth}/${day.getFullYear()}`);
  }, []);
  const [formData, setFormData] = useState<any>({
    companyname: "",
    mrname: "",
    contact: "",
    email: "",
    productlist: [],
    paidamount: 0,
    dueamount: 0,
    totalamount: 0,
    invoiceno: "",
    nextpaydate: "",
    paymentMethod:"",
    chequeNumber:0,
    lastpaymentdate:date
  });
  const reset = () => {
    setFormData({
      companyname: "",
      mrname: "",
      contact: "",
      email: "",
      productlist: [],
      paidamount: 0,
      dueamount: 0,
      totalamount: 0,
      invoiceno: "",
      nextpaydate: "",
      paymentMethod:""
    });
    setProducts({
    medicinename: "",
    qty: 0,
    unitprice: 0,
    totalprice:0
    })
  };
  const addProduct = () => {
  setFormData({
    ...formData,
    productlist: [
      ...formData.productlist,
      {
        medicinename: products.medicinename,
        qty: Number(products.qty),
        unitprice: Number(products.unitprice),
        totalprice: products.qty * products.unitprice
      },
    ],
  });
  setProducts({
     medicinename: "",
    qty: 0,
    unitprice: 0,
    totalprice:0
  })
  console.log(formData)
};
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    if (id === "contact") {
      // for Conatct
      const cleand = value.replace(/\D/g, "").slice(0, 12);
      setFormData({
        ...formData,
        contact: cleand,
      });
      return;
    }
    if(id === "mrname"){
      const clean = value.replace(/[0-9]/g, "");
      setFormData({
        ...formData,
        mrname:clean
      })
      return;
    }
    // if((id==='nextpaydate'))
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

  const calTotal = () => {
    setFormData({
      ...formData,
      totalamount: formData.productlist.reduce(
        (sum: number, item: any) => sum + item.totalprice,
        0,
      ),
    });
  };

  useEffect(() => {
    calTotal();
  }, [formData.productlist]);

  useEffect(() => {
    calDue();
  }, [formData.totalamount, formData.paidamount]);

  const handleSubmit = async (e: any) => {
    setLoading(true)
    e.preventDefault();
    const [year, month, day] = formData.nextpaydate.split("-");
    console.log(year , month , day)
    let postData ={}
    if(formData.nextpaydate !== ""){
      postData = {
        ...formData,
        date: today,
        paidamount: parseInt(formData.paidamount),
        nextpaydate: `${day}/${month}/${year}`,
      };
    }else{
      postData ={
        ...formData,
        date: today,
        paidamount: parseInt(formData.paidamount),
        nextpaydate:"N/A"
      }
    }
    try {
      await  axios.post(`${URL}/mr`, postData)
      console.log(postData)
      toast.success("MR added Successfully");
    } catch (error) {
      console.log(error);
      toast.warn("Internal Server Error");
    }finally{
      reset();
      setLoading(false)
    }
  };

  return (
    <div className="mr-form">
      <h1>MR Form</h1>
      <h3>Date: {today}</h3>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="inputfield">
          <input
            type="text"
            placeholder=" "
            id="companyname"
            value={formData.companyname}
            onChange={handleChange}
          />
          <label htmlFor="name">Company Name*</label>
        </div>

        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="mrname"
            value={formData.mrname}
            onChange={handleChange}
          />
          <label htmlFor="mrname">MR Name*</label>
        </div>

        <div className="inputfield">
          <input
            type="tel"
            id="contact"
            value={formData.contact}
            required
            maxLength={10}
            placeholder=""
            inputMode="numeric"
            onChange={handleChange}
          />
          <label htmlFor="contact">Contact No.*</label>
        </div>

        <div className="inputfield">
          <input
            type="email"
            value={formData.email}
            placeholder=""
            id="email"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="products">
          <p>Product List</p>
          <input
            type="text"
            placeholder="Product Name"
            value={products.medicinename}
            onChange={(e) =>
              setProducts({ ...products, medicinename: e.target.value })
            }
          />
          <label>Qty:</label>
          <input
            type="number"
            placeholder="Qty"
            min={0}
            value={products.qty}
            onChange={(e) =>
              setProducts({ ...products, qty: e.target.value })
            }
          />
          <label>₹:</label>{" "}
          <input
            type="number"
            placeholder="Per Unit Price"
            min={0}
            step="any"
            value={products.unitprice}
            onChange={(e) =>
              setProducts({ ...products, unitprice: e.target.value })
            }
          />
          <button type="button" onClick={addProduct}>
            ADD
          </button>
          {formData.productlist.length > 0 && <table className="product-list" border={1}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Per Unit Price</th>
                <th></th>
              </tr>
              </thead>
            <tbody>
              {formData.productlist.map((item: any, num: number) => (
                <tr key={num}>
                  <td>{item.medicinename}</td>
                  <td>{item.qty}</td>
                  <td>₹: {item.totalprice}/-</td>
                  <td>
                    <button type="button"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          productlist: prev.productlist.filter(
                            (_: any, i: any) => i !== num,
                          ),
                        }))
                      }
                    ><MdDelete size={20}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>
        <div className="inputfield">
          <input
            type="number"
            readOnly
            id="totalamount"
            step="any"
            value={formData.totalamount === 0 ? "" : formData.totalamount}
          />
          <label htmlFor="totalamount">total Amount</label>
        </div>
        <div className="inputfield">
          <input
            type="number"
            placeholder="" step="any"
            id="paidamount" value={formData.paidamount === 0 ? "" : formData.paidamount}
            onChange={handleChange}
            max={formData.totalamount}
          />
          <label htmlFor="paid">Paid Amount</label>
        </div>
             <div className="inputfield">
          <input
            type="number"
            placeholder=""
            id="dueamount"
            readOnly
            required step="any"
            min={0}
            value={formData.dueamount}
           
          />
          <label htmlFor="due">Due Amount</label>
        </div>
        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="invoiceno"
            onChange={handleChange}
            
            maxLength={15}
            value={formData.invoiceno}
            style={{textTransform:"uppercase"}}
          />
          <label htmlFor="paid">Invoice No.</label>
        </div>
        <div className="inputfield">
          <select id="paymentMethod" required onChange={handleChange} value={formData.paymentMethod}>
            <option>Payment Method*</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="debit card">Debit Card</option>
            <option value="credit card">Credit card</option>
            <option value="net Banking">Net Banking</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>  
        {formData.paymentMethod === "cheque" && 
        <div className="inputfield">
        <input type="number" value={formData.chequeNumber === 0 ? "" : formData.chequeNumber}  onChange={(e)=>setFormData((prev:any)=>({...prev,chequeNumber:e.target.value}))}/>
          <label>Cheque Number</label>
        </div>}
        {formData.dueamount !== 0 &&  <div className="inputfield">
          <input
            type="date"
            id="nextpaydate"
            onChange={handleChange}
            value={formData.nextpaydate}
            min={firstDay}
            
          />
          <label htmlFor="due">Next Payment Date</label>
        </div>}

        <div className="btn-grp">
          {loading ? <button disabled style={{opacity:"0.5"}} type="submit">Submit</button> : <button type="submit">Submit</button>}
          <button type="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default MrForm;
