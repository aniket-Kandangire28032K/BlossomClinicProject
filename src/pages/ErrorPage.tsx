import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
const navigate=useNavigate();
  return (
    <div className="errorpage">
        <img className="errorimg" src="/images/errorPageImage.jpg" alt="404 Image" />
        <h2>The page you’re looking for doesn’t exist or has been moved.</h2>
        <div className="btbgrp">
            <button onClick={()=> navigate('/home')}>Home</button>
            <button onClick={()=> navigate('/patientform')}>Patient Form</button>
        </div>
    </div>
  )
}

export default ErrorPage