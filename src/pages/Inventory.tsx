import axios from "axios"
import { useEffect, useState } from "react"

const Inventory = () => {
    
    const URL = import.meta.env.VITE_Backend_URL;
    const [products,setProducts] = useState([])
    const date = new Date().toLocaleDateString('in-gb');
    const today = `${String(new Date(date).getDate()).padStart(2,"0")}/${String(new Date(date).getMonth()+1).padStart(2,"0")}/${new Date().getFullYear()}`
    const getProducts = async () => {
        try {
            const res = await axios.get(`${URL}/medicine`)
            console.log(res.data)
            setProducts(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getProducts();
    },[])
    return (
    <div className="invnetorypage">
        <h1>Products</h1>
        <h3>Date:{today}</h3>
        <table border={1}>
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Product Name</th>
                    <th>MR Name</th>
                    <th>Stock</th>
                    <th>Unit Price</th>
                    <th>total Price</th>
                </tr>
            </thead>
            <tbody>
                { products.length > 0 && products.map((product:any)=>
                    <tr key={product._id}>
                        <td >{product.companyname}</td>
                        <td>{product.medicinename}</td>
                        <td style={{textTransform:"capitalize"}}>{product.mrname}</td>
                        <td>{product.stock}</td>
                        <td>{product.unitprice}</td>
                        <td>{product.totalprice}</td>
                        
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  )
}

export default Inventory