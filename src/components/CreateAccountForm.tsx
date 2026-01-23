import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import './Components.css'

const CreateAccountForm = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    contact: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = async (e: any) => {
    // e.prevemtDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.warn("Password Don't match");
      return;
    }

    try {
      const res = await axios.post(`${URL}/users`, formData);
      console.log(res.data);
      toast.success("User Created");
    } catch (error) {
      console.log(error);
      toast.error("Error in Backend Server");
    }
  };
  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <p>Create Account</p>
      <input
        type="text"
        name="name"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        required
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmpassword"
        placeholder="Confirm Password"
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        required
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Contact"
        name="contact"
        maxLength={10}
        onChange={handleChange}
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        required
        onChange={handleChange}
      />
      <div className="btngrp">
      <button type="submit">Submit</button>
      <button type="reset">reset</button>
      </div>
    </form>
  );
};

export default CreateAccountForm;
