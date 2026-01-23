import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { LiaDownloadSolid } from "react-icons/lia";

const MRlist = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [listMr, setListMr] = useState([]);
  const [mrname, setMrName] = useState("");
  const [singlemr, setSinglemr] = useState<any>({});
  useEffect(() => {
    const getMR = async () => {
      try {
        const res = await axios.get(`${URL}/mrlist`);
        setListMr(res.data);
        // console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    };
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
      const res = await axios.get(`${URL}/mr?mr=${mrname}`);
      
      setSinglemr(res.data);
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
        <button type="submit">Search</button>
        <button type="reset">Clear</button>
      </form>
      {/* {
            mrname && <div className="mr-card">{mrname}</div>
          } */}
      <table className="mr-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Company Name</th>
            <th>MR Name</th>
            <th>contact</th>
            <th>email</th>
            <th>Products</th>
            <th>paid</th>
            <th>Due</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {!mrname &&
            listMr.map((e:any, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{e.companyname}</td>
                <td>{e.mrname}</td>
                <td>{e.contact}</td>
                <td>{e.email}</td>
                <td>{e.productlist}</td>
                <td>{e.paidamount}</td>
                <td>{e.dueamount}</td>
                <td>{e.totalamount}</td>
              </tr>
            ))}
          {mrname && (
            <tr>
              <td></td>
              <td>{singlemr.companyname}</td>
              <td>{singlemr.mrname}</td>
              <td>{singlemr.contact}</td>
              <td>{singlemr.email}</td>
              <td>{singlemr.productlist}</td>
              <td>{singlemr.paidamount}</td>
              <td>{singlemr.dueamount}</td>
              <td>{singlemr.totalamount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="download-btn" onClick={downloadExcel}><LiaDownloadSolid/>Download</button>
    </div>
  );
};
export default MRlist;


