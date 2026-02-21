import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const MrForm = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const date= new Date().toISOString().split("T")[0].split("-").reverse().join("/")
  const [today, setToday] = useState<string>("");
  const [products, setProducts] = useState<any>({
    medicinename: "",
    stock: 0,
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
    paymentMethod:""
  });
  const reset = () => {
    setFormData({
      companyname: " ",
      mrname: " ",
      contact: " ",
      email: " ",
      productlist: [],
      paidamount: 0,
      dueamount: 0,
      totalamount: 0,
      invoiceno: " ",
      nextpaydate: " ",
      paymentMethod:""
    });
    setProducts({
    medicinename: "",
    stock: 0,
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
          companyname:formData.companyname,
          mrname:formData.mrname,
          medicinename: products.medicinename,
          stock: Number(products.stock),
          unitprice: Number(products.unitprice),
          totalprice: products.stock * products.unitprice,
          stockin:Number(products.stock),
          stockindate:date
        },
      ],
    });
    console.log(formData.productlist);
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
    e.preventDefault();
    const [year, month, day] = formData.nextpaydate.split("-");
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
      await Promise.all([
        axios.post(`${URL}/mr`, postData),
        axios.post(`${URL}/medicine-bulk`, formData.productlist),
      ]);
      toast.success("MR added Successfully");
    } catch (error) {
      console.log(error);
      toast.warn("Internal Server Error");
    }finally{
      reset();
    }
  };

  return (
    <div className="mr-form">
      <h1>MR Form</h1>
      <h3>Date: {today}</h3>
      <form autoComplete="off" onSubmit={handleSubmit}>
        {/* <div className="inputfield">
        </div> */}
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
            value={products.stock}
            onChange={(e) =>
              setProducts({ ...products, stock: e.target.value })
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
                  <td>{item?.medicinename}</td>
                  <td>{item?.stock}</td>
                  <td>₹: {item?.unitprice}/-</td>
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
            value={formData.totalamount}
          />
          <label htmlFor="totalamount">total Amount</label>
        </div>
        <div className="inputfield">
          <input
            type="number"
            placeholder="" step="any"
            id="paidamount"
            onChange={handleChange}
            // max={formData.totalamount}
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
            // onClick={calDue}
          />
          <label htmlFor="due">Due Amount</label>
        </div>
        <div className="inputfield">
          <input
            type="text"
            placeholder=""
            id="invoiceno"
            onChange={handleChange}
            pattern="[a-zA-Z0-9]+"
            maxLength={15}
            value={formData.invoiceno}
          />
          <label htmlFor="paid">Invoice No.</label>
        </div>
        <div className="inputfield">
          <select id="paymentMethod" onChange={handleChange}value={formData.paymentMethod}>
            <option>Payment Method</option>
            <option value="cash">Cash</option>
            <option value="gpay">Gpay</option>
            <option value="phonepe">PhonePe</option>
            <option value="IMPS">IMPS</option>
            <option value="onlineBankine">Online Banking</option>
          </select>
        </div>  
        <div className="inputfield">
          <input
            type="date"
            id="nextpaydate"
            onChange={handleChange}
            value={formData.nextpaydate}
          />
          <label htmlFor="due">Next Payment Date</label>
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
