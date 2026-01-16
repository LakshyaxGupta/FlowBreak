importScripts("utils.js");

let sessionId = null;
let userEmail = null;

// Load saved session/email
chrome.storage.local.get(["sessionId", "email"], (data) => {
  sessionId = data.sessionId || crypto.randomUUID();
  userEmail = data.email || "test@flowbreak.com";

  chrome.storage.local.set({
    sessionId,
    email: userEmail,
  });
});

// Detect tab switch
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  if (!tab.url) return;

  const domain = extractDomain(tab.url);

  const event = {
    event_type: "TAB_SWITCH",
    domain,
    timestamp: new Date().toISOString(),
  };

  sendEvent(event);
});

async function sendEvent(event) {
  try {
    await fetch("http://localhost:3001/api/ingest/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        sessionId,
        events: [event],
      }),
    });
  } catch (err) {
    console.error("Failed to send event", err);
  }
}
