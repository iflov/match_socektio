const socket = io('/robin');
const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const userName = prompt('What is your name');
  socket.emit('helloUser', userName, (data) => drawHelloStranger(data));
}

// * global socket handler
socket.on('userConnect', (username) => {
  drawNewChat(`${username} connected!`);
});
socket.on('new_chat', (data) => {
  const { message, username } = data;
  drawNewChat(`${username}: ${message}`);
});

//* 그리기 함수
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
  <div>
  ${message}
  </div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

//* event function
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    // * 화면 그리기
    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}

init();
