import axios from "axios"
import { useEffect, useState } from "react"
import { LiaDownloadSolid } from "react-icons/lia";
import * as XLSX from 'xlsx'
const MedsList = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [medsList,setList]=useState([])
  const [medName,setMedName]=useState('')
  const [singleMed,setSingleMed]=useState<any>([])
  
  const getAllMeds=async () => {
   try {
    const res=await axios.get(`${URL}/medicine`);
    setList(res.data)
   } catch (error) {
    console.log(error)
   } 
  }
  useEffect(()=>{
    getAllMeds();
  },[])
  const downloadExcel = () => {
      // download Excel file
        const table = document.getElementsByClassName("meds-table")[0];
        const wrokbook = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wrokbook,"PatientData.xlsx");
      }

  const handleSubmit=async (e:any) => {
    // Form  Submit
    e.preventDefault();
    try {
      const res=await axios.get(`${URL}/medicine/search?med=${medName}`);
      console.log(res.data)
      setSingleMed(res.data)
    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <div className="meds-list">
      <h1>Medicine list</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Medicine Name" onChange={e=> setMedName(e.target.value)}/>
        <button type="submit">Search</button>
        <button type="reset" onClick={getAllMeds}>clear</button>
      </form>
      <table className="meds-table">
        <thead>
          <tr>
            <th>Medincine Name</th>
            <th>MR</th>
            <th>batch No.</th>
            <th>expire Date</th>
            <th>stock</th>
            <th>Unit Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {
            medName && 
            <tr>
              <td>{singleMed.medicinename}</td>
              <td>{singleMed.mrname}</td>
              <td>{singleMed.batchno}</td>
              <td>{singleMed.expiredate}</td>
              <td>{singleMed.stock}</td>
              <td>{singleMed.unitprice}</td>
              <td>{singleMed.totalprice}</td>
            </tr>
          }
          { medsList.map((e:any,i:number)=>(
            <tr key={i}>
              <td>{e.medicinename}</td>
              <td>{e.mrname}</td>
              <td>{e.batchno}</td>
              <td>{e.expiredate}</td>
              <td>{e.stock}</td>
              <td>{e.unitprice}</td>
              <td>{e.totalprice}</td>
            </tr>
          )) }
        </tbody>
      </table>
      <button className="download-btn" onClick={downloadExcel}><LiaDownloadSolid/>Download</button>
    </div>
  )
}

export default MedsList