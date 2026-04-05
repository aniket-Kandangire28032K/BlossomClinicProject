import { useState } from "react";
import "./Components.css";
import axios from "axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

const NameChecker = ({ formData, setFormData }: any) => {
  const URL = import.meta.env.VITE_Backend_URL;
  interface data {
    date: string;
    opdno: string;
    name: string;
    history: string;
    reference: string;
  }
  const [name, setName] = useState<any>("");
  const [details, setDetails] = useState<data | null>(null);
  const [presDetails, setPrescriptionDetails] = useState([]);
  const [display, setDisplay] = useState(false);

  const checkforPatient = async (e: any) => {
    e.preventDefault();
  
    if (!name || !name.trim()) {
      toast.error("Please enter a patient name");
      return;
    }

    try {
      // Fetch card and prescription in parallel, but handle individually
      const [cardRes, prescriptionRes]:any = await Promise.allSettled([
        axios.get(`${URL}/singlepatient?name=${name.toLowerCase()}`),
        axios.get(`${URL}/getprescription?patientname=${name.toLowerCase()}`),
      ]);
      console.log(prescriptionRes.value.data.details)
      // Check if card data exists
      if (cardRes.status === "fulfilled" && cardRes.value.data.card) {
        setDetails(cardRes.value.data.card);
        setFormData({
          ...formData,
          patientname: cardRes.value.data.card.name,
          opdno: cardRes.value.data.card.opdno,
        });
        // Prescription may or may not exist
        if (prescriptionRes.status === "fulfilled") {
          setPrescriptionDetails(prescriptionRes.value.data.details);
        } else {
          setPrescriptionDetails([]); // empty if not found
        }

        // toast.success("Patient Found");
      } else {
        toast.warning("Patient Not Found");
        setDetails(null);
        setPrescriptionDetails([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };
  // Update Patient Details
  const updatePatient = async () => {
    try {
      const res = await axios.patch(`${URL}/patient`, details);
      console.log(res.data);
      toast.success("Patient Details Updated");
    } catch (error) {
      console.log(error);
      toast.warn("Internal Server Error");
    } finally {
      setDisplay(!display);
    }
  };

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
          <button onClick={() => setDetails(null)}>
            <IoClose />
          </button>
          <div className="popup-body">
            <h3>
              Patient Details
              <button
                type="button"
                className="edit-btn"
                onClick={() => setDisplay(!display)}
              >
                Update{display ? <IoClose color="red" /> : <FaEdit />}
              </button>
            </h3>
            <p>Date: {details.date}</p>
            <p>OPD No: {details.opdno}</p>
            {display ? (
              <input
                type="text"
                value={details.name}
                onChange={(e) => {
                  setDetails({
                    ...details,
                    name: e.target.value,
                  });
                }}
              />
            ) : (
              <p>Name: {details.name}</p>
            )}
            {display ? (
              <input
                type="text"
                value={details.history}
                onChange={(e) => {
                  setDetails({
                    ...details,
                    history: e.target.value,
                  });
                }}
              />
            ) : (
              <p>History: {details.history}</p>
            )}
            {display ? (
              <input
                type="text"
                value={details.reference}
                onChange={(e) => {
                  setDetails({
                    ...details,
                    reference: e.target.value,
                  });
                }}
              />
            ) : (
              <p>Ref: {details.reference}</p>
            )}
            {display && (
              <button type="button" onClick={updatePatient}>
                Submit
              </button>
            )}
             {/*Priscriptions  */}
             <div className="pres">
              {
                presDetails?.length > 0 &&  presDetails.map((pres:any)=> <div key={pres._id}>
                    <h3>Prescription</h3>
                    <p>Date: {pres.date}</p>
                    <p>Name: {pres.patientname}</p>
                    <p>OPD: {pres.opdno}</p>
                    
                    <table border={1}>
                      <thead>
                        <tr>
                          <th colSpan={5}>Products</th>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>Remark</th>
                          <th>total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                    {
                      pres.products.map((pro:any,num:number)=> <tr key={num}>
                        <td>{pro.name}</td> 
                        <td>{pro.qty}</td>
                        <td>{pro.remark}</td>
                        <td>{pro.price}</td>
                      </tr>)
                    }
                    </tbody>
                    <tfoot>
                      <tr >
                        <td colSpan={3} style={{textAlign:"end",paddingRight:"1rem",fontWeight:"500"}}>Total Product Cost</td>
                        <td style={{textAlign:"center",fontWeight:"500"}}>{pres.productCost}</td>
                      </tr>
                    </tfoot>
                    </table>
                    {/* Treatment Table */}
                    {pres.treatments.length>0 && <table border={1}>
                      <thead>
                        <tr>
                          <th colSpan={5}>Treatments</th>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <th>completed Sessions</th>
                          <th>Total Sessions</th>
                          <th>total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                    {
                      pres.treatments.map((treat:any,num:number)=> <tr key={num}>
                        <td>{treat.name}</td> 
                        <td>{Number(treat.completesessions)}</td>
                        <td>{treat.sessions }</td>
                        <td>{treat.price}</td>
                      </tr>)
                    }
                    </tbody>
                    <tfoot>
                      <tr >
                        <td colSpan={3} style={{textAlign:"end",paddingRight:"1rem",fontWeight:"500"}}>Total Treatment Cost</td>
                        <td style={{textAlign:"center",fontWeight:"500"}}>{pres.treatmentCost}</td>
                      </tr>
                    </tfoot>
                    </table>}
                    {pres.remark && <p>Remark: {pres.remark}</p>}
                    { pres.nextAppointmentDate && <p>Next Appointment: {pres.nextAppointmentDate}</p>}
                    <p>Consult Fee: Rs. {pres.consultFee}</p>
                    {Number(pres.balanceamount) > 1 &&  <p>Remaining Amount:Rs.{pres.balanceamount}</p>}
                    <p>Paid Amount:{(Number(pres.totalCost)-Number(pres.balanceamount))}</p>
                    <p>Total Fees: Rs.{pres.totalCost}</p>
                </div>)
              }
             </div>
              {
                presDetails.length === 0 && <div className="nodata">
                  <h1>No Data Available</h1>
                </div>
              }
          </div>
        </div>
      )}
    </div>
  );
};

export default NameChecker;
