document.addEventListener("DOMContentLoaded", () => {
    const inputTextArea = document.getElementById('inputText');
    const outputTextArea = document.getElementById('outputText');

    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const symbolCheckbox = document.getElementById('symbols');
    const spaceCheckbox = document.getElementById('space');
    const lineBreakCheckbox = document.getElementById('lineBreak');

    function convertText() {
        let inputText = inputTextArea.value;

        if (uppercaseCheckbox.checked) {
            inputText = inputText.toUpperCase();
        }
        if (lowercaseCheckbox.checked) {
            inputText = inputText.toLowerCase();
        }
        if (symbolCheckbox.checked) {
            inputText = inputText.replace(/[^\p{L}\p{N}\s]/gu, ' ');
        }
        if (spaceCheckbox.checked) {
            inputText = inputText.replace(/\s+/g,'');
        }
        if (lineBreakCheckbox.checked) {
            inputText = inputText.replace(/\n/g, ' ');
            inputText = inputText.replace(/\s{2,}/g, ' ').trim();
        }

        outputTextArea.value = inputText;
    }

    spaceCheckbox.addEventListener('change', () => {
        let removeEnd = document.getElementById('removeEnd');
        let endLabel = document.getElementById('endLabel');
        if (spaceCheckbox.checked) {
            if (!removeEnd) {

                endLabel = document.createElement('label');
                endLabel.id = 'endLabel';
                endLabel.textContent = 'Remove ending spaces';
                
                removeEnd = document.createElement('input');
                removeEnd.id = 'removeEnd';
                removeEnd.type='checkbox';

                document.body.appendChild(removeEnd);
                document.body.appendChild(endLabel);
                
            }
        } else {
            if (removeEnd) {
                // Remove the replaceSpaces div
                document.body.removeChild(removeEnd);
                document.body.removeChild(endLabel);
            }
        }
    });
    
    document.getElementById('convertButton').addEventListener('click', () => {
        convertText();
    });
});
