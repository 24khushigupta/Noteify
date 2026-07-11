import axios from "axios";

const API = axios.create({
  baseURL: " https://noteify-bvnp.onrender.com",
});

export default API;