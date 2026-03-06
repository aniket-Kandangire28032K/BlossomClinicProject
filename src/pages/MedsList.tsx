import axios from "axios";
import { useEffect, useState } from "react";
import { LiaDownloadSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
const MedsList = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [medsList, setList] = useState([]);
  const [medName, setMedName] = useState("");
  const [singleMed, setSingleMed] = useState<any>([]);
  const [stockDate,setStockDate] = useState<string | null>(null);
  const [dateStock,setDateStock] = useState([]);
  const date= new Date().toISOString().split("T")[0].split("-").reverse().join("/");
  const getAllMeds = async () => {
    try {
      const res = await axios.get(`${URL}/medicine`);
      setList(res.data);
    } catch (error) {
      console.log(error);
    }finally{
      setDateStock([])
      setStockDate(null)
    }
  };
  useEffect(() => {
    getAllMeds();
  }, []);
  const downloadExcel = () => {
    // download Excel file
    const table = document.getElementsByClassName("meds-table")[0];
    const wrokbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wrokbook, "PatientData.xlsx");
  };

  const handleSubmit = async (e: any) => {
    // Form  Submit
    e.preventDefault();
    try {
      const res = await axios.get(`${URL}/medicine/search?med=${medName}`);
      console.log(res.data);
      setSingleMed(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeStock = async () => {
    try {
      const res = await axios.post(`${URL}/stock`);
      console.log(res.data)
      toast.info("Stock Closed For Today")
    } catch (error) {
      console.log("Internal Server Error")      
    } finally{
      getMeds();
    }
  };
  
  const getMeds = async()=>{
    try {
      const res = await axios.get(`${URL}/stock`);
      console.log(res.data.stock.filter((e:any)=> (e.date === stockDate))[0])
      setDateStock(res.data.stock.filter((e:any)=> (e.date === stockDate)))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getMeds();
  },[stockDate])
  return (
    <div className="meds-list">
      <h1>Inventory</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Medicine Name"
          onChange={(e) => setMedName(e.target.value)}
        />
        <input type="date" value={stockDate || "" } onChange={e => setStockDate(e.target.value)}/>
        <button type="submit" className="hover">Search</button>
        <button type="reset" className="hover" onClick={getAllMeds}>
          clear
        </button>
        <button onClick={closeStock}>Close Stock</button>
      </form>
      { stockDate &&
        <div>
          {dateStock.map((e:any,num:number)=>(
            <div key={num}>
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Date</th>
                    <th>Company Name</th>
                    <th>Product Name</th>
                    <th>Opening Stock</th>
                    <th>Closinging Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    e.products.map((item:any,index:number)=>(
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{e.date}</td>
                        <td>{item.companyName}</td>
                        <td>{item.productname}</td>
                        <td>{item.Openingstock}</td>
                        <td>{item.closingstock}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )) }
        </div>
      }
        {dateStock.length === 0 && <table className="meds-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Company</th>
              <th>Medincine Name</th>
              <th>Stock In Date</th>
              <th>stock In</th>
              <th>stock</th>
              <th>stock Out Date</th>
              <th>stock Out</th>
            </tr>
          </thead>
          <tbody>
            {medName && (
              <tr>
                <td>{date}</td>
                <td>{singleMed.companyname}</td>
                <td>{singleMed.medicinename}</td>
                {/* <td>{singleMed.mrname}</td> */}
                <td>{singleMed?.stockindate || "NULL"} </td>
                <td>{singleMed?.stockin || "NULL"}</td>
                <td>{singleMed.stock}</td>
                <td>{singleMed.stockoutdate || "NULL"} </td>
                <td>{singleMed?.stockout || "NULL"}</td>
                {/* <td>{singleMed.unitprice}</td> */}
                {/* <td>{singleMed.totalprice}</td> */}
              </tr>
            )}
            {medsList.map((e: any, i: number) => (
              <tr key={i}>
                <td>{date}</td>
                <td>{e.companyname}</td>
                <td>{e.medicinename}</td>
                {/* <td>{e.mrname}</td> */}
                <td>{e?.stockindate || "NULL"} </td>
                <td>{e?.stockin || "NULL"}</td>
                <td>{e.stock}</td>
                <td>{e.stockoutdate || "NULL"} </td>
                <td>{e?.stockout || "NULL"}</td>
                {/* <td>{e.unitprice}</td> */}
                {/* <td>{e.totalprice}</td> */}
              </tr>
            ))}
          </tbody>
        </table>}

        <button className="download-btn" onClick={downloadExcel}>
          <LiaDownloadSolid />
          Download
        </button>
    </div>
  );
};

export default MedsList;
