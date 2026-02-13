import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsPersonSquare } from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import * as XLSX from 'xlsx';
const PatientList = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  interface Patient {
    name: string;
    age: number;
    date:string
    contact: number;
    address: number;
    symptoms: string;
    email:String;
    history:String;
    opdno:String;
  }
  const [list, setList] = useState<Patient[]>([]);
  const [singlename, setName] = useState("");
  const [patient, setPatient] = useState<any>(null);

  // Get all patients
  useEffect(() => {
    const getAllPatients = async () => {
      try {
        const res = await axios.get(`${URL}/patient`);
        setList(res.data.Patients);
      } catch (error) {
        console.log(error);
        toast.warning("Insternal Server Error");
      }
    };
    getAllPatients();
  }, []);
  const downloadExcel = () => {
    const table = document.getElementsByClassName("patient-table")[0];
    const wrokbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wrokbook,"PatientData.xlsx");
  }

  // Get single Patient
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${URL}/singlepatient?name=${singlename}`
      );
      // console.log(res.data.card);
      setPatient(res.data.card);
      toast.success("Patient Found");
    } catch (error) {
      console.log(error);
      toast.warning("Patient Not Found");
    }
  };
  return (
    <div className="patient-list">
      <h1>Patient's List</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient's Name"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
        <button type="reset" onClick={() => {setPatient(null);setName('');}}>Cancel</button>
      </form>
      { patient && (
        <div className="patient-card">
          <h3>Patient ID</h3>
          <div className="icondiv">
            <BsPersonSquare className="icon"/>
          </div>
          <div className="card-data">
            <p><strong>Name: </strong>{patient.name}</p>
            <p><strong>Age: </strong>{patient.age || ' '}</p>
            <p><strong>Gender: </strong>{patient.gender || ' '}</p>
            <p><strong>Contact: </strong>{patient.contact || ' '}</p>
            <p><strong>Email: </strong>{patient.email || ''}</p>
            <p><strong>DOB: </strong>{patient.DOB || ''}</p>
            <p><strong>Address: </strong>{patient.address || ' '}</p>
            <p>symptoms:</p>
          </div>
        </div>
      )}

      <table className="patient-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>OPD No.</th>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Contact</th>
            <th>History</th>
            
          </tr>
        </thead>

        <tbody>
          {list.length > 0 ? (
            list.map((p, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.date}</td>
                <td>{p.opdno}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.contact}</td>
                <td>{p.history}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td rowSpan={5} style={{ textAlign: "center" }}>
                No patients found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="download-btn" onClick={downloadExcel}><MdFileDownload className="icon"/>Download Sheet</button>
    </div>
  );
};

export default PatientList;
