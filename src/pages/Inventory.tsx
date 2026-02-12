import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"

const Inventory = () => {
    const URL = import.meta.env.VITE_Backend_URL;
    const [formData,setFormData]=useState({
        medicinename:'',
        mrname:'',
        batchno:'',
        expiredate:'',
        stock:'',
        unitprice:'',
        totalprice:'',
    })

    const handleChange=(e:any)=>{
        const {id,value}=e.target;
        if(id === "expiredate" ){
            const [year, month,day] = value.split("-")
            setFormData({
                ...formData,
                expiredate:`${day}/${month}/${year}`
            })
            return
        }
        setFormData({
            ...formData,
            [id]:value
        })
    }
    const handlesubmit=async(e:any)=>{
        e.preventDefault()
        try {
            await axios.post(`${URL}/medicine`,formData)
            toast.success('Medicine added')
        } catch (error) {
            console.log(error);
            toast.error('Internal Server Error');
        }
    }
    return (
    <div className="invnetorypage">
        <form onSubmit={handlesubmit}>
            <h1>Medicine Form</h1>
            <div className="inputfield">
                <input type="text" placeholder="" id="medicinename" onChange={handleChange}/>
                <label htmlFor="medicinename">Medicine Name</label>
            </div>
            <div className="inputfield">
                <input type="text" placeholder="" id="mrname" onChange={handleChange}/>
                <label htmlFor="mrname">MR Name</label>
            </div>
            <div className="inputfield">
                <input type="text" placeholder="" id="batchno" onChange={handleChange}/>
                <label htmlFor="batchno">Batch No.</label>
            </div>
            <div className="inputfield">
                <input type="date" placeholder="" id="expiredate" onChange={handleChange}/>
                <label htmlFor="expiredate">Expiry Date</label>
            </div>
            <div className="inputfield">
                <input type="text" placeholder="" id="stock" onChange={handleChange}/>
                <label htmlFor="stock">Stock Qty</label>
            </div>
            <div className="inputfield">
                <input type="text" placeholder="" id="unitprice" onChange={handleChange}/>
                <label htmlFor="unitprice">Unit Price</label>
            </div>
            <div className="inputfield">
                <input type="text" placeholder="" id="totalprice" onChange={handleChange}/>
                <label htmlFor="totalprice">Total Value</label>
            </div>
            <button type="submit">Submit</button>
            <button type='reset'>Clear</button>
        </form>
    </div>
  )
}

export default Inventory