let darkMode = localStorage.getItem("darkMode");
const modeSwitch = document.getElementById("modeSwitch");

function enableDarkmode(){
    document.body.classList.add("darkMode");
    localStorage.setItem('darkMode', 'active');
  }

  function disableDarkmode(){
    document.body.classList.remove("darkMode");
    localStorage.setItem("darkMode", null);
  }

  if(darkMode === "active") enableDarkmode();

modeSwitch.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode");
    darkMode !== "active" ? enableDarkmode() : disableDarkmode();
  });