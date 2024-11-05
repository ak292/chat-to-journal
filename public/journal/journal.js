const journalContent = localStorage.getItem("journalEntry");

let journalData;
if (journalContent) {
  journalData = JSON.parse(journalContent);
} else {
  journalData = { journal_entries: {} };
}

function displayJournalEntries(journalData) {
  const journalContentElement = document.getElementById("journalContent");
  journalContentElement.innerHTML = "";

  const entries = journalData.journal_entries;

  for (const date in entries) {
    if (entries.hasOwnProperty(date)) {
      const entry = entries[date];

      const entryElement = document.createElement("div");
      entryElement.classList.add("journal-entry");

      entryElement.innerHTML = `<strong>${date}</strong><br>${entry}<br><hr>`;

      journalContentElement.appendChild(entryElement);
    }
  }
}

displayJournalEntries(journalData);
