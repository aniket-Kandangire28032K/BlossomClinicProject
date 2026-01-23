import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const StockUpdate = () => {
  const URL = import.meta.env.VITE_Backend_URL;
    const [medName,setMedName]=useState('');
    const [stock,setStock]=useState('');

    const hnadleSubmit= async (e:any) => {
        e.preventDefault();
        try {
            axios.put(`${URL}/medicine/stock`,{
                medicinename:medName,stock:stock
            })
            toast.success('Medicine Stock Updated')
        } catch (error) {
            console.log(error)
            toast.error('Error in Updating Stock')
        }
    }
  return (
    <div className="stock">
      <form onSubmit={hnadleSubmit}>
      <h1>Update Stock</h1>
        <div className="inputfield">
          <input type="text" id="name" placeholder=" " onChange={e=> setMedName(e.target.value)}/>
          <label htmlFor="name">Enter Medicine name</label>
        </div>
        <div className="inputfield">
          <input type="text" id="stock" placeholder=" " onChange={e=> setStock(e.target.value)}/>
          <label htmlFor="stock">stock</label>
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
