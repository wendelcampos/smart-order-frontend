import axios from "axios"

export const api = axios.create({
  baseURL: "https://smart-order-v2-api.onrender.com",
})