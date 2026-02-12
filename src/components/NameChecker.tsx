import { useState } from "react";
import "./Components.css";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";

const NameChecker = () => {
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
    // interface product{
    //     name:String,
    //     price:number
    // }
  const [name, setName] = useState<any>("");
  const [details, setDetails] = useState<data | null>(null);
  const [presDetails, setPrescriptionDetails] = useState<prescription | null>(
    null
  );

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
      setDetails(cardRes.value.data.card);

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
  const copyText =(text:any) =>{
    navigator.clipboard.writeText(text)
    .then(() => {
      toast.success("Copied to clipboard");
    })
    .catch(() => {
      toast.error("Copy failed");
    });
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
          <button onClick={() => setDetails(null)}>Close</button>
          <div className="popup-body">
          <h3>Patient Details</h3>
          <p>Date: {details.date}</p>
          <p>OPD No: {details.opdno} <button className="copy-btn" onClick={()=> copyText(details.opdno) }><FaCopy/></button></p>
          <p>Name: {details.name} <button className="copy-btn" onClick={()=> copyText(details.name) }><FaCopy/></button></p>
          <p>History: {details.history}</p>
          <p>Ref: {details.reference}</p>
          <p></p>
          {presDetails && (
            <div>
              <h3>Prescription Details</h3>
              <p>OPD No.{presDetails.opdno || ""}</p>
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
