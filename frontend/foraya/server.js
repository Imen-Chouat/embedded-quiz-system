// server.js
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins (for development)
});

io.on("connection", (socket) => {
  console.log("📡 A student device connected");

  // Example: Emit a quiz notification after 5 seconds
  setTimeout(() => {
    socket.emit("quizAvailable", {
      title: "Quiz 01 : Classes and Objects",
      id: "quiz-123",
    });
  }, 5000);
});

server.listen(3000, () => {
  console.log("🚀 Socket server is running on port 3000");
});
