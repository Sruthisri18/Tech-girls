const shareBtn = document.getElementById('whatsappShare');
const shareCountDisplay = document.getElementById('shareCount');
const shareCompleteMsg = document.getElementById('shareCompleteMsg');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('registrationForm');
const successMsg = document.getElementById('successMsg');

let clickCount = localStorage.getItem("clickCount") || 0;
clickCount = parseInt(clickCount);

updateShareCount();

shareBtn.addEventListener("click", () => {
  if (clickCount >= 5) return;

  clickCount++;
  localStorage.setItem("clickCount", clickCount);
  updateShareCount();

  const msg = encodeURIComponent("https://chat.whatsapp.com/F7sSIbjmevUA9hUSFF0YyP"
   );
  const waLink = `https://wa.me/?text=${msg}`;
  window.open(waLink, '_blank');
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (clickCount < 5) {
    alert("Please complete sharing on WhatsApp (5/5)");
    return;
  }

  const formData = new FormData(form);
  const file = formData.get("screenshot");

  // Upload file to Google Drive via Apps Script
  const uploadResponse = await fetch("YOUR_APPS_SCRIPT_FILE_UPLOAD_URL", {
    method: "POST",
    body: formData
  });
  const result = await uploadResponse.json();

  // Then send rest of data to Google Sheet
  await fetch("YOUR_APPS_SCRIPT_SHEET_URL", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      college: formData.get("college"),
      fileUrl: result.fileUrl
    })
  });

  localStorage.setItem("formSubmitted", true);
  form.reset();
  form.querySelectorAll("input, button").forEach(el => el.disabled = true);
  successMsg.classList.remove("hidden");
});

function updateShareCount() {
  shareCountDisplay.textContent = `Click count: ${clickCount}/5`;
  if (clickCount >= 5) {
    shareCompleteMsg.classList.remove("hidden");
    shareBtn.disabled = true;
  }
}

// Disable form if already submitted
if (localStorage.getItem("formSubmitted")) {
  form.querySelectorAll("input, button").forEach(el => el.disabled = true);
  successMsg.classList.remove("hidden");
}
