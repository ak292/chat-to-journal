document.addEventListener("DOMContentLoaded", function () {
  const whatsappForm = document.getElementById("whatsappForm");
  const messengerForm = document.getElementById("messengerForm");
  const notificationDiv = document.getElementById("notification");
  const notificationMessenger = document.getElementById("notification-messenger");

  whatsappForm.addEventListener("submit", function (event) {
    event.preventDefault();
    notificationDiv.style.color = "green";
    notificationDiv.textContent = "Loading...";

    const formData = new FormData(whatsappForm);
    const username = document.getElementById("whatsapp-input").value.trim();

    if (username !== "") {
      formData.set("username", username);
    } else {
      console.log("WhatsApp username is empty or invalid");
    }

    uploadFile(formData, "whatsapp");
  });

  messengerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    notificationMessenger.style.color = "green";
    notificationMessenger.textContent = "Loading...";

    const formData = new FormData(messengerForm);
    const username = document.getElementById("messenger-input").value.trim();

    if (username !== "") {
      formData.set("username", username);
    } else {
      console.log("Messenger username is empty or invalid");
    }

    uploadMessengerFile(formData);
  });

  function uploadFile(formData, type) {
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        handleResponse(data, type);
      })
      .catch((error) => {
        console.error("Error:", error);
        notificationDiv.textContent =
          "Upload failed! Please make sure it is a valid .txt file exported directly from WhatsApp/Messenger (formatting matters)";
        notificationDiv.style.color = "red";
      });
  }

  function uploadMessengerFile(formData) {
    fetch("/uploadMessenger", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        handleResponse(data, "messenger");
      })
      .catch((error) => {
        console.error("Error:", error);
        notificationMessenger.textContent = "Upload failed!";
        notificationMessenger.style.color = "red";
      });
  }

  function handleResponse(data, type) {
    const notification = type === "whatsapp" ? notificationDiv : notificationMessenger;

    if (data.success) {
      let newData = JSON.parse(data.results);
      let existingEntries = JSON.parse(localStorage.getItem("journalEntry")) || [];

      existingEntries = existingEntries.concat(newData);
      localStorage.setItem("journalEntry", JSON.stringify(existingEntries));

      notification.textContent =
        "Upload successful! Please wait a second or two to see reflected changes in journal entries";
      notification.style.color = "green";

      if (type === "whatsapp") {
        document.getElementById("whatsapp-input").value = "";
        document.getElementById("whatsappForm").reset();
      } else if (type === "messenger") {
        document.getElementById("messenger-input").value = "";
        document.getElementById("messengerForm").reset();
      }
    } else {
      notification.textContent =
        "Upload failed! Please make sure it is a valid .txt file exported directly from WhatsApp/Messenger (formatting matters)";
      notification.style.color = "red";
    }

    setTimeout(() => {
      notification.textContent = "";
    }, 5000);
  }
});
