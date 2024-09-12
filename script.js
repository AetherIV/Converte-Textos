document.addEventListener("DOMContentLoaded", () => {
  //Elementos de texto
  const textInput = document.getElementById("textInput");
  const textOutput = document.getElementById("textOutput");
  const charCounter = document.getElementById("charCounter");

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
  let notificationDiv = document.getElementById("notificationDiv");
  let spaceBox = document.getElementById("spaceBox");
  let textOutputContainer = document.getElementById("textOutputContainer");
  let symbolBox = document.getElementById("symbolBox");

  // INICIO CÓDIGOS PARA VALIDAÇÃO LÓGICA

  uppercaseCheckbox.addEventListener("change", function () {
    //Event listener para desativar Minúsculos (lógica)
    if (this.checked) {
      lowercaseCheckbox.checked = false;
      disableCPFandCNPJ();
    }
  });

  lowercaseCheckbox.addEventListener("change", function () {
    //Event listener para desativar Maiúsculos (lógica)
    if (this.checked) {
      uppercaseCheckbox.checked = false;
      disableCPFandCNPJ();
    }
  });

  cnpjCheckbox.addEventListener("change", function () {
    //Event listener para desativar CPF (lógica)
    if (this.checked) {
      cpfCheckbox.checked = false;
      disableAllOthers();
    }
  });

  cpfCheckbox.addEventListener("change", function () {
    //Event Listener para desativar CNPJ (lógica)
    if (this.checked) {
      cnpjCheckbox.checked = false;
      disableAllOthers();
    }
  });

  function disableCPFandCNPJ() {
    //Função para desabilitar checkbox CPF e CNPJ
    if (cnpjCheckbox.checked || cpfCheckbox.checked) {
      cnpjCheckbox.checked = false;
      cpfCheckbox.checked = false;
    }
  }

  function disableAllOthers() {
    //Função para desabilitar todas as checkboxes menos CPF ou CNPJ
    uppercaseCheckbox.checked = false;
    lowercaseCheckbox.checked = false;
    symbolCheckbox.checked = false;
    spaceCheckbox.checked = false;
    lineBreakCheckbox.checked = false;
  }

  // FIM CÓDIGOS PARA VALIDAÇÃO LÓGICA

  function convertText() {
    //Função Principal para converter textos

      let conversionString = textInput.innerText;

      if (uppercaseCheckbox.checked) {
        conversionString = conversionString.toUpperCase();
      }
      if (lowercaseCheckbox.checked) {
        conversionString = conversionString.toLowerCase();
      }
      if (symbolCheckbox.checked) {
        if (accentCheckbox.checked) {
          conversionString = conversionString
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}\s]/gu, "");
        } else {
          conversionString = conversionString.replace(/[^\p{L}\p{N}\s]/gu, ""); //Evita a remoção de letras com acentos de todas as linguas
        }
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
        if (conversionString.length === 14) {
          //Somente se a string for 14 caracteres que a conversão vai ser feita
          conversionString = conversionString.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
            "$1.$2.$3/$4-$5"
          );
        } else if (conversionString.length >= 14) {
          conversionString = conversionString.replace(/\s+/g, "");
          conversionString = conversionString.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
            "$1.$2.$3/$4-$5"
          );
        }
      }
      if (cpfCheckbox.checked) {
        conversionString = conversionString.replace(/\s+/g, "");
        if (conversionString.length === 13) {
          //Somente se a string for 11 caracteres que a conversão vai ser feita
          conversionString = conversionString.substring(0, 13); //Limita a string para somente 11 caracteres, evitando erros de mais números aparecer na conversão
          conversionString = conversionString.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
            "$1.$2.$3/$4-$5"
          );
        }
      }
      if (!uppercaseCheckbox.checked && !lowercaseCheckbox.checked && !symbolCheckbox.checked && !spaceCheckbox.checked && !lineBreakCheckbox.checked && !cnpjCheckbox.checked && !cpfCheckbox.checked) {
        createTooltip("error", "Selecione pelo menos 1 tipo de conversão!");
        textOutput.innerText = '';
        textOutput.style.display = 'none';
        return;
      }
      else{
        textOutputContainer.style.display = "block";
        textOutput.innerText = conversionString;
        textOutput.style.display = "block";
      }
    
  }

  textInput.addEventListener("input", convertText);

  symbolCheckbox.addEventListener("change", () => {
    let accentLabel = document.getElementById("accentLabel"); //Cria a label para remover acentos
    let accentCheckbox = document.getElementById("accentCheckbox"); //Cria a checkbox

    if (symbolCheckbox.checked) {
      if (!accentCheckbox) {
        accentLabel = document.createElement("label");
        accentLabel.id = "accentLabel";
        accentLabel.textContent = "Remover Acentos";

        accentCheckbox = document.createElement("input");
        accentCheckbox.id = "accentCheckbox";
        accentCheckbox.type = "checkbox";

        symbolBox.appendChild(accentLabel);
        accentLabel.appendChild(accentCheckbox);
      }
    } else {
      if (accentLabel) {
        symbolBox.removeChild(accentLabel);
        accentLabel.removeChild(accentCheckbox);
      }
    }
  });

  spaceCheckbox.addEventListener("change", () => {
    //Ao habilitar a opção de remover espaços, cria dinâmicamente essa input (eu passei muito tempo nisso)

    let endSpaceLabel = document.getElementById("endSpaceLabel"); //Cria a label
    let endSpaceInput = document.getElementById("endSpaceInput"); //Cria Input para o checkbox

    /* 
        Lógica:
        Toda essa malhação é para criar dinâmicamente uma div que contem um switch para dar o usuário a opção de tirar espaço em branco
        somente do fim da string... Tudo isso só para um inputText = inputText.trim();

        Culpa do: Gustavo
    */

    if (spaceCheckbox.checked) {
      if (!endSpaceInput) {
        endSpaceLabel = document.createElement("label");
        endSpaceLabel.id = "endSpaceLabel";
        endSpaceLabel.textContent = "Somente final";

        endSpaceInput = document.createElement("input");
        endSpaceInput.id = "endSpaceInput";
        endSpaceInput.type = "checkbox";

        spaceBox.appendChild(endSpaceLabel);
        endSpaceLabel.appendChild(endSpaceInput);
      }
    } else {
      if (endSpaceLabel) {
        spaceBox.removeChild(endSpaceLabel);
        endSpaceLabel.removeChild(endSpaceInput);
      }
    }
  });

  textInput.addEventListener("input", () => {
    //Event listener para contar caracteres - Sugestão Eduardo
    const textLength = textInput.textContent.length;
    charCounter.style.display = "inline";
    charCounter.textContent = `${textLength}`;
    if (!textInput.innerText.trim()) {
      charCounter.style.display = "none";
    }
  });

  function createTooltip(type, text) {
    //Função para criar uma tooltip

    var tooltip = document.getElementById("tooltip");

    if (!tooltip) {

      tooltip = document.createElement("div");
      tooltip.id = "tooltip";

      notificationDiv.appendChild(tooltip);
      tooltip.innerText = text;
      tooltip.classList.add(type);
      tooltip.classList.add("slideIn");

      setTimeout(() => {
        tooltip.classList.remove("slideIn");
        tooltip.classList.add("slideOut");
      }, 4000);

      setTimeout(() => {
        notificationDiv.removeChild(tooltip);
      }, 4700);
    }
  }

  function clearFields() {
    textInput.innerText = "";
    textOutput.innerText = "";
    textOutput.style.display = "none";
    charCounter.textContent = "";
    charCounter.style.display = "none";
  }

  function copyText() {
    if (textOutput.innerText === "") {
      createTooltip("error", "Digite algo para converter!");
    }
    if (!uppercaseCheckbox.checked && !lowercaseCheckbox.checked && !symbolCheckbox.checked && !spaceCheckbox.checked && !lineBreakCheckbox.checked && !cnpjCheckbox.checked && !cpfCheckbox.checked) {
      createTooltip("error", "Selecione pelo menos 1 tipo de conversão!");
    }
    else{
      navigator.clipboard.writeText(textOutput.innerText);
      createTooltip("success", "Texto copiado com sucesso!");
    }
    
  }

  clearBtn.addEventListener("click", clearFields);
  copyBtn.addEventListener("click", copyText);
});
