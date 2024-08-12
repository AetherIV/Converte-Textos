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
  let textLabel = document.getElementById("textLabel");

  //Divs
  let notificationDiv = document.getElementById("notificationDiv");
  let buttonContainer = document.getElementById("buttonContainer");

// INICIO CÓDIGOS PARA VALIDAÇÃO LÓGICA

  uppercaseCheckbox.addEventListener('change', function(){ //Event listener para desativar Minúsculos (lógica)
    if(this.checked){
        lowercaseCheckbox.checked = false;
        disableCPFandCNPJ();
    }
  });

  lowercaseCheckbox.addEventListener('change', function(){ //Event listener para desativar Maiúsculos (lógica)
    if(this.checked){
        uppercaseCheckbox.checked = false;
        disableCPFandCNPJ();
    }
  });

  cnpjCheckbox.addEventListener('change', function(){ //Event listener para desativar CPF (lógica)
    if(this.checked){
        cpfCheckbox.checked = false;
        disableAllOthers();
    }
  });

  cpfCheckbox.addEventListener('change' , function(){ //Event Listener para desativar CNPJ (lógica)
    if(this.checked){
        cnpjCheckbox.checked = false;
        disableAllOthers();
    }
  });

  function disableCPFandCNPJ(){ //Função para desabilitar checkbox CPF e CNPJ
    if(cnpjCheckbox.checked || cpfCheckbox.checked){
        cnpjCheckbox.checked = false;
        cpfCheckbox.checked = false;
    }
  }

  function disableAllOthers(){ //Função para desabilitar todas as checkboxes menos CPF ou CNPJ
    uppercaseCheckbox.checked = false;
    lowercaseCheckbox.checked = false;
    symbolCheckbox.checked = false;
    spaceCheckbox.checked = false;
    lineBreakCheckbox.checked = false;
  }

// FIM CÓDIGOS PARA VALIDAÇÃO LÓGICA

  function convertText() {
    //Função Principal para converter textos

    if (
      !uppercaseCheckbox.checked && !lowercaseCheckbox.checked && !symbolCheckbox.checked && !spaceCheckbox.checked && !lineBreakCheckbox.checked && !cnpjCheckbox.checked && !cpfCheckbox.checked) {
      noConversionTooltip();
    } else {
      let conversionString = textInput.value;

      if (uppercaseCheckbox.checked) {
        conversionString = conversionString.toUpperCase();
      }
      if (lowercaseCheckbox.checked) {
        conversionString = conversionString.toLowerCase();
      }
      if (symbolCheckbox.checked) {
        conversionString = conversionString.replace(/[^\p{L}\p{N}\s]/gu, ""); //Evita a remoção de letras com acentos de todas as linguas
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
        else if(conversionString.length >= 14){
            conversionString = conversionString.replace(/\s+/g, "")
            conversionString = conversionString.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
        }
    }
    if (cpfCheckbox.checked) {
        conversionString = conversionString.replace(/\s+/g, "")
        if (conversionString.length === 13) { //Somente se a string for 11 caracteres que a conversão vai ser feita
            conversionString = conversionString.substring(0, 13);//Limita a string para somente 11 caracteres, evitando erros de mais números aparecer na conversão
            conversionString = conversionString.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
        }
    }

      if (!textInput.value.trim()) {
        convertErrorTooltip();
      } else {
        textOutput.style.opacity = 1;
        textOutput.innerHTML = conversionString;
        if (!copyBtn) { //Validação para não criar mais de 1 botão de copiar
          createCopy();
        } else {
          copyBtn.style.display = "inline-block";
          copyIcon.style.display = "inline-block";
        }
      }
    }
  }

  spaceCheckbox.addEventListener("change", () => {  //Ao habilitar a opção de remover espaços, cria dinâmicamente essa input (eu passei muito tempo nisso)
  
    let endSpaceDiv = document.getElementById("endSpaceDiv"); //Cria div dentro da label de espaços
    let endSpaceLabel = document.getElementById("endSpaceLabel"); //Cria a label e espaços somente no final
    let endSpaceInput = document.getElementById("endSpaceInput"); //Cria Input para o checkbox
    let spaceBox = document.getElementById("spaceBox");

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
        endSpaceLabel.textContent = "Somente final";

        endSpaceInput = document.createElement("input");
        endSpaceInput.id = "endSpaceInput";
        endSpaceInput.type = "checkbox";

        spaceBox.appendChild(endSpaceDiv);
        endSpaceDiv.appendChild(endSpaceLabel);
        endSpaceLabel.appendChild(endSpaceInput);

      }
    } else {
      if (endSpaceLabel) {
        spaceBox.removeChild(endSpaceDiv);
        endSpaceDiv.removeChild(endSpaceLabel);
        endSpaceLabel.removeChild(endSpaceInput);
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
        notificationDiv.appendChild(convertError);
        
        setTimeout(() => { //Primeiro timeout para questão de frontend, ele roda a animação antes do child ser removido do body
            convertError.classList.remove('slideIn')
            convertError.classList = 'slideOut';
        }, 4000);

        setTimeout(() => { //Segundo timeout para excluir completamente a child
            notificationDiv.removeChild(convertError);
        }, 4700);
    }
  }

  function createCopiedTootip() {
    let copyMsg = document.getElementById("copyMsg");

    if(!copyMsg){
        copyMsg = document.createElement('span');
        copyMsg.id = "copyMsg";
        copyMsg.textContent = 'Texto copiado com sucesso!'
        copyMsg.classList = 'slideIn';
        notificationDiv.appendChild(copyMsg);

        setTimeout(() => {
            copyMsg.classList.remove('slideIn');
            copyMsg.classList = 'slideOut';
        }, 4000);

        setTimeout(() => {
            notificationDiv.removeChild(copyMsg);
        }, 4700);
    }
  }

  function noConversionTooltip(){ //Função para criar uma tooltip caso não tiver nenhuma conversão selecionada
    noConversion = document.getElementById("noConversion");

    if(!noConversion){
        noConversion = document.createElement('span');
        noConversion.id = 'noConversion';
        noConversion.textContent = "Favor selecionar pelo menos um tipo de conversão";
        noConversion.classList = 'slideIn';

        notificationDiv.appendChild(noConversion);

        setTimeout(() => {
            noConversion.classList.remove('slideIn');
            noConversion.classList = 'slideOut';
        }, 4000);

        setTimeout(() => {
          notificationDiv.removeChild(noConversion);
        }, 4700);
    }
  }

  function clearFields() {
    textInput.value = "";
    textOutput.value = "";
    textOutput.style.opacity = 0;
    if (copyBtn) //Caso usuário não tiver convertido nenhum texto
      copyBtn.style.display = "none";
      copyIcon.style.display = "none";
  }

  function createCopy() {
    // Cria um botão de copiar texto dinâmicamente (viadagem eu sei mas queria mexer com elementos DOM)

    copyBtn = document.createElement("button");
    copyIcon = document.createElement("i");

    copyIcon.className = "bi bi-copy"; //Cria junto um ícone
    copyIcon.style.margin = "5px";
    copyIcon.style.fontSize = "15px";

    copyBtn.textContent = "Copiar";
    copyBtn.className = "buttons";
    copyBtn.id = "copyBtn";
    copyBtn.className = "buttons"

    copyBtn.addEventListener("click", copyText);

    buttonContainer.appendChild(copyBtn);
    copyBtn.appendChild(copyIcon)
  }

  function copyText() {
    navigator.clipboard.writeText(textOutput.innerHTML);
    createCopiedTootip();
  }

  convertBtn.addEventListener("click", convertText);
  clearBtn.addEventListener("click", clearFields);
});