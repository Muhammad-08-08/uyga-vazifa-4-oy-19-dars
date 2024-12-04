document.addEventListener("DOMContentLoaded", () => {
    let item = document.querySelector(".item");
    let forma = document.querySelector(".forma");
  
    let changeName = document.querySelector(".change_name");
  
    let senderName = localStorage.getItem("senderName") || "Change Name";
  
    changeName.textContent = senderName;
  
    changeName.addEventListener("click", () => {
      let newName = prompt("Yangi ismingizni kiriting:");
      if (newName) {
        senderName = newName;
        localStorage.setItem("senderName", senderName);
        changeName.textContent = senderName;
      }
    });
  
    async function getData() {
      try {
        const response = await fetch("http://localhost:3000/messages");
        const data = await response.json();
  
        data.forEach((message) => {
          renderMessage(message);
        });
      } catch (error) {
        console.log("Ma'lumotni olishda xatolik:", error);
      }
    }
  
    async function postData(message) {
      try {
        const response = await fetch("http://localhost:3000/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
  
        if (!response.ok) {
          throw new Error("Ma'lumotni yuborishda xatolik");
        }
  
        const data = await response.json();
        renderMessage(data);
      } catch (error) {
        console.log("POST xatosi:", error);
      }
    }
  
    function renderMessage(message) {
      let card = document.createElement("div");
      card.classList.add("bg-gray-100", "p-4", "rounded-md", "mb-4", "shadow-md");
  
      let sender = document.createElement("p");
      sender.classList.add("font-bold", "text-blue-600");
      sender.textContent = message.sender;
  
      let messageText = document.createElement("p");
      messageText.classList.add("text-gray-700");
      messageText.textContent = message.message;
  
      let timestamp = document.createElement("p");
      timestamp.classList.add("text-sm", "text-gray-400");
      timestamp.textContent = new Date(message.timestamp).toLocaleString();
  
      card.append(sender, messageText, timestamp);
      item.append(card);
    }
  
    forma.addEventListener("submit", (e) => {
      e.preventDefault();
  
      let inputField = forma.querySelector("input");
      if (inputField.value.trim() !== "") {
        let newMessage = {
          sender: senderName,
          message: inputField.value.trim(),
          timestamp: new Date().toISOString(),
        };
  
        postData(newMessage);
        inputField.value = ""; 
      }
    });
  
    getData();
  });
  