import "./styles.scss";
// import { randomQuote } from "./createHearts";

document.addEventListener("DOMContentLoaded", () => {
  let currentPrologueIndex = 0;
  let currentQuizQuestions = 0;
  let currentQuizAnswers = 0;
  let currentCorrectAnswers = 0;
  let loseConditionIndex = 0;
  let gameOver = false;
  let remainingLives = 3;

  function generateMainMenu(backgroundMain) {
    return `
    <div class="main-menu">
      <div class="img-bg">
        <img src="${backgroundMain}" alt="kingdom" class="background"> 
      </div>
      <div class="opening-text">
        <p class="getter">Apakah kamu yang terpilih untuk menyelamatkan kerajaan?</p>
        <button class="play-btn">MAIN</button>
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
        <div class="multiple-choices"></div>
        </div>
        <div class="life-icon">
          <h3 class="index">${currentQuizQuestions + 1} / 10</h3>
          <h3>Nyawa Tersisa: <span class="life-number"></span></h3>
        </div>
      </div>
    `;
  }

  function generateLoseCondition(bgFirstDungeon, title, quote) {
    return `
    <div class="quiz-container">
        <div class="img-bg">
          <img src="${bgFirstDungeon}" alt="dungeon level 1" class="background"> 
        </div>
      <div class="lose-page">
        <h1>${title}</h1>
        <p>${quote}</p>
        <button class="nextDesc">Selanjutnya</button>
      </div>
    </div>
    `;
  }

  function generateLoseConditionDescription(bgFirstDungeon, description) {
    return `
    <div class="quiz-container">
        <div class="img-bg">
          <img src="${bgFirstDungeon}" alt="dungeon level 1" class="background"> 
        </div>
      <div class="lose-page">
        <p>${description}</p>
        <button class="nextDesc">Selanjutnya</button>
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
        firstDungeonQuiz();
      }, 1500);
    }

    function firstDungeonQuiz() {
      if (gameOver) return;
      const newQuestion =
        contents.story.questions.level_1[currentQuizQuestions].text;
      const newAnswers =
        contents.story.questions.level_1[currentQuizAnswers].choices;

      const generateQuestions = generateFirstDungeonQuiz(
        contents.story.dungeons[0].background,
        newQuestion
      );

      document.getElementById("app").innerHTML = generateQuestions;

      const updateLives = document.querySelector(".life-number");
      updateLives.textContent = remainingLives;

      const quizSection = document.querySelector(".multiple-choices");

      // create button dynamically by mapping it based on the json value
      const singleQuestion = newAnswers
        .map((item) => {
          return `
          <button class="answer">${item}</button>
        `;
        })
        .join("");
      quizSection.innerHTML = singleQuestion;

      // use queryselectorall to select all the answers button and use foreach to dynamically assign eventlistener to each button, so that the indexing works
      document.querySelectorAll(".answer").forEach((answerBtn) => {
        answerBtn.addEventListener("click", () => {
          const correctAnswer =
            contents.story.questions.level_1[currentCorrectAnswers]
              .correct_answer;

          if (answerBtn.textContent === correctAnswer) {
            answerBtn.style.backgroundColor = "green";
            answerBtn.style.color = "white";
            currentQuizQuestions++;
            currentQuizAnswers++;
            currentCorrectAnswers++;
            setTimeout(() => {
              firstDungeonQuiz();
            }, 400);
          } else {
            answerBtn.style.backgroundColor = "red";
            answerBtn.style.color = "white";
            // alert("jawaban salah")
            remainingLives--;
            setTimeout(() => {
              firstDungeonQuiz();
            }, 400);
          }

          function randomQuote() {
            const getQuotes = contents.story.epilogues.bad_ending.quotes;
            return getQuotes[Math.floor(Math.random() * getQuotes.length)];
          }

          if (remainingLives <= 0) {
            gameOver = true;
            function createGameOver() {
              const getTitle =
                contents.story.epilogues.bad_ending.description_title;

              const createRandomQuotes = randomQuote();
              const createLoseCondition = generateLoseCondition(
                contents.story.dungeons[0].background,
                getTitle,
                createRandomQuotes
              );
              document.getElementById("app").innerHTML = createLoseCondition;
            }

            createGameOver();

            const nextLosePage = document.querySelector(".nextDesc");

            nextLosePage.addEventListener("click", () => {
              const getDescription = contents.story.epilogues.bad_ending.description[loseConditionIndex].par;

              const loseDescription = generateLoseConditionDescription(contents.story.dungeons[0].background, getDescription);

              document.getElementById("app").innerHTML = loseDescription;
            })

            // function finalStory() {
            //   const getDescription =
            //     contents.story.epilogues.bad_ending.description[
            //       loseConditionIndex
            //     ].par;

            //   const loseDescription =
            //     generateLoseConditionDescription(contents.story.dungeons[0].background, getDescription);
            //   document.getElementById("app").innerHTML = loseDescription;
            //   if (
            //     loseConditionIndex >=
            //     contents.story.epilogues.bad_ending.description.length
            //   ) {
            //     return alert("end of story");
            //   }
            // }
            // nextLosePage.addEventListener("click", () => {
            //   loseConditionIndex++;

            // });

            // finalStory();
            return;
          }

          if (
            currentQuizQuestions &&
            currentQuizAnswers >= contents.story.questions.level_1.length
          ) {
            alert("end of questions");
            return;
          }
        });
      });
    }
  }

  getData();
});
