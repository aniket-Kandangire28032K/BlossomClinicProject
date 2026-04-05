import axios from "axios";
import { useEffect, useState } from "react";

const Inventory = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [products, setProducts] = useState([]);
//   const [display, setDisplay] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<any>({});
  const date = new Date().toLocaleDateString("in-gb");
  const today = `${String(new Date(date).getDate()).padStart(2, "0")}/${String(new Date(date).getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`;
  const getProducts = async () => {
    try {
      const res = await axios.get(`${URL}/medicine`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
//   const handleChange = (e: any) => {
//     const [name, value] = e.target;

//     setSelectedProduct((prev: any) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleEdit = (product: any) => {
//     setSelectedProduct(product);
//     setDisplay("edit");
//   };
//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     console.log(selectedProduct);
//   };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="invnetorypage">
      <h1>Products</h1>
      <h3>Date:{today}</h3>
      {/* {display === "edit" && (
        <div className="edit-form">
          <form onSubmit={handleSubmit}>
            <h3>Updat Stock</h3>
            <div>
                <label htmlFor="">Company Name</label>
              <input
                type="text"
                name="companyname"
                
                value={selectedProduct?.companyname}
                onChange={handleChange}
              />
            </div>
            <div>
                <label htmlFor="">Product Name</label>
              <input
                type="text"
                name="medicinename"
                
                value={selectedProduct?.medicinename}
                onChange={handleChange}
              />
            </div>
            <div>
                <label htmlFor="">MR Name</label>
              <input
                type="text"
                name="mrname"
                
                value={selectedProduct?.mrname}
                onChange={handleChange}
              />
            </div>
            <div>
                <label htmlFor="">Stock</label>
              <input
                type="number"
                name="stock"
                
                value={selectedProduct?.stock}
                onChange={handleChange}
              />
            </div>
            <div>
                <label htmlFor="">Unit Price</label>
              <input
                type="number"
                name="unitprice"
                
                value={selectedProduct?.unitprice}
                onChange={handleChange}
              />{" "}
            </div>
            <div>
                <label htmlFor="">Total Price</label>
              <input
                type="number"
                name="totalprice"
                
                value={selectedProduct?.totalprice}
                onChange={handleChange}
              />{" "}
            </div>
            <div>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setDisplay("")}>
                Close
              </button>
            </div>
          </form>
        </div>
      )} */}
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
          {products.length > 0 &&
            products.map((product: any) => (
              <tr key={product._id}>
                <td>{product.companyname}</td>
                <td>{product.medicinename}</td>
                <td style={{ textTransform: "capitalize" }}>
                  {product.mrname}
                </td>
                <td>{product.stock}</td>
                <td>{product.unitprice}</td>
                <td>
                  {product.totalprice}
                  {/* <button type="button" onClick={() => handleEdit(product)}>
                    Edit
                  </button> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
