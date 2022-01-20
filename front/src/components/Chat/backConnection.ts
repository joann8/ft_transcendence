import axios, { Axios } from "axios";

const back = axios.create({ withCredentials: true });
export default back;
