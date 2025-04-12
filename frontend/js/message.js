function sendMessage() {
    const messageBox = document.getElementById("chat-box");
    const usernameInput = document.getElementById("username");
    const messageInput = document.getElementById("message-input");
  
    const name = usernameInput.value.trim();
    const message = messageInput.value.trim();
  
    if (name && message) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message";
      msgDiv.innerHTML = `<div class="name">${name}</div>${message}`;
  
      messageBox.appendChild(msgDiv);
      messageInput.value = "";
      messageBox.scrollTop = messageBox.scrollHeight;
    }
  }