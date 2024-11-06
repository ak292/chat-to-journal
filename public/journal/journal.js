let journalContent = localStorage.getItem("journalEntry");

if (journalContent) {
  journalContent = JSON.parse(journalContent);

  const journalDiv = document.getElementById("journalContent");
  journalDiv.innerHTML = "";

  function getDayOfWeek(day, month, year) {
    const date = new Date(year, month - 1, day);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  }

  function formatDate(dateString) {
    const [day, month, year] = dateString.split("/");

    const dayOfWeek = getDayOfWeek(day, month, year);

    return `${dayOfWeek}, ${day}/${month}/${year}`;
  }

  const parsedEntries = journalContent.map((entry) => {
    const [date, ...content] = entry.split(":");
    const entryText = content.join(":").trim();

    return { date: date, content: entryText };
  });

  parsedEntries.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateB - dateA;
  });

  const groupedEntries = {};

  parsedEntries.forEach(({ date, content }) => {
    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }

    groupedEntries[date].push(content);
  });

  for (const date in groupedEntries) {
    const entryElement = document.createElement("div");
    entryElement.classList.add("item");

    const entryDate = document.createElement("h2");
    const formattedDate = formatDate(date);
    entryDate.textContent = formattedDate;
    entryElement.appendChild(entryDate);

    const combinedContent = groupedEntries[date].join("<br><br>");

    const entryContent = document.createElement("p");
    entryContent.innerHTML = combinedContent;
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
