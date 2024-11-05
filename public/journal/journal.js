let journalContent = localStorage.getItem("journalEntry");
console.log(journalContent);

if (journalContent) {
  journalContent = JSON.parse(journalContent);

  const journalDiv = document.getElementById("journalContent");

  // Clear existing entries before adding new ones
  journalDiv.innerHTML = "";

  // Create an object to store grouped entries
  const groupedEntries = {};

  // Loop through the array and group entries by date
  journalContent.forEach((entry) => {
    // Split the entry into date and content
    const [date, ...content] = entry.split(":");
    const entryText = content.join(":").trim(); // Join back content if it has colons

    // Initialize an array for the date if it doesn't exist
    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }

    // Add the content to the respective date
    groupedEntries[date].push(entryText);
  });

  // Loop through the grouped entries and create new elements
  for (const date in groupedEntries) {
    // Create a new div element for each date entry
    const entryElement = document.createElement("div");
    entryElement.classList.add("item"); // Add a class for styling

    // Create and append date element
    const entryDate = document.createElement("h2");
    entryDate.textContent = date; // Set the date text
    entryElement.appendChild(entryDate);

    // Combine the contents for the same date
    const combinedContent = groupedEntries[date].join(" "); // Concatenate entries with a space

    // Create and append content element
    const entryContent = document.createElement("p");
    entryContent.textContent = combinedContent; // Set the content text
    entryElement.appendChild(entryContent);

    // Append the new div to the container
    journalDiv.appendChild(entryElement);
  }
}
