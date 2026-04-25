import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authActions';

function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("user");
const navigate = useNavigate();
const dispatch = useDispatch();

const handleRegister = async (e) => {

e.preventDefault();

try{

const res = await axios.post("http://localhost:5000/api/register",{
name,
email,
password,
role
}, { withCredentials: true });

if (res.data.success) {
  dispatch(login(res.data.user));
  alert("Registered Successfully");
  navigate("/dashboard");
} else {
  alert(res.data.message);
}

}catch(error){

alert("Error registering user");

}

};

return(

<div className="register-container">

<div className="register-box">

<h2>Register 🌱</h2>

<form onSubmit={handleRegister}>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
className="role-select"
>
<option value="user">User</option>
<option value="admin">Admin</option>
</select>

<button type="submit">Register</button>

</form>

</div>

</div>

);

}

export default Register;