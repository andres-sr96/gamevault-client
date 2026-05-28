import axios from "axios";

const rawgApi = axios.create({
  baseURL: "https://api.rawg.io/api",
});

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export default rawgApi;