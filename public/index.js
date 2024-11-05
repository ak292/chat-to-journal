document.addEventListener("DOMContentLoaded", function () {
  const whatsappForm = document.getElementById("whatsappForm");
  const messengerForm = document.getElementById("messengerForm");
  const notificationDiv = document.getElementById("notification");

  whatsappForm.addEventListener("submit", function (event) {
    event.preventDefault();
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
          localStorage.setItem("journalEntry", JSON.stringify(data.results));
          notificationDiv.textContent = "Upload successful!";
          notificationDiv.style.color = "green";
        } else {
          notificationDiv.textContent = "Upload failed!";
          notificationDiv.style.color = "red";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        notificationDiv.textContent = "Upload failed!";
        notificationDiv.style.color = "red";
      });
  }
});
