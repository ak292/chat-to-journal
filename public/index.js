document.addEventListener("DOMContentLoaded", function () {
  const whatsappForm = document.getElementById("whatsappForm");
  const messengerForm = document.getElementById("messengerForm");
  const notificationDiv = document.getElementById("notification");

  whatsappForm.addEventListener("submit", function (event) {
    event.preventDefault();
    notificationDiv.style.color = "green";
    notificationDiv.textContent = "Loading...";
    const formData = new FormData(whatsappForm);
    uploadFile(formData, "whatsapp");
  });

  messengerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    notificationDiv.style.color = "green";
    notificationDiv.textContent = "Loading...";
    const formData = new FormData(messengerForm);
    uploadMessengerFile(formData);
  });

  function uploadFile(formData, type) {
    console.log(formData);
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
        notificationDiv.textContent = "Upload failed!";
        notificationDiv.style.color = "red";
      });
  }

  function uploadMessengerFile(formData) {
    console.log(formData);
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
        notificationDiv.textContent = "Upload failed!";
        notificationDiv.style.color = "red";
      });
  }

  function handleResponse(data, type) {
    if (data.success) {
      console.log(typeof data.results);
      console.log(data.results);

      let newData = JSON.parse(data.results);
      let existingEntries = JSON.parse(localStorage.getItem("journalEntry")) || [];

      existingEntries = existingEntries.concat(newData);
      localStorage.setItem("journalEntry", JSON.stringify(existingEntries));

      console.log("Updated Entries:", existingEntries);
      notificationDiv.textContent =
        "Upload successful! Please wait a second or two to see reflected changes in journal entries";
      notificationDiv.style.color = "green";
    } else {
      notificationDiv.textContent = "Upload failed!";
      notificationDiv.style.color = "red";
    }
    setTimeout(() => {
      notificationDiv.textContent = "";
    }, 5000);
  }
});
