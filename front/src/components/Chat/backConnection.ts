import axios from "axios";

const back = axios.create({ withCredentials: true });
export default back;
