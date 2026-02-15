import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { LiaDownloadSolid } from "react-icons/lia";

const MRlist = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [listMr, setListMr] = useState([]);
  const [mrname, setMrName] = useState("");
  const [searchDate,setSearchDate] = useState<any>()
  const getMR = async () => {
    try {
      const res = await axios.get(`${URL}/mrlist`);
      setListMr(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMR();
  }, []);
  const downloadExcel = () => {
    // download Excel file
      const table = document.getElementsByClassName("mr-table")[0];
      const wrokbook = XLSX.utils.table_to_book(table);
      XLSX.writeFile(wrokbook,"PatientData.xlsx");
    }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
    const body:any={};
    if (mrname) body.mrname = mrname;
    if (searchDate) {
      let formateDate = searchDate.split("-").reverse().join("/")  
      body.date = formateDate;
    };

    if (!mrname && !searchDate) {
      alert("Please provide name or date");
      return;
    }
    const res = await axios.post(`${URL}/mr-payment`,body);
      setListMr(res?.data?.mrList);
      console.log(res.data)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mr-list">
      <h1>MR List </h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter MR name"
          onChange={(e) => setMrName(e.target.value)}
        />
        <input type="date" value={searchDate} onChange={(e)=>setSearchDate(e.target.value)} />
        <button type="submit">Search</button>
        <button type="reset" onClick={getMR} >Clear</button>
      </form>
      <table className="mr-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Company Name</th>
            <th>MR Name</th>
            <th>contact</th>
            <th>Products</th>
            <th>Total</th>
            <th>paid</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {/* {listMr.length === 0 && <tr>
            <td colSpan={9}>No Data</td>
          </tr> } */}
          {listMr?.map((e:any, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{e.date}</td>
                <td>{e.companyname}</td>
                <td>{e.mrname}</td>
                <td>{e.contact}</td>
                <td>
                  <ul>
                  {Array.isArray(e.productlist) &&  e.productlist.map((item:any,num:any)=>(
                  <li key={num}>{item.medicinename} * {item.stock} = per unit ₹.{item.unitprice}</li>
                ))}
                  </ul>
                </td>
                <td>{e.totalamount}</td>
                <td>{e.paidamount}</td>
                <td>{e.dueamount}</td>
              </tr>
            ))}
          
        </tbody>
      </table>
      <button className="download-btn" onClick={downloadExcel}><LiaDownloadSolid/>Download</button>
    </div>
  );
};
export default MRlist;


