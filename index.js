const express = require("express");
require("express-async-errors");
require("dotenv").config();
const socket = require("socket.io");
const http = require("http");
const { connect } = require("mongoose");
const ErrorHandler = require("./middleware/ErrorHandler");
const notFound = require("./middleware/NotFound");
const router = require("./Routes/Auth");
const app = express();
const server = http.createServer(app);
const port = 5000;

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json("What is not happening");
});
app.use("/api/v1/auth", router);
app.use(notFound);
app.use(ErrorHandler);

const start = async() => {
    try {
        await connect(
            "mongodb+srv://Rightson:Rightson@nodeexpressproject.afbca.mongodb.net/Janta?retryWrites=true&w=majority"
        );
        console.log(`runnning on port ${port}`);
    } catch (e) {
        console.log(e);
    }
};
let users = [];
const handleUser = (_id, id) => {
    !users.some((user) => user._id === _id) && users.push({ _id, id });
};

server.listen(port, start);

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
io.on("connection", (socket) => {
    socket.on("new", (data) => {
        handleUser(data, socket.id);
        socket.broadcast.emit("users", users);
    });
    socket.on("disconnect", () => {
        users = users.filter((user) => user.id !== socket.id);

        socket.broadcast.emit("users", users);
    });
    socket.on("msg", (data) => {
        const user = users.find(({ _id }) => _id === data._id);
        if (!user) return;
        socket.to(user.id).emit("msgs", data);
    });
});