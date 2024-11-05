document.addEventListener("DOMContentLoaded", function () {
  const whatsappForm = document.getElementById("whatsappForm");
  const messengerForm = document.getElementById("messengerForm");
  const notificationDiv = document.getElementById("notification");

  whatsappForm.addEventListener("submit", function (event) {
    event.preventDefault();
    notificationDiv.style.color = "green";
    notificationDiv.textContent = "Loading...";
    const formData = new FormData(whatsappForm);
    uploadFile(formData);
  });

  messengerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(messengerForm);
    uploadFile(formData);
  });

  function uploadFile(formData) {
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.results);

          // Parse the new data received
          let newData = JSON.parse(data.results);

          // Retrieve existing entries from localStorage
          let existingEntries = JSON.parse(localStorage.getItem("journalEntry")) || [];

          // Append new entries to existing entries
          existingEntries = existingEntries.concat(newData);

          // Store the updated entries back in localStorage
          localStorage.setItem("journalEntry", JSON.stringify(existingEntries));

          // Optionally, log the updated entries to confirm
          console.log("Updated Entries:", existingEntries);

          // let currentResults = localStorage.getItem("journalEntry");
          // currentResults = JSON.parse(currentResults);

          // localStorage.setItem("journalEntry", data.results);

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
      })
      .catch((error) => {
        console.error("Error:", error);
        notificationDiv.textContent = "Upload failed!";
        notificationDiv.style.color = "red";
      });
  }
});
