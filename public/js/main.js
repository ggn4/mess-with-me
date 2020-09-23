const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const userDropdown = document.getElementById("users-dropdown");
const roomNameMinimize = document.getElementById("room-name-minimize");

// Get username and room from url by using Qs cdn
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the text message
  const msg = event.target.elements.msg.value;
  // Emit the message
  socket.emit("chatMessage", msg);

  // clear message input
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerHTML = room;
  roomNameMinimize.innerHTML = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
     ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
  userDropdown.innerHTML = `
       ${users.map((user) => `<option>${user.username}</option>`).join("")}
      `;
}
