import io from "socket.io-client";
import * as APIs from "utils/APIs/APICenter.js";

export const GetChatSocket = () => {
    const socket = io(APIs.GetHostWS(), {
        auth: {
            token: localStorage.getItem("jwt"),
        },
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });

    socket.on("error", (error) => {
        console.error("Error:", error);
    });
    return socket
};