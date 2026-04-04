
import axios from "axios";
import { useEffect, useState } from "react";
import { LiaDownloadSolid } from "react-icons/lia";
import * as XLSX from "xlsx";

const MedsList = () => {
  const URL = import.meta.env.VITE_Backend_URL;

  const [medsList, setList] = useState<any>();
  const [medName, setMedName] = useState("");
  const [singleMed, setSingleMed] = useState<any>(null);

  const [stockDate, setStockDate] = useState<string | null>(null);
  const [dateStock, setDateStock] = useState<any[]>([]);

  // const today = new Date().toLocaleDateString("en-GB");

  // 🔹 Get all medicines (current stock)
  const getAllMeds = async () => {
    try {
      const res = await axios.get(`${URL}/daily-sales`);
      console.log(res.data.dailysales)
      setList(res.data.dailysales)
    } catch (error) {
      console.log(error);
    } finally {
      setDateStock([]);
      setStockDate(null);
    }
  };

  useEffect(() => {
    getAllMeds();
  }, []);

  // 🔹 Download Excel
  const downloadExcel = () => {
    const table = document.getElementsByClassName("meds-table")[0];
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, "Inventory.xlsx");
  };

  // 🔹 Search medicine
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let filteredData = []
      if(medName){
      // filteredData =  medsList.filter((item:any)=> item.product.map(pro=>))
    }else{
      filteredData =  medsList.filter((item:any)=> item.productname === dateStock)
    }
      setSingleMed(filteredData);
      // console.log(medsList)
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Get stock by date
  const getMedsByDate = async () => {
    if (!stockDate) return;

    try {
      const [year, month, day] = stockDate.split("-");
      const formatted = `${day}/${month}/${year}`;

      const res = await axios.get(`${URL}/stock?date=${formatted}`);
      setDateStock(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMedsByDate();
  }, [stockDate]);

  return (
    <div className="meds-list">
      <h1>Inventory</h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Medicine Name" value={medName}
          onChange={(e) => setMedName(e.target.value)}
        />

        <input
          type="date"
          value={stockDate || ""}
          onChange={(e) => setStockDate(e.target.value)}
        />

        <button type="submit">Search</button>

        <button type="reset" onClick={getAllMeds}>
          Clear
        </button>
      </form>

      { singleMed &&
      <table border={1}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Stock</th>
          </tr>
        </thead>
      <tbody>
      {singleMed.map((med:any)=> <tr key={med._id}>
          <td>{med.date}</td>
          <td>{med.medicinename}</td>
          <td>{med.stock}</td>
        </tr>)}
      </tbody>
      </table>
      }
      {/* 🔥 DEFAULT CURRENT STOCK TABLE */}
      {!stockDate && (
        <table className="meds-table" border={1}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Company</th>
              <th>Medicine</th>
              <th>Opening</th>
              <th>Sold</th>
              <th>Closing</th>
            </tr>
          </thead>
          <tbody>
  {medsList?.map((day: any, index: number) =>
    day.products?.map((item: any, num: number) => (
      <tr key={`${index}-${num}`}>
        <td>{day.date}</td>
        <td>{(item.companyName)}</td>
        <td>{(item.productname)}</td>
        <td>{item.openingstock}</td>
        <td>{item.sold}</td>
        <td>{item.closingstock}</td>
      </tr>
    ))
  )}
</tbody>
        </table>
      )}

      <button className="download-btn" onClick={downloadExcel}>
        <LiaDownloadSolid />
        Download
      </button>
    </div>
  );
};

export default MedsList;
