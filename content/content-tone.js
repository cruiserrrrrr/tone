const getTokenFromStorage = () => {
  return new Promise((resolve) => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get(["token"], (result) => {
        resolve(result.token || null);
      });
    } else {
      resolve(null);
    }
  });
};

const verifyTokenWithApi = async (token) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "verifyToken",
        token,
      },
      (response) => {
        resolve(response || { authorized: false });
      },
    );
  });
};

const generateText = async (conversationJSON) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "generateAI",
        prompt: JSON.stringify(conversationJSON),
      },
      (response) => {
        resolve(response);
      },
    );
  });
};

const checkAuth = async () => {
  const token = await getTokenFromStorage();
  console.log("token", token);
  if (!token) {
    return { authorized: false };
  }
  return await verifyTokenWithApi(token);
};

let authStatus = { authorized: false };
let isCheckingAuth = false;

const checkAuthOnce = async () => {
  if (isCheckingAuth) return;
  isCheckingAuth = true;
  authStatus = await checkAuth();
  console.log("Initial auth check status:", authStatus);
  isCheckingAuth = false;
};

const injectToneButton = async () => {
  if (!authStatus.authorized) return;

  const container = document.querySelector(
    '.new-message-wrapper.rows-wrapper-row[data-offset="commands"]',
  );

  if (container && !container.querySelector(".tone-toggle")) {
    const button = document.createElement("div");
    button.className = "btn-icon btn-menu-toggle tone-toggle";
    button.innerHTML = `<span class="tone-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap">
          <defs>
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="white" stop-opacity="1" />
              <stop offset="50%" stop-color="#a5b4fc" stop-opacity="1" />
              <stop offset="100%" stop-color="white" stop-opacity="1" />
            </linearGradient>
          </defs>
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
      </span>`;

    button.addEventListener("click", async (e) => {
      e.stopPropagation();

      if (button.classList.contains("is-loading")) return;

      console.log("Tone button clicked");

      // Получаем все сообщения клиента (входящие сообщения)
      const incomingBubbles = Array.from(
        document.querySelectorAll(".bubble.is-in"),
      );

      // Берём последние два
      const lastTwo = incomingBubbles.slice(-2);

      // Извлекаем текст сообщений
      const clientMessages = lastTwo.map((bubble) => {
        const span = bubble.querySelector(".translatable-message");
        return span ? span.textContent.trim() : "";
      });

      // Формируем JSON
      const conversationJSON = {
        conversation: {
          user_instruction: {
            tone: "дружелюбный, спокойный, информативный",
            goal: "Дать информацию и успокоить пользователя",
          },
          chat_history: clientMessages.map((message) => ({
            from: "client",
            message: message,
          })),
        },
      };

      console.log(conversationJSON);

      if (clientMessages.length > 0) {
        button.classList.add("is-loading");
        container.classList.add("is-loading");

        try {
          const result = await generateText(conversationJSON);
          console.log("AI result:", result);
          if (result && result.response) {
            const inputDiv = document.querySelector(
              '.input-message-input[contenteditable="true"]',
            );
            if (inputDiv) {
              inputDiv.innerText = result.response;
              inputDiv.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        } catch (error) {
          console.error("Error generating text:", error);
        } finally {
          button.classList.remove("is-loading");
          container.classList.remove("is-loading");
        }
      }
    });

    container.appendChild(button);
  }

  // const inputDiv = document.querySelector('.input-message-input[contenteditable="true"]');
  // const generatedText = "Привет, это ответ от Tone!";
  //
  // if (inputDiv) {
  //     // очищаем текущее содержимое (по желанию)
  //     inputDiv.innerText = "";
  //
  //     // создаём текстовый узел
  //     const textNode = document.createTextNode(generatedText);
  //     inputDiv.appendChild(textNode);
  //
  //     // ставим курсор в конец
  //     const range = document.createRange();
  //     const sel = window.getSelection();
  //     range.setStart(inputDiv, 1);
  //     range.collapse(true);
  //     sel.removeAllRanges();
  //     sel.addRange(range);
  //
  //     // событие input
  //     inputDiv.dispatchEvent(new Event('input', { bubbles: true }));
  // }
};

window.addEventListener("message", (event) => {
  // Проверяем, что сообщение пришло от нашего сайта (опционально можно добавить проверку origin)
  if (event.data && event.data.type === "SEND_TOKEN") {
    const { token, user } = event.data;
    if (token) {
      chrome.runtime.sendMessage(
        {
          type: "saveToken",
          token,
          user,
        },
        (response) => {
          console.log("Token transfer status:", response);
        },
      );
    }
  }
});

const init = async () => {
  await checkAuthOnce();
  const observer = new MutationObserver(injectToneButton);
  observer.observe(document.body, { childList: true, subtree: true });
  injectToneButton();
};

init();
