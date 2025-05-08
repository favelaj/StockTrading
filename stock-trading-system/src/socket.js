// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://3.90.131.54:4000"; // Replace with backend URL
const socket = io(SOCKET_URL);

export default socket;
