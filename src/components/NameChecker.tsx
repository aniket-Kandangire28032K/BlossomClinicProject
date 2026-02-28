import { useState } from "react";
import "./Components.css";
import axios from "axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

const NameChecker = ({formData,setFormData}:any) => {
  const URL = import.meta.env.VITE_Backend_URL;
    interface data {
      date: string;
      opdno: string;
      name: string;
      history: string;
      reference: string;
    }
    interface prescription {
      date: string;
      opdno: string;
      nextAppointmentDate: string;
      products: {
        name: string;
        price: number;
        remark:string;
        qty:number;
      }[];
      treatments: {
        name: string;
        price: number;
      }[];
      productCost: number;
      treatmentCost: number;
      consultFee: number;
      totalCost: number;
    }
  const [name, setName] = useState<any>("");
  const [details, setDetails] = useState<data | null>(null);
  const [presDetails, setPrescriptionDetails] = useState<prescription | null>(null);
  const [display,setDisplay] = useState(false)

  const checkforPatient = async (e: any) => {
    e.preventDefault();
     e.preventDefault();

  if (!name || !name.trim()) {
    toast.error("Please enter a patient name");
    return;
  }

  try {
    // Fetch card and prescription in parallel, but handle individually
    const [cardRes, prescriptionRes] = await Promise.allSettled([
      axios.get(`${URL}/singlepatient?name=${name.toLowerCase()}`),
      axios.get(`${URL}/getprescription?patientname=${name.toLowerCase()}`)
    ]);

    // Check if card data exists
    if (cardRes.status === "fulfilled" && cardRes.value.data.card) {
      console.log(cardRes.value.data.card.name)
      console.log(cardRes.value.data.card.opdno)
      setDetails(cardRes.value.data.card);
      setFormData({
        ...formData,
        patientname:cardRes.value.data.card.name,
        opdno:cardRes.value.data.card.opdno
      })
      // Prescription may or may not exist
      if (prescriptionRes.status === "fulfilled") {
        setPrescriptionDetails(prescriptionRes.value.data.details);
      } else {
        setPrescriptionDetails(null); // empty if not found
      }
      
      toast.success("Patient Found");
    } else {
      toast.warning("Patient Not Found");
      setDetails(null);
      setPrescriptionDetails(null);
    }
  } catch (err) {
    console.error(err);
    toast.error("Unexpected error occurred");
  }
  };
// Update Patient Details
const updatePatient= async()=>{
  try {
    const res = await axios.patch(`${URL}/patient`,details);
    console.log(res.data)
    toast.success("Patient Details Updated")
  } catch (error) {
    console.log(error);
    toast.warn('Internal Server Error')
  }finally{
    setDisplay(!display)
  }
}

  return (
    <div className="checker">
      <h1>Check Patient Details</h1>
      <form onSubmit={checkforPatient}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button type="submit">Check</button>
        
      </form>
      {details && (
        <div className="patient-details">
          <button onClick={() => setDetails(null)}><IoClose/></button>
          <div className="popup-body">
          <h3>Patient Details<button type="button" className="edit-btn" onClick={()=> setDisplay(!display)}>Update{display ? <IoClose color="red"/> :<FaEdit/>}</button></h3>
          <p>Date: {details.date}</p>
          <p>OPD No: {details.opdno}</p>
          {display ? <input type="text" value={details.name} onChange={(e)=>{
            setDetails({
              ...details,
              name:e.target.value
            })
          }} />  : <p>Name: {details.name}</p>}
          {display ? <input type="text" value={details.history} onChange={(e)=>{
            setDetails({
              ...details,
              history:e.target.value
            })
          }}/>  : <p>History: {details.history}</p>}
          {display ? <input type="text" value={details.reference} 
          onChange={(e)=>{
            setDetails({
              ...details,
              reference:e.target.value
            })
          }}
          />  : <p>Ref: {details.reference}</p>}
          {display && <button type="button" onClick={updatePatient}>Submit</button>}
          {presDetails && (
            <div>
              <h3>Prescription Details</h3>
              {/* <p>OPD No.{presDetails.opdno || ""}</p> */}
              <p>Appointment: {presDetails.nextAppointmentDate || ""}</p>
            </div>
          )}
            {presDetails && <p><u>Products</u></p>}
            <div className="product-list">
            {
                presDetails?.products?.map((item,index)=>(
                    <div key={index} className="product">
                        <p>{index+1}. {item.name}</p>
                        <span><u>Remark:</u> {item.remark} </span>
                        <span><u>Qty:</u> {item.qty}</span>
                    </div>
                ))
            }
            </div>
            {presDetails && <p><u>Treatments</u></p>}
            {
                presDetails?.treatments?.map((item,index)=>(
                    <div key={index}>
                        <p>{index+1}. {item.name}</p>
                    </div>
                ))
            }
            { presDetails && <div className="popup-cost">
            <p>Consult Fee: ₹{presDetails?.consultFee}</p>
            <p>Treatment Cost: ₹{presDetails?.treatmentCost}</p>
            <p>Total Cost: ₹{presDetails?.totalCost}</p>
            </div>
          }
          </div>
        </div>
      )}
    </div>
  );
};

export default NameChecker;
