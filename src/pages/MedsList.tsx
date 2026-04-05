import axios from "axios";
import { useEffect, useState } from "react";
import { LiaDownloadSolid } from "react-icons/lia";
// import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const MedsList = () => {
  const URL = import.meta.env.VITE_Backend_URL;

  const [medsList, setList] = useState<any>([]);
  const [medName, setMedName] = useState("");
  const [stockDate, setStockDate] = useState("");

  const [dateData, setDateData] = useState<any>([]);
  const [nameData, setnameData] = useState<any>([]);
  // 🔹 Get all medicines (current stock)
  const getAllMeds = async () => {
    try {
      const res = await axios.get(`${URL}/daily-sales`);
      setList(res.data.dailysales);
    } catch (error) {
      console.log(error);
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (stockDate) {
      let formatedDate = stockDate.split("-").reverse().join("/");
      const Data = medsList.filter((item: any) => item.date == formatedDate);

      setDateData(Data);
    }
   if (medName) {
  const Data2 = medsList
    .map((day: any) => {
      const filteredProducts = day.products.filter((p: any) =>
        p.productname.toLowerCase().includes(medName.toLowerCase())
      );

      if (filteredProducts.length > 0) {
        return {
          ...day,
          products: filteredProducts, // only matched products
        };
      }

      return null;
    })
    .filter(Boolean); // remove nulls

  setnameData(Data2);
}
  };

  const handleReset = () => {
    setDateData([]);
    setnameData([]);
    setStockDate("");
    setMedName("");
    getAllMeds();
  };

  return (
    <div className="meds-list">
      <h1>Inventory</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Medicine Name"
          value={medName}
          onChange={(e) => setMedName(e.target.value)}
        />
        <input
          type="date"
          value={stockDate}
          onChange={(e) => setStockDate(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="reset" onClick={handleReset}>
          Clear
        </button>
      </form>

      {/* 🔥 DEFAULT CURRENT STOCK TABLE */}

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
          {dateData.length > 0 &&
            dateData.map((e: any) =>
              e.products.map((item: any, num: number) => (
                <tr key={num}>
                  <td>{e.date}</td>
                  <td>{item.companyName}</td>
                  <td>{item.productname}</td>
                  <td>{item.openingstock}</td>
                  <td>{item.sold}</td>
                  <td>{item.closingstock}</td>
                </tr>
              )),
            )}
          {nameData.length > 0 &&
            nameData.map((name: any) =>
              name.products.map((pro: any, num: number) => (
                <tr key={num}>
                  <td>{name.date}</td>
                  <td>{pro.companyName}</td>
                  <td>{pro.productname}</td>
                  <td>{pro.openingstock}</td>
                  <td>{pro.sold}</td>
                  <td>{pro.closingstock}</td>
                </tr>
              ))
            )}
          {(dateData.length === 0 && nameData.length === 0 )  &&
            medsList?.map((day: any, index: number) =>
              day.products?.map((item: any, num: number) => (
                <tr key={`${index}-${num}`}>
                  <td>{day.date}</td>
                  <td>{item.companyName}</td>
                  <td>{item.productname}</td>
                  <td>{item.openingstock}</td>
                  <td>{item.sold}</td>
                  <td>{item.closingstock}</td>
                </tr>
              )),
            )}
        </tbody>
      </table>

      <button className="download-btn" onClick={downloadExcel}>
        <LiaDownloadSolid />
        Download
      </button>
    </div>
  );
};

export default MedsList;
