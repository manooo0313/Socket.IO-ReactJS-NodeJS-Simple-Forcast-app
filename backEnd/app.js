const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use (index);

const server = http.createServer(app);

const io = socketIo(server);

const getApiEmit = async socket => {
    try {
        const res = await axios.get(
            "https://api.darksky.net/forecast/e25242460c4655ea47347c6395daa947/37.8267,-122.4233"
        );
        socket.emit("FromAPI", res.data.currently.temperature);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};




io.on("connection", socket => {
    console.log("New Client connected"), setInterval(
        () => getApiEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});


// let interval;
// io.on("connection", socket => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getApiAndEmit(socket), 10000);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

server.listen(port, () => console.log(`listening on ${port}`));
