const express = require("express");
const blogRouter = require("./blogRouter");

const server = express();

server.use(express.json());
server.use("/api/posts", blogRouter);

server.get("/", (req, res) => {
	res.status(200).send("THE SERVER IS WORKING");
});

module.exports = server;
