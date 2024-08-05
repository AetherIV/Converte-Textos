document.addEventListener("DOMContentLoaded", () => {
  //Elementos de texto
  const textInput = document.getElementById("textInput");
  const textOutput = document.getElementById("textOutput");

  //Elementos de conversão
  const uppercaseCheckbox = document.getElementById("upper");
  const lowercaseCheckbox = document.getElementById("lower");
  const symbolCheckbox = document.getElementById("symbols");
  const spaceCheckbox = document.getElementById("spaces");
  const lineBreakCheckbox = document.getElementById("lineBreaks");
  const cnpjCheckbox = document.getElementById("cnpj");
  const cpfCheckbox = document.getElementById("cpf");

  //Elementos dinâmicos
  let copyBtn = document.getElementById("copyBtn");

  //Divs
  let textOutputContainer = document.getElementById("textOutputContainer");

  function convertText() {
    //Função Principal para converter textos

    if (
      !uppercaseCheckbox.checked && !lowercaseCheckbox.checked && !symbolCheckbox.checked && !spaceCheckbox.checked && !lineBreakCheckbox.checked && !cnpjCheckbox.checked && !cpfCheckbox.checked) {
      noConversionTooltip();
    } else {
      let conversionString = textInput.innerHTML;

      if (uppercaseCheckbox.checked) {
        conversionString = conversionString.toUpperCase();
      }
      if (lowercaseCheckbox.checked) {
        conversionString = conversionString.toLowerCase();
      }
      if (symbolCheckbox.checked) {
        conversionString = conversionString.replace(/[^\p{L}\p{N}\s]/gu, " "); //Evita a remoção de letras com acentos de todas as linguas
      }
      if (spaceCheckbox.checked) {
        if (endSpaceInput.checked) {
          conversionString = conversionString.trim(); //Simplesmente retira espaços do final da string somente
        } else {
          conversionString = conversionString.replace(/\s+/g, ""); //Senão retira todos os espaços em branco da string
        }
      }
      if (lineBreakCheckbox.checked) {
        conversionString = conversionString.replace(/\n/g, " ");
        conversionString = conversionString.replace(/\s{2,}/g, " ").trim(); //Evita que tenha espaços duplos entre as palavras
      }
      if (cnpjCheckbox.checked) {
        conversionString = conversionString.substring(0, 14); //Limita a string para somente 14 caracteres, evitando erros de mais números aparecer na conversão
        if (conversionString.length === 14) { //Somente se a string for 14 caracteres que a conversão vai ser feita
            conversionString = conversionString.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
        }
    }
    if (cpfCheckbox.checked) {
        conversionString = conversionString.substring(0, 11);//Limita a string para somente 11 caracteres, evitando erros de mais números aparecer na conversão
        if (conversionString.length === 11) { //Somente se a string for 11 caracteres que a conversão vai ser feita
            conversionString = conversionString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
        }
    }

      if (!textInput.innerText.trim()) {
        convertErrorTooltip();
      } else {
        textOutput.style.opacity = 1;
        textOutput.innerHTML = conversionString;
        if (!copyBtn) { //Validação para não criar mais de 1 botão de copiar
          createCopy();
        } else {
          copyBtn.style.display = "inline-block";
        }
      }
    }
  }

  spaceCheckbox.addEventListener("change", () => {  //Ao habilitar a opção de remover espaços, cria dinâmicamente essa input (eu passei muito tempo nisso)
  

    let spacesSwitch = document.getElementById("spacesSwitch"); //Pega a label de espaços
    let endSpaceDiv = document.getElementById("endSpaceDiv"); //Cria div dentro da label de espaços
    let endSpaceLabel = document.getElementById("endSpaceLabel"); //Cria a label e espaços somente no final
    let endSpaceInput = document.getElementById("endSpaceInput"); //Cria Input para o checkbox
    let endSpaceSpan = document.getElementById("endSpaceSpan"); //Para utilizar o Slider
    let endSpacePre = document.getElementById("endSpacePre"); //Texto

    /* 
        Lógica:
        Toda essa malhação é para criar dinâmicamente uma div que contem um switch para dar o usuário a opção de tirar espaço em branco
        somente do fim da string... Tudo isso só para um inputText = inputText.trim();

        Culpa do: Gustavo
    */

    if (spaceCheckbox.checked) {
      if (!endSpaceInput) {
        endSpaceDiv = document.createElement("div");
        endSpaceDiv.id = "endSpaceDiv";

        endSpaceLabel = document.createElement("label");
        endSpaceLabel.id = "endSpaceLabel";
        endSpaceLabel.className = "switch";

        endSpaceInput = document.createElement("input");
        endSpaceInput.id = "endSpaceInput";
        endSpaceInput.type = "checkbox";

        endSpaceSpan = document.createElement("span");
        endSpaceSpan.className = "slider";
        endSpaceSpan.id = "endSpaceSpan";

        endSpacePre = document.createElement("pre");
        endSpacePre.id = "endSpacePre";
        endSpacePre.textContent = "Somente Final";

        spacesSwitch.appendChild(endSpaceDiv);
        endSpaceDiv.appendChild(endSpaceLabel);
        endSpaceLabel.appendChild(endSpaceInput);
        endSpaceLabel.appendChild(endSpaceSpan);
        endSpaceLabel.appendChild(endSpacePre);

        //Achei melhor entrar dentro da label de espaços pois fica um pouco mais bonito e mais fácil de incluir os switches
      }
    } else {
      if (endSpaceLabel) {
        //Remove todos os elementos criados da label
        spacesSwitch.removeChild(endSpaceDiv);
        endSpaceDiv.removeChild(endSpaceLabel);
        endSpaceLabel.removeChild(endSpaceInput);
        endSpaceLabel.removeChild(endSpaceSpan);
        endSpaceLabel.removeChild(endSpacePre);
      }
    }
  });

  function convertErrorTooltip() { //Criar mensagem de erro caso o usuário tente converter sem nada na caixa de texto (WIP)

    let convertError = document.getElementById("convertError");

    if(!convertError){ //Validação para não criar várias tooltips

        convertError = document.createElement('span');
        convertError.id = 'convertError';
        convertError.textContent = "Favor digitar algo";
        convertError.classList = 'slideIn';
        document.body.appendChild(convertError);
        
        setTimeout(() => { //Primeiro timeout para questão de frontend, ele roda a animação antes do child ser removido do body
            convertError.classList.remove('slideIn')
            convertError.classList = 'slideOut';
        }, 4000);

        setTimeout(() => { //Segundo timeout para excluir completamente a child
            document.body.removeChild(convertError);
        }, 5000);
    }
  }

  function createCopiedTootip() {
    let copyMsg = document.getElementById("copyMsg");

    if(!copyMsg){
        copyMsg = document.createElement('span');
        copyMsg.id = "copyMsg";
        copyMsg.textContent = 'Texto copiado com sucesso!'
        copyMsg.classList = 'slideIn';
        document.body.appendChild(copyMsg);

        setTimeout(() => {
            copyMsg.classList.remove('slideIn');
            copyMsg.classList = 'slideOut';
        }, 4000);

        setTimeout(() => {
            document.body.removeChild(copyMsg);
        }, 5000);
    }
  }

  function noConversionTooltip(){ //Função para criar uma tooltip caso não tiver nenhuma conversão selecionada
    noConversion = document.getElementById("noConversion");

    if(!noConversion){
        noConversion = document.createElement('span');
        noConversion.id = 'noConversion';
        noConversion.textContent = "Favor selecionar pelo menos um tipo de conversão";
        noConversion.classList = 'slideIn';

        document.body.appendChild(noConversion);

        setTimeout(() => {
            noConversion.classList.remove('slideIn');
            noConversion.classList = 'slideOut';
        }, 4000);

        setTimeout(() => {
            document.body.removeChild(noConversion);
        }, 5000);
    }
  }

  function clearFields() {
    textInput.innerHTML = "";
    textOutput.innerHTML = "";
    textOutput.style.opacity = 0;
    if (copyBtn) //Caso usuário não tiver convertido nenhum texto
      copyBtn.style.display = "none";
  }

  function createCopy() {
    // Cria um botão de copiar texto dinâmicamente (viadagem eu sei mas queria mexer com elementos DOM)

    copyBtn = document.createElement("button");

    copyBtn.textContent = "Copiar";
    copyBtn.className = "buttons";
    copyBtn.id = "copyBtn";

    copyBtn.addEventListener("click", copyText);
    textOutputContainer.appendChild(copyBtn);
  }

  function copyText() {
    navigator.clipboard.writeText(textOutput.innerHTML);
    createCopiedTootip();
  }

  convertBtn.addEventListener("click", convertText);
  clearBtn.addEventListener("click", clearFields);
});