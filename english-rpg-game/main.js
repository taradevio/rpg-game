import "./styles.scss";

document.addEventListener("DOMContentLoaded", () => {
  const mainMenu = `
  <div class="main-menu">
    <div class="img-bg">
      <img src="/assets/kingdom.jpg" alt="kingdom" class="background"> 
    </div>
    <div class="opening-text">
      <p>Are you the chosen one to save the empire?</p>
      <button class="play-btn">PLAY</button>
    </div>
  </div>
  `;

  const prologue = `
    <div><
  `

  document.getElementById("app").innerHTML = mainMenu;
});
