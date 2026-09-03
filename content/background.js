importScripts("config.js");

const API_URL = self.TONE_CONFIG.API_URL;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "saveToken") {
    const { token, user } = message;

    chrome.storage.local.set({ token, user }, () => {
      console.log("Token and user data saved to chrome.storage.local");
      sendResponse({ status: "success" });
    });

    return true;
  }

  if (message.type === "verifyToken") {
    fetch(`${API_URL}/auth/check`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${message.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Not authorized");
      })
      .then((data) => {
        sendResponse({ authorized: true, user: data.user });
      })
      .catch((error) => {
        console.error("Verification error:", error);
        sendResponse({ authorized: false });
      });

    return true;
  }

  if (message.type === "generateAI") {
    chrome.storage.local.get(["token"], (result) => {
      if (!result.token) {
        sendResponse({ error: "No token found" });
        return;
      }

      fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${result.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message.prompt, // Это будет наш conversationJSON строкой
        }),
      })
        .then((response) => response.json())
        .then((data) => sendResponse(data))
        .catch((error) => {
          console.error("AI generation error:", error);
          sendResponse({ error: error.message });
        });
    });

    return true;
  }
});
