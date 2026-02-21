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
  const URL = import.meta.env.VITE_Backend_URL;
  const currentdate = new Date().toISOString().split("T")[0].split("-").reverse().join("/")
  const [formData, setFormData] = useState<any>({
    // Post Data
    patientname: "",
    opdno:'',
    date: "",
    nextAppointmentDate: "",
  });
  const [cost, setCost] = useState({
    productCost: 0,
    treatmentCost: 0,
    totalCost: 0,
    consultFee: 0,
  });
  // product States
  const [productName, setProductName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productRemark, setProductRemark] = useState("");
  const [productPrice, setProductPrice] = useState<Number>(0);
  const [productList, setProductList] = useState<any>([]);
  const [productQty, setProductQty] = useState<any>(0);

  // treatment States
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentPrice, setTreatmentPrice] = useState("");
  const [treatmentList, setTreatmentList] = useState<any>([]);


  // Mr states
  const [meds,setMeds] = useState<any>([])
  const getMRList = async()=>{
    try {
      const res = await axios.get(`${URL}/medicine`);
      setMeds(res.data)
    } catch (error) { 
      console.log(error)
    }
  }
  const addProducts = () => {
    // add Product to List
    if (productName.length == 0 || productPrice == 0)
      return alert("Please Enter Value in All fields");
    const object = {
      name: productName,
      price: Number(productPrice),
      remark: productRemark,
      qty:Number(productQty),
      stockindate:currentdate,
      stockin:Number(productQty)
    };
    setProductList([...productList, object]);
    setProductName("");
    setProductPrice(0);
    setProductRemark("");
    setProductQty("");
  };

  const deleteProduct = (index: number) => {
    // Delete a Product
    setProductList(productList.filter((_: any, i: number) => i !== index));
  };
  const addTreatment = () => {
    // add Treatment to List
    if (treatmentName.length == 0 || treatmentPrice.length == 0)
      return alert("Please Enter Value in All fields");
    const object = {
      name: treatmentName,
      price: treatmentPrice,
    };
    setTreatmentList([...treatmentList, object]);
    setTreatmentName("");
    setTreatmentPrice("");
  };
  const deleteTreatment = (index: number) => {
    setTreatmentList(treatmentList.filter((_: any, i: number) => i !== index));
  };


  useEffect(() => {
    // Default Date Save
    const d = new Date();
    const day = String(d.getDate()).padStart(2,"0");
    const month = String(d.getMonth() + 1).padStart(2,"0");
    const year = d.getFullYear();
    const today = `${day}/${month}/${year}`;

    setFormData({
      ...formData,
      date: today,
    });
    getMRList();
  }, []);

  useEffect(() => {
    //  cal Total Cost
    let productTotal = productList.reduce(
      (sum: number, item: any) => sum + Number(item.price),
      0
    ); // zero is default value
    let treatmentTotal = treatmentList.reduce(
      (sum: number, i: any) => sum + Number(i.price),
      0
    );
    setCost({
      ...cost,
      productCost: productTotal,
      treatmentCost: treatmentTotal,
      totalCost: treatmentTotal + cost.consultFee,
    });
  }, [productList, treatmentList, cost.consultFee]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if(name === "nextAppointmentDate"){
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
  const calTotal=(rate:String)=>{
    let total = Number(rate) * productQty;
    setProductPrice(total)
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
    console.log(postData)
    try {
      // const result =  await axios.put(`${URL}/medicine/stock-update`, postData)
      // await axios.post(`${URL}/prescription`, postData);
      const [result, presres] = await Promise.all([
      axios.put(`${URL}/medicine/stock-update`, postData),
      axios.post(`${URL}/prescription`, postData)])
      toast.success(result.data.message);
      
      window.print();
    } catch (error:any) {
      let sms:string=error.response.data.message;
      toast.error(sms);
    }
  };
  return (
    <div className="dashboard">
      <NameChecker/>
      <h1>prescription</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <h3>Date: {formData.date}</h3>
        <input
          type="text"
          placeholder="OPD No."
          name="opdno"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Patient Name"
          name="patientname"
          required
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Consult Fee"
          required
          onChange={(e) =>
            setCost({ ...cost, consultFee: parseInt(e.target.value) })
          }
        />

        <div className="product-form">
          <select value={companyName} onChange={e=> setCompanyName(e.target.value)}>
            <option value="">Company</option>
            {
              meds.map((item:any)=>(
                <option key={item._id} value={item?.companyname}>{item?.companyname}</option>
              ))
            }
          </select>
          <select value={productName} onChange={e=> setProductName(e.target.value)}>
            <option value="">Products</option>
            {
              meds.map((item:any)=>(
                <option key={item._id} value={item.medicinename}>{item.medicinename}</option>
              ))
            }
          </select>
          <input
            type="text"
            placeholder="Remark"
            value={productRemark}
            onChange={(e) => setProductRemark(e.target.value)}
          />
          {/* <label htmlFor="">Qty:</label> */}
          <input
            type="number"
            placeholder="Qty"
            min={1}
            // value={productQty}
            onChange={(e) => setProductQty(e.target.value)}
            
          />
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => {
              calTotal(e.target.value)
            }}
          />
          <button type="button" onClick={addProducts}>
            Add
          </button>
        </div>
        {productList.length > 0 && (
          <table className="product-table">
            <thead>
              <tr className="table-head">
                <td>Product</td>
                <td>Remark</td>
                <td>Qty</td>
                <td>Price</td>
              </tr>
            </thead>
            <tbody>
              {productList.map((e: any, i: number) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td>{e.remark}</td>
                  <td>{e.qty}</td>
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
          <input
            type="text"
            placeholder="Price"
            value={treatmentPrice}
            onChange={(e) => setTreatmentPrice(e.target.value)}
          />
          <button type="button" onClick={addTreatment}>
            Add
          </button>
        </div>
        {treatmentList.length > 0 && (
          <table className="treatment-table">
            <thead>
              <tr className="table-head">
                <td>Treatment</td>
                <td>Price</td>
              </tr>
            </thead>
            <tbody>
              {treatmentList.map((e: any, i: number) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td>
                    Rs.{e.price}{" "}
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
        <div>
          <label htmlFor="">Next Appointment Date:</label>
          <input
            type="date"
            name="nextAppointmentDate"
            onChange={handleChange}
          />
        </div>
        <h3>Total Fees:Rs.{cost.totalCost || 0}</h3>
        <div className="btn-group">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
          <button type="button" 
          onClick={() => window.print()}
          >Print</button>
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
                <p key={i}>{i + 1}. {e.name}</p>
              ))}
            </div>
          )}
        </div>
        <div className="sub-footer">
          {/* <h3>Consult Fee: Rs.{cost.consultFee || 0}/-</h3> */}
          {/* <h3>Total Fee: Rs. {cost.totalCost || 0}/-</h3> */}

          {formData.nextAppointmentDate && (
            <h3>
              Follow up Date:{" "}
              {formData.nextAppointmentDate.split("-").reverse().join("/")}{" "}
            </h3>
          )}
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
