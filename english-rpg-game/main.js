import "./styles.scss";

document.addEventListener("DOMContentLoaded", () => {
  let currentPrologueIndex = 0;

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
    <div class="main-story">
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

  function generateFirstDungeonLevel(bgFirstDungeon, openingDungeon) {
    return `
      <div class="first-dungeon">
        <div class="img-bg">
          <img src="${bgFirstDungeon}" alt="dungeon level 1" class="background"> 
        </div>
        <div class="opening-dungeon">
          <h1>${openingDungeon}</h1>
        </div>
      </div>
    `;
  }

  function generateFirstDungeonQuiz(bgFirstDungeon, questions) {
    return `
      <div class="quiz-container">
        <div class="img-bg">
          <img src="${bgFirstDungeon}" alt="dungeon level 1" class="background"> 
        </div>
        <div class="quiz">
          <h2 class="title">${questions}</h2>
          <div class="multiple-choices">
            <button>Which</button>
            <button>Were</button>
            <button>Who</button>
            <button>What</button>
          </div>
        </div>
      </div>
        
    `;
  }

  async function getData() {
    const response = await fetch("content.json");
    const contents = await response.json();

    const mainMenu = generateMainMenu(contents.story.background);
    document.getElementById("app").innerHTML = mainMenu;
    const Playbtn = document.querySelector(".play-btn");

    Playbtn.addEventListener("click", () => {
      mainStory();
    });

    function mainStory() {
      // get background from json
      const backgroundMain = contents.story.background;

      // get dynamic text from json. the global var of currentPrologueIndex will index the story inside the prologue
      const prologueText = contents.story.prologue[currentPrologueIndex].story;

      // below will generate background and text of prologue after the opening text
      const generateStory = generatePrologue(backgroundMain, prologueText);
      document.getElementById("app").innerHTML = generateStory;

      const nextBtn = document.querySelector(".next");
      nextBtn.addEventListener("click", () => {
        currentPrologueIndex++;

        if (currentPrologueIndex >= contents.story.prologue.length) {
          return dungeon();
        }

        // the function is invoked again, so that when the next button is clicked, it will generate the function generatePrologue which holds the html template. IF it is not invoked, when clicked, nothing will happen as the html is not generated
        mainStory();
      });
    }

    function dungeon() {
      // const firstDungeon = contents.story.dungeons[0].background;
      const firstDungeonText = contents.story.dungeons[0].level;

      const generateFirstDungeon = generateFirstDungeonLevel(
        contents.story.dungeons[0].background,
        firstDungeonText
      );
      document.getElementById("app").innerHTML = generateFirstDungeon;

      setTimeout(() => {
        // document.querySelector(".first-dungeon").style.display = "none";

        firstDungeonQuiz()
      }, 1000);
    }

    function firstDungeonQuiz() {
      const questions = contents.story.questions[0].text;

      const generateQuestions = generateFirstDungeonQuiz(
        contents.story.dungeons[0].background,
        questions
      );

      document.getElementById("app").innerHTML = generateQuestions;
      // document.querySelector(".quiz-container").style.display = "block";
    }
  }

  getData();
});
