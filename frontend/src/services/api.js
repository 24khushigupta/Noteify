import axios from "axios";

const API = axios.create({
  baseURL: "https://noteify-bvnp.onrender.com/api",
});

export default API;