document.addEventListener("DOMContentLoaded", () => {

    //Elementos de texto
    const textInput = document.getElementById('textInput');
    const textOutput = document.getElementById('textOutput');

    //Elementos de conversão
    const uppercaseCheckbox = document.getElementById('upper');
    const lowercaseCheckbox = document.getElementById('lower');
    const symbolCheckbox = document.getElementById('symbols');
    const spaceCheckbox = document.getElementById('spaces');
    const lineBreakCheckbox = document.getElementById('lineBreaks');
    const cnpjCheckbox = document.getElementById('cnpj');
    const cpfCheckbox = document.getElementById('cpf');

    //Elementos dinâmicos
    let copyBtn = document.getElementById('copyBtn');
    let spacesSwitch = document.getElementById('spacesSwitch');

    //Divs para criação dinâmica
    let switchesBlock = document.getElementById('switchesBlock');
    let buttonContainer = document.getElementById('buttonContainer')

    function convertText() { //Função Principal para converter textos

        let conversionString = textInput.innerHTML;

        if (uppercaseCheckbox.checked) {
            conversionString = conversionString.toUpperCase();
        }
        if (lowercaseCheckbox.checked) {
            conversionString = conversionString.toLowerCase();
        }
        if (symbolCheckbox.checked) {
            conversionString = conversionString.replace(/[^\p{L}\p{N}\s]/gu, ' '); //Evita a remoção de letras com acentos de todas as línguas
        }
        if (spaceCheckbox.checked) {
            conversionString = conversionString.replace(/\s+/g,''); //TEMPORÁRIO
        }
        if (lineBreakCheckbox.checked) {
            conversionString = conversionString.replace(/\n/g, ' ');
            conversionString = conversionString.replace(/\s{2,}/g, ' ').trim(); //Evita que tenha espaços duplos entre as palavras
        }
        if(cnpjCheckbox.checked){
            conversionString = conversionString.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5")
        }
        if(cpfCheckbox.checked){
            conversionString = conversionString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
        }

        if(!textInput.innerText){ //Cria tooltip para validação de texto em branco
            convertTooltip();
        }else{
            textOutput.style.opacity = 1;
            textOutput.innerHTML = conversionString;
            if(!copyBtn){ //Validação para não criar mais de 1 botão de copiar
                createCopy();
            }else{
                copyBtn.style.display = 'inline-block';
            }
        }
    }

    spaceCheckbox.addEventListener('change', () => { //Ao habilitar a opção de remover espaços, cria dinâmicamente essa input

        let endSpaceLabel = document.getElementById('endSpaceLabel');
        let endSpaceInput = document.getElementById('endSpaceInput');
        let endSpaceSpan = document.getElementById('endSpaceSpan');
        let endSpacePre = document.getElementById('endSpacePre');

        if (spaceCheckbox.checked) {
            if (!endSpaceInput) {

                endSpaceLabel = document.createElement('label');
                endSpaceLabel.id = 'endSpaceLabel';
                endSpaceLabel.className = 'switch'

                endSpaceInput = document.createElement('input');
                endSpaceInput.id = 'endSpaceInput';
                endSpaceInput.type='checkbox';
                
                endSpaceSpan = document.createElement('span');
                endSpaceSpan.className ='slider';
                endSpaceSpan.id = 'endSpaceSpan';

                endSpacePre = document.createElement('pre');
                endSpacePre.id = 'endSpacePre';
                endSpacePre.textContent = 'Somente Final';

                endSpaceLabel.appendChild(endSpaceInput);
                endSpaceLabel.appendChild(endSpaceSpan);
                endSpaceLabel.appendChild(endSpacePre);
                switchesBlock.appendChild(endSpaceLabel);
                
    
            }
        } else {
            if (endSpaceLabel) {
                endSpaceLabel.removeChild(endSpaceInput);
                endSpaceLabel.removeChild(endSpaceSpan);
                endSpaceLabel.removeChild(endSpacePre);
                switchesBlock.removeChild(endSpaceLabel);
            }
        }
    });

    function convertTooltip(){

        alert("digita alguma coisa imbecil");
        
    }

    function clearFields() {
        textInput.innerHTML = null;
        textOutput.innerHTML = null;
        textOutput.style.opacity = 0;
        copyBtn.style.display = 'none'
    }

    function createCopy(){

        copyBtn = document.createElement('button');

        copyBtn.textContent = 'Copiar';
        copyBtn.className = 'buttons';

        copyBtn.addEventListener('click', copyText)
        buttonContainer.appendChild(copyBtn);
    }

    function copyText(){
        navigator.clipboard.writeText(textOutput.innerHTML);
        alert('Texto copiado!');
    }
    
    convertBtn.addEventListener('click', convertText);
    clearBtn.addEventListener('click', clearFields);

});
