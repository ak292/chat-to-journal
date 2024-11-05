let journalContent = localStorage.getItem("journalEntry");
console.log(journalContent);

if (journalContent) {
  journalContent = JSON.parse(journalContent);

  const journalDiv = document.getElementById("journalContent");

  journalDiv.innerHTML = "";

  const groupedEntries = {};

  journalContent.forEach((entry) => {
    const [date, ...content] = entry.split(":");
    const entryText = content.join(":").trim();

    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }

    groupedEntries[date].push(entryText);
  });

  for (const date in groupedEntries) {
    const entryElement = document.createElement("div");
    entryElement.classList.add("item");

    const entryDate = document.createElement("h2");
    entryDate.textContent = date;
    entryElement.appendChild(entryDate);

    const combinedContent = groupedEntries[date].join(" ");

    const entryContent = document.createElement("p");
    entryContent.textContent = combinedContent;
    entryElement.appendChild(entryContent);

    journalDiv.appendChild(entryElement);
  }
}

document.getElementById("resetButton").addEventListener("click", function () {
  const confirmation = confirm(
    "Are you sure you want to reset your journal? This action cannot be undone."
  );

  if (confirmation) {
    localStorage.removeItem("journalEntry");

    const journalDiv = document.getElementById("journalContent");
    journalDiv.innerHTML = "";

    alert("Journal has been reset!");
  }
});
