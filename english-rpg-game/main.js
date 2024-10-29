import "./styles.scss";

document.addEventListener("DOMContentLoaded", () => {
  function generateMainMenu(backgroundMain) {
    return `
    <div class="main-menu">
      <div class="img-bg">
        <img src="${backgroundMain}" alt="kingdom" class="background"> 
      </div>
      <div class="opening-text">
        <p class="getter">Are you the chosen one to save the empire?</p>
        <button class="play-btn">PLAY</button>
      </div>
    </div>
  `;
  }

  function generatePrologue(backgroundMain, prologue) {
    return `
    <div class="main-menu">
      <div class="img-bg">
        <img src="${backgroundMain}" alt="kingdom" class="background"> 
      </div>
      <div class="prologue">
        <p class="text-prologue">${prologue}</p>
        <button class="next">Selanjutnya</button>
      </div>
    </div>
    `;
  }


  async function getData() {
    const response = await fetch("content.json");
    const contents = await response.json();

    const mainMenu = generateMainMenu(contents.story.background);
    document.getElementById("app").innerHTML = mainMenu;
    const btn = document.querySelector(".play-btn");
    btn.addEventListener("click", () => {
      const prologueStory = generatePrologue(
        contents.story.background,
        contents.story.prologue[0].story
      );

    const nextBtn = document.querySelector(".next");
    // nextBtn.addEventListener("click", () => {

    // })

      document.querySelector(".main-menu").innerHTML = prologueStory;
    });
  }

  getData();
});
