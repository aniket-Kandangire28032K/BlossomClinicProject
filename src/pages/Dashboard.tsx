import axios from "axios";
import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { IoMdCall } from "react-icons/io";
import { GiWireframeGlobe } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import NameChecker from "../components/NameChecker";
const Dashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const URL = import.meta.env.VITE_Backend_URL;
  const currentdate = new Date().toISOString().split("T")[0].split("-").reverse().join("/");
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    // Post Data
    patientname: "",
    opdno: "",
    date: "",
    nextAppointmentDate: "",
    remark: "",
    nextpaymentdate:"",
    paymentMethod:""
  });
  const [cost, setCost] = useState({
    productCost: 0,
    treatmentCost: 0,
    totalCost: 0,
    consultFee: 0,
    paidamount: 0,
    balanceamount: 0,
  });
  // product States
  const [productName, setProductName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productRemark, setProductRemark] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productList, setProductList] = useState<any>([]);
  const [productQty, setProductQty] = useState<any>(0);
  // treatment States
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentPrice, setTreatmentPrice] = useState(0);
  const [treatmentSessions, setTreatmentSessions] = useState<number>(0);
  const [pendingSessions,setPendingSessions] = useState(0)
  const [completeSessions,setCompletedSessions] = useState(0)
  const [treatmentList, setTreatmentList] = useState<any>([]);
  const [display, setDisplay] = useState(false);
  const [products, setProducts] = useState([]);
  const [uniqueCompanyNames,setUniqueCompanyNames] = useState([])
  // Mr states
  const [meds, setMeds] = useState<any>([]);
  const getProducts = async () => {
    try {
      const res = await axios.get(`${URL}/medicine`);
      const list =res.data
      let uniqueNames:any = [...new Set(list.map((item:any)=> item.companyname))]
      // console.log(uniqueNames)

      setUniqueCompanyNames(uniqueNames)
      setMeds(res.data);
      // console.log(list)
    } catch (error) {
      console.log(error);
    }
  };
  const addProducts = () => {
    // add Product to List
    if (productName.length == 0 || productPrice == 0)
      return alert("Please Enter Value in All fields");
    const object = {

      name: productName,
      companyname:companyName,
      unitprice:Number(productPrice),
      price: Number(productPrice) * Number(productQty),
      remark: productRemark,
      qty: Number(productQty),
      stockoutdate: currentdate,
      stockout: Number(productQty),
    };
    setProductList([...productList, object]);
    setProductName("");
    setProductRemark("");
    setProductQty(0)
    setProductPrice(0)
  };

  const deleteProduct = (index: number) => {
    // Delete a Product
    setProductList(productList.filter((_: any, i: number) => i !== index));
  };
  const addTreatment = () => {
    // add Treatment to List
    if (treatmentName.length == 0 || treatmentPrice == 0)
      return alert("Please Enter Value in All fields");
    const object = {
      name: treatmentName,
      price: Number(treatmentPrice),
      sessions:treatmentSessions,
      // persession:Number(treatmentPrice),
      completesessions:Number(completeSessions),
      pendingsessions:Number(pendingSessions)
    };
    setTreatmentList([...treatmentList, object]);
    setTreatmentName("");
    setTreatmentPrice(0)
    setTreatmentSessions(0)
    setCompletedSessions(0)
    setPendingSessions(0)
    
  };

  const deleteTreatment = (index: number) => {
    // Delete from List
    setTreatmentList(treatmentList.filter((_: any, i: number) => i !== index));
  };

  useEffect(() => {
    // Default Date Save
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const today = `${day}/${month}/${year}`;

    setFormData({
      ...formData,
      date: today,
    });
    getProducts();
  }, []);

  useEffect(() => {
    //  cal Total Cost
    let productTotal = productList.reduce(
      (sum: number, item: any) => sum + Number(item.price),
      0,
    ); // zero is default value
    let treatmentTotal = treatmentList.reduce(
      (sum: number, i: any) => sum + Number(i.price),
      0,
    );
    let balance = 0
     balance = Number(cost.totalCost) - Number(cost.paidamount || 0);
    setCost({
      ...cost,
      productCost: productTotal,
      treatmentCost: treatmentTotal,
      totalCost: treatmentTotal + Number(cost.consultFee || 0) + productTotal,
      balanceamount: balance,
    });
  }, [productList, treatmentList, cost.consultFee, cost.paidamount,cost.totalCost,]);

  const handleChange = (e: any) => {
    // handles change function
    const { name, value } = e.target;
    if (name === "nextAppointmentDate") {
      setFormData({
        ...formData,
        nextAppointmentDate: value.split("-").reverse().join("/"),
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: any) => {
    // Submit Function
    e.preventDefault();
    setLoading(true)
    const nextDate = formData.nextAppointmentDate
      .split("-")
      .reverse()
      .join("/");
    
      const postData = {
      ...formData,
      nextAppointmentDate: nextDate,
      ...cost,
      products: productList,
      treatments: treatmentList,
    };
    try {
      const res = await axios.post(`${URL}/prescription`, postData)
      toast.success(res.data.message);
      // console.log(postData)
      setLoading(false)
      // window.print();
    } catch (error: any) {
      let sms: string = error.response.data.message;
      toast.error(sms);
      setLoading(false)
    } finally {
      getProducts();
      setFormData({
        patientname: "",
        opdno: "",
        nextAppointmentDate: "",
        remark: "",
        nextpaymentdate:""
      });
      setCost({
        productCost: 0,
        treatmentCost: 0,
        totalCost: 0,
        consultFee: 0,
        paidamount: 0,
        balanceamount: 0,
      });
      setProductList([]);
      setTreatmentList([]);
      setCompanyName("")
      setProductName("")
      setCompletedSessions(0)
      
    }
  };

  useEffect(() => {
    if (companyName) {
      setProducts(() =>
        meds.filter((item: any) => item.companyname === companyName),
      );
    }
  }, [companyName]);
  return (
    <div className="dashboard">
      <NameChecker formData={formData} setFormData={setFormData} />
      <h2>prescription</h2>
      <form onSubmit={handleSubmit} onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }} autoComplete="off">
        <h3>Date: {currentdate}</h3>
        <input
          type="text"
          placeholder="OPD No."
          name="opdno"
          value={formData.opdno}
          required
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Patient Name"
          name="patientname"
          value={formData.patientname}
          required
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Consultation Fee"
           value={cost.consultFee}
          onChange={(e) =>
            setCost({ ...cost, consultFee: parseInt(e.target.value) })
          }
        />

        <div className="product-form">
          <select
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          >
            <option value="">Company</option>
            {uniqueCompanyNames.map((item: any,num:number) => (
              <option key={num} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          >
            <option value="">Products - Qty -  Unit Rate</option>
            {products.map((item: any) => (
              <option key={item._id} value={item.medicinename}>
                {item.medicinename} - {item.stock} -  Rs.{item.unitprice}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Remarks"
            value={productRemark}
            onChange={(e) => setProductRemark(e.target.value)}
          />
          {/* <label htmlFor="">Qty:</label> */}
          <input
            type="number"
            placeholder="Qty"
            min={1}
            value={productQty ==0 ? "" :productQty}
            onChange={(e) => setProductQty(e.target.value)}
          />
          <input
            type="number" value={productPrice == 0 ? " " : productPrice}
            placeholder="Price"
            onChange={(e:any) => {
              setProductPrice(e.target.value);
            }}
          />
          <button type="button" onClick={addProducts}>
            Add
          </button>
        </div>
        {productList.length > 0 && (
          <table className="product-table" border={1}>
            <thead>
              <tr className="table-head">
                <td>Product</td>
                <td>Remark</td>
                <td>Qty</td>
                <td>Per Unit Price</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              {productList.map((e: any, i: number) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td>{e.remark}</td>
                  <td>{e.qty}</td>
                  <td>{e.unitprice}</td>
                  <td>
                    Rs.{e.price}
                    <button
                      type="button"
                      className="del-btn"
                      onClick={() => deleteProduct(i)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="treatment-Form">
          <input
            type="text"
            placeholder="Treatment"
            value={treatmentName}
            onChange={(e) => setTreatmentName(e.target.value)}
          />
          <input type="number" min={0} max={treatmentSessions} placeholder="Current Sessions" value={completeSessions == 0 ? "": completeSessions} onChange={(e:any)=>setCompletedSessions(Number(e.target.value))}/>
          <input
            type="number"
            placeholder="sessions"
            value={treatmentSessions == 0 ? "" : treatmentSessions}
            onChange={(e: any) => setTreatmentSessions(Number(e.target.value))}
            max={5}
            min={0}
          />
          <input type="number" name="pendingSessions" placeholder="Pending" max={treatmentSessions} min={0} value={pendingSessions == 0 ? "" : pendingSessions} onChange={(e:any)=>setPendingSessions(Number(e.target.value))}/>
          <input
            type="number"
            placeholder="Price"
            id="treatmentrate"
            value={treatmentPrice == 0 ? "" : treatmentPrice }
            onChange={(e:any) => setTreatmentPrice(e.target.value)}
          />
          <button type="button" onClick={addTreatment}>
            Add
          </button>
        </div>
        {treatmentList.length > 0 && (
          <table className="treatment-table" border={1}>
            <thead>
              <tr className="table-head">
                <th>Treatment</th>
                <th>current sessions</th>
                <th>sessions</th>
                <th>Pending sessions</th>
                
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {treatmentList.map((e: any, i: number) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td>{e.completesessions}</td>
                  <td>{e.sessions}</td>
                  <td>{e.pendingsessions}</td>
                  <td>
                    Rs.{e.price}
                    <button
                      type="button"
                      className="del-btn"
                      onClick={() => deleteTreatment(i)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="section1">
          
          <label>Next Appointment Date:</label>
          <input
            type="date"
            value={formData.nextAppointmentDate}
            name="nextAppointmentDate"
            onChange={handleChange}
            min={today}
          />
        </div>
        <div className="paidamount">
          <label>Paid Amount:</label>
          <input
            type="number"
            value={cost.paidamount}
            name="paidamount"
            onChange={(e: any) =>
              setCost({ ...cost, paidamount: e.target.value })
            }
            min={0}
          />
          <label>Next Payment Date:</label>
          <input
            type="date"
            name="nextpaymentdate"
            value={formData.nextpaymentdate}
            onChange={handleChange}
            min={today}
          />
        </div>
        <div>
        <label >Payment Method: </label>
        <select name="paymentMethod" value={formData.paymentMethod} required onChange={handleChange} style={{width:"30%",padding:"0.4rem"}}>
          <option value="">Payment Method</option>
          <option value="cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="swipe machine">Swipe Machine</option>
        </select>
        </div>
        <input
          type="text"
          placeholder="Remarks"
          name="remark"
          value={formData.remark}
          onChange={handleChange}
        />
        {cost.balanceamount > 0 && <h3>Balance Amount: ₹{cost.balanceamount}</h3>}
        <h3>Total Fees: ₹{cost.totalCost || 0}</h3>
        <div className="btn-group">
          {!loading ? <button type="submit">Submit</button> : <button style={{opacity:0.5}} type="submit" disabled>Submit</button> }
          <button type="reset">Reset</button>
          <button type="button" onClick={() => window.print()}>
            Print
          </button>
          <input type="checkbox" onChange={() => setDisplay(!display)} />
          <label>Display Total</label>
        </div>
      </form>

      
      {/* ! ---------------------------------------------------------(Print Areas)-------------------------------------------------------- */}
      {/* Print Area */}
      <div className="print-area">
        <div className="header">
          <img src="/Blossom-2.png" alt="blossom" className="symbol" />
          <h1>BLOSSOM COSMETOLOGY & HAIR CLININC</h1>
          <p>
            <strong>Dr.Snehal Mane</strong>
          </p>
          <p>Aesthetic Physician</p>
          <p>BHMS, PGDCC(Pune)</p>
          <p>Reg. No- 73865</p>
        </div>
        <div className="details">
          <div>
            <p>
              <strong>Date: {formData.date}</strong>
            </p>
            <h3>OPD No: {formData.opdno} </h3>
            <h3>Name: {formData.patientname} </h3>
            <h1>Rx</h1>
          </div>
        </div>
        <div className="main-section">
          {productList.length > 0 && (
            <div>
              <h3>Products/ Medicines</h3>
              {productList.map((e: any, i: number) => (
                <>
                  <p key={i}>
                    {i + 1}. {e.name}
                  </p>
                  <span>{e.remark}</span>
                </>
              ))}
            </div>
          )}
          {treatmentList.length > 0 && (
            <div>
              <h3>Treatments</h3>
              {treatmentList.map((e: any, i: number) => (
                <p key={i}>
                  {i + 1}. {e.name}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="sub-footer">
          {formData.nextAppointmentDate && (
            <p style={{backgroundColor:"transparent"}}>
              Follow up Date:{" "}
              {formData.nextAppointmentDate.split("-").reverse().join("/")}{" "}
            </p>
          )}
          {display && <p style={{backgroundColor:"transparent",color:"#000"}}>Total: ₹{cost.totalCost}</p>}
          {formData.remark && <p>{formData.remark}</p>}
        </div>
        <div className="footer">
          <div className="footer-container">
            <p>
              <span>
                <FaWhatsapp className="react-icon" />
                8698988812
              </span>
              <span>
                <TfiEmail className="react-icon" />
                info@blossomsk.in
              </span>
            </p>
            <p>
              <span>
                <IoMdCall className="react-icon" />
                8788513648
              </span>
              <span>
                <GiWireframeGlobe className="react-icon" />
                www.blossomsk.in
              </span>
            </p>
            <img src="/QR_image.jpeg" alt="" />
          </div>
          <p>
            <FaLocationDot /> First Floor,Palladium Grand Phase ll,Dhanori
            411015
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
