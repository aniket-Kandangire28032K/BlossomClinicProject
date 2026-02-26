import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StockUpdate = () => {
  const URL = import.meta.env.VITE_Backend_URL;
    const [medName,setMedName]=useState('');
    const [stock,setStock]=useState('');
    const [companyname,setCompanyName]=useState("")
    const [meds,setMeds] = useState([])
    const [products,setProducts] = useState([])
    const getMeds = async()=>{
      try {
        const res = await axios.get(`${URL}/medicine`);
      let list:any = [...new Map(res.data.map((user:any) => [user.companyname,user])).values()];
      setMeds(list);
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      getMeds()
    },[])

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
    useEffect(()=>{
    if(companyname){
      setProducts(()=> (
        meds.filter((item:any)=> item.companyname === companyname)
      ))
    }
  },[companyname])
  return (
    <div className="stock">
      <form onSubmit={hnadleSubmit} autoComplete="off"> 
      <h1>Update Stock</h1>
        <div className="inputfield">
        <select name="companyname" value={companyname} onChange={e=> setCompanyName(e.target.value)}>
          <option value="">Company Name</option>
           {
             meds.map((item:any)=>(
              <option key={item._id} value={item.companyname}>{item.companyname}</option>
             ))
           }
        </select> 
        </div>
        <div className="inputfield">
        <select value={medName} onChange={e => setMedName(e.target.value)}>
           <option value="">Product</option>
           {
            products.map((item:any,num:number)=>(
              <option key={num} value={item.medicinename}>{item.medicinename}</option>
            ))
           }
        </select></div>
        <div className="inputfield">
          <input type="text" id="stock" placeholder=" " onChange={e=> setStock(e.target.value)}/>
          <label htmlFor="stock">Stock</label>
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
