import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StockUpdate = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [medName, setMedName] = useState("");
  const [stock, setStock] = useState(0);
  const [rate, setRate] = useState(null);
  const [companyname, setCompanyName] = useState("");
  const [meds, setMeds] = useState([]);
  const [products, setProducts] = useState([]);

  const getMeds = async () => {
    try {
      const res = await axios.get(`${URL}/medicine`);
      let list: any = [
        ...new Map(
          res.data.map((user: any) => [user.companyname, user]),
        ).values(),
      ];
      setMeds(list);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMeds();
  }, []);

  
  useEffect(() => {
    if (companyname) {
      setProducts(() =>
        meds.filter((item: any) => item.companyname === companyname),
      );
    }
  }, [companyname]);

  const handleSubmit = async (e: any) => {
  e.preventDefault(); // Prevent form from refreshing the page

  if (!medName || !companyname) {
    toast.error("Please select company and product");
    return;
  }
  try {
    const body: any = {
      companyname:companyname,
      medicinename: medName,
      stock: Number(stock),
    };
    // Include unitprice only if the user entered a value
    if (rate !== null && rate !== "") {
      body.unitprice = Number(rate);
    }
    // console.log(body)
    // Make PUT request to update stock
    const res = await axios.put(`${URL}/medicine/stock-update`, body);
    toast.success(res.data.message || "Stock updated successfully");
   console.log(res.data)
   
  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error updating stock");
  }finally{
     setMedName("");
    setCompanyName("");
    setStock(0);
    setRate(null);
  }
};
  return (
    <div className="stock">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h1>Update Stock</h1>
        <div className="inputfield">
          <select
            name="companyname"
            required
            value={companyname}
            onChange={(e) => setCompanyName(e.target.value)}
          >
            <option value="">Company Name</option>
            {meds.map((item: any) => (
              <option key={item._id} value={item.companyname}>
                {item.companyname}
              </option>
            ))}
          </select>
        </div>
        <div className="inputfield">
          <select
            value={medName}
            required
            onChange={(e) => setMedName(e.target.value)}
          >
            <option value="">Product</option>
            {products.map((item: any, num: number) => (
              <option key={num} value={item.medicinename}>
                {item.medicinename}
              </option>
            ))}
          </select>
        </div>
        <div className="inputfield">
          <input
            type="number"
            id="stock"
            placeholder=" "
            value={stock == 0 ? "" : stock}
            onChange={(e: any) => setStock(e.target.value)}
          />
          <label htmlFor="stock">Stock</label>
        </div>
        <div className="inputfield">
          <input
            type="number"
            id="unitprice"
            placeholder=" "
            value={rate == null ? "" : rate}
            onChange={(e: any) => setRate(e.target.value)}
          />
          <label htmlFor="unitprice">Unit Price</label>
        </div>
        <div className="btg-grp">
          <button type="submit">Update</button>
          <button type="reset">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default StockUpdate;
