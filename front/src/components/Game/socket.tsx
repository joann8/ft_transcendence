import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3001/game");

/* {
	//reconnectionDelayMax: 10000,
*/
export default socket