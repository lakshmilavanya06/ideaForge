
function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const userMessage = input.value.trim();
    if (userMessage === "") return;

    const userDiv = document.createElement("div");
    userDiv.className = "message user";
    userDiv.innerText = userMessage;
    chatBox.appendChild(userDiv);

    input.value = "";

    setTimeout(() => {
      const botDiv = document.createElement("div");
      botDiv.className = "message bot";
      botDiv.innerText = "I'm processing your request...";
      chatBox.appendChild(botDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    chatBox.scrollTop = chatBox.scrollHeight;
  }
