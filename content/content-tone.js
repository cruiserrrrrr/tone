const injectToneButton = () => {
    const container = document.querySelector('.new-message-wrapper.rows-wrapper-row[data-offset="commands"]');

    if (container && !container.querySelector('.tone-toggle')) {
        const button = document.createElement('div');
        button.className = 'btn-icon btn-menu-toggle tone-toggle';
        button.innerHTML = '<span class="tone-button">T</span>';

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Tone button clicked');
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

const observer = new MutationObserver(injectToneButton);
observer.observe(document.body, {childList: true, subtree: true});

injectToneButton();

