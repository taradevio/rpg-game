import "./styles.scss";

document.addEventListener("DOMContentLoaded", () => {
  let currentPrologueIndex = 0;
  let currentAfterStoryDungeon1 = 0;
  let currentAfterStoryDungeon2 = 0;
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
        <button class="next-desc">Selanjutnya</button>
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
        <button class="start-over">Selanjutnya</button>
      </div>
    </div>
    `;
  }

  function generateReviewPage(bgFirstDungeon) {
    return `
      <div class="quiz-container">
        <div class="img-bg">
          <img src="${bgFirstDungeon}" alt="dungeon level 1" class="background"> 
        </div>
      <div class="review-page">
        <div class="explanation-wrapper"></div>
        <button class="next-story">Selanjutnya</button>
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
      // console.log("entering the dungeon");
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
            if (
              currentQuizQuestions &&
              currentQuizAnswers >= contents.story.questions.level_1.length
            ) {
              currentQuizQuestions = 0;
              currentQuizAnswers = 0;
              currentCorrectAnswers = 0;
              remainingLives = 3;
              setTimeout(() => {
                showReviewPage();
              }, 200);
              return;
            }
          } else {
            answerBtn.style.backgroundColor = "red";
            answerBtn.style.color = "white";
            remainingLives--;
          }

          if (remainingLives <= 0) {
            gameOver = true;
            handleGameOver();
          } else {
            setTimeout(() => {
              firstDungeonQuiz();
            }, 200);
          }
        });
      });
    }

    function dungeonTwo() {
      const firstDungeonText = contents.story.dungeons[1].level;

      const generateSecondDungeon = generateFirstDungeonLevel(
        contents.story.dungeons[1].background,
        firstDungeonText
      );
      document.getElementById("app").innerHTML = generateSecondDungeon;

      setTimeout(() => {
        secondDungeonQuiz();
      }, 1500);
    }

    function secondDungeonQuiz() {
      if (gameOver) return;
      const newQuestion2 =
        contents.story.questions.level_2[currentQuizQuestions].text;
      const newAnswers2 =
        contents.story.questions.level_2[currentQuizAnswers].choices;

      const generateQuestions = generateFirstDungeonQuiz(
        contents.story.dungeons[1].background,
        newQuestion2
      );

      document.getElementById("app").innerHTML = generateQuestions;
      const updateLives = document.querySelector(".life-number");
      updateLives.textContent = remainingLives;

      const quizSection = document.querySelector(".multiple-choices");

      const singleQuestion = newAnswers2
        .map((item) => {
          return `
        <button class="answer">${item}</button>
      `;
        })
        .join("");
      quizSection.innerHTML = singleQuestion;

      document.querySelectorAll(".answer").forEach((answerBtn) => {
        answerBtn.addEventListener("click", () => {
          const correctAnswer =
            contents.story.questions.level_2[currentCorrectAnswers]
              .correct_answer;

          if (answerBtn.textContent === correctAnswer) {
            answerBtn.style.backgroundColor = "green";
            answerBtn.style.color = "white";
            currentQuizQuestions++;
            currentQuizAnswers++;
            currentCorrectAnswers++;
            if (
              currentQuizQuestions &&
              currentQuizAnswers >= contents.story.questions.level_2.length
            ) {
              currentQuizQuestions = 0;
              currentQuizAnswers = 0;
              currentCorrectAnswers = 0;
              remainingLives = 5;
              alert("end of questions");
              setTimeout(() => {
                showReviewPage2();
              }, 200);
              return;
            }
          } else {
            answerBtn.style.backgroundColor = "red";
            answerBtn.style.color = "white";
            remainingLives--;
          }

          if (remainingLives <= 0) {
            gameOver = true;
            handleGameOver();
          } else {
            setTimeout(() => {
              secondDungeonQuiz();
            }, 200);
          }
        });
      });
    }

    function dungeonThree() {
      const firstDungeonText = contents.story.dungeons[2].level;

      const generateThirdDungeon = generateFirstDungeonLevel(
        contents.story.dungeons[2].background,
        firstDungeonText
      );
      document.getElementById("app").innerHTML = generateThirdDungeon;

      setTimeout(() => {
        thirdDungeonQuiz();
      }, 1500);
    }

    function thirdDungeonQuiz() {
      if (gameOver) return;
      const newQuestion3 =
        contents.story.questions.level_3[currentQuizQuestions].text;
      const newAnswers3 =
        contents.story.questions.level_3[currentQuizAnswers].choices;

      const generateQuestions = generateFirstDungeonQuiz(
        contents.story.dungeons[2].background,
        newQuestion3
      );

      document.getElementById("app").innerHTML = generateQuestions;
      const updateLives = document.querySelector(".life-number");
      updateLives.textContent = remainingLives;

      const quizSection = document.querySelector(".multiple-choices");

      const singleQuestion = newAnswers3
        .map((item) => {
          return `
        <button class="answer">${item}</button>
      `;
        })
        .join("");
      quizSection.innerHTML = singleQuestion;

      document.querySelectorAll(".answer").forEach((answerBtn) => {
        answerBtn.addEventListener("click", () => {
          const correctAnswer =
            contents.story.questions.level_3[currentCorrectAnswers]
              .correct_answer;

          if (answerBtn.textContent === correctAnswer) {
            answerBtn.style.backgroundColor = "green";
            answerBtn.style.color = "white";
            currentQuizQuestions++;
            currentQuizAnswers++;
            currentCorrectAnswers++;
            if (
              currentQuizQuestions &&
              currentQuizAnswers >= contents.story.questions.level_3.length
            ) {
              currentQuizQuestions = 0;
              currentQuizAnswers = 0;
              currentCorrectAnswers = 0;
              remainingLives = 3;
              alert("end of questions");
              setTimeout(() => {
                showReviewPage3();
              }, 200);
              return;
            }
          } else {
            answerBtn.style.backgroundColor = "red";
            answerBtn.style.color = "white";
            remainingLives--;
          }

          if (remainingLives <= 0) {
            gameOver = true;
            handleGameOver();
          } else {
            setTimeout(() => {
              thirdDungeonQuiz();
            }, 200);
          }
        });
      });
    }

    // this function handles the lose page consisting of title and quote
    function handleGameOver() {
      function randomQuote() {
        const getQuotes = contents.story.epilogues.bad_ending.quotes;
        return getQuotes[Math.floor(Math.random() * getQuotes.length)];
      }
      const getTitle = contents.story.epilogues.bad_ending.description_title;

      const createRandomQuotes = randomQuote();
      const createLoseCondition = generateLoseCondition(
        contents.story.background,
        getTitle,
        createRandomQuotes
      );
      document.getElementById("app").innerHTML = createLoseCondition;
      const nextLosePage = document.querySelector(".next-desc");
      nextLosePage.addEventListener("click", () => {
        updateLoseDescription();
      });
    }

    // function to continue to the descriptions
    function updateLoseDescription() {
      const getDescription =
        contents.story.epilogues.bad_ending.description[loseConditionIndex].par;

      const loseDescription = generateLoseConditionDescription(
        contents.story.background,
        getDescription
      );

      document.getElementById("app").innerHTML = loseDescription;

      // the button creaated after the within the lose description page will go on the last description and will restart the game
      const startOver = document.querySelector(".start-over");
      startOver.addEventListener("click", () => {
        loseConditionIndex++;

        if (
          loseConditionIndex >=
          contents.story.epilogues.bad_ending.description.length
        ) {
          alert("game akan dimulai dari awal");
          function resetGame() {
            currentQuizAnswers = 0;
            currentCorrectAnswers = 0;
            currentQuizQuestions = 0;
            remainingLives = 3;
            loseConditionIndex = 0;
            gameOver = false;
          }
          resetGame();
          setTimeout(() => {
            dungeon();
          }, 400);
        } else {
          updateLoseDescription();
        }
      });
    }

    function showReviewPage() {
      const generateBgReview = generateReviewPage(
        contents.story.dungeons[0].background
      );

      document.getElementById("app").innerHTML = generateBgReview;

      const createReviewDropdown = contents.story.questions.level_1
        .map((item) => {
          return `
          <div class="explanation">
            <details>
              <summary>${item.text}</summary>
            <div>
              <h3>${item.correct_answer}</h3>
              <p>Penjelasan:</p>
              <p>${item.explanation}</p>
            </div>
            </details>
          </div>
      `;
        })
        .join("");

      document.querySelector(".explanation-wrapper").innerHTML =
        createReviewDropdown;

      const nextStory = document.querySelector(".next-story");
      nextStory.addEventListener("click", () => {
        afterStoryDungeon1();
      });
    }

    function showReviewPage2() {
      const generateBgReview = generateReviewPage(
        contents.story.dungeons[1].background
      );

      document.getElementById("app").innerHTML = generateBgReview;

      const createReviewDropdown = contents.story.questions.level_2
        .map((item) => {
          return `
          <div class="explanation">
            <details>
              <summary>${item.text}</summary>
            <div>
              <h3>${item.correct_answer}</h3>
              <p>Penjelasan:</p>
              <p>${item.explanation}</p>
            </div>
            </details>
          </div>
      `;
        })
        .join("");

      document.querySelector(".explanation-wrapper").innerHTML =
        createReviewDropdown;

      const nextStory = document.querySelector(".next-story");
      nextStory.addEventListener("click", () => {
        afterStoryDungeon2();
      });
    }

    function showReviewPage3() {
      const generateBgReview = generateReviewPage(
        contents.story.dungeons[2].background
      );

      document.getElementById("app").innerHTML = generateBgReview;

      const createReviewDropdown = contents.story.questions.level_3
        .map((item) => {
          return `
          <div class="explanation">
            <details>
              <summary>${item.text}</summary>
            <div>
              <h3>${item.correct_answer}</h3>
              <p>Penjelasan:</p>
              <p>${item.explanation}</p>
            </div>
            </details>
          </div>
      `;
        })
        .join("");

      document.querySelector(".explanation-wrapper").innerHTML =
        createReviewDropdown;

      const nextStory = document.querySelector(".next-story");
      nextStory.addEventListener("click", () => {
        afterStoryDungeon3();
      });
    }

    function afterStoryDungeon1() {
      const getAfterStory =
        contents.story.after_dungeon_1_story[currentAfterStoryDungeon1].story;

      const generateAfterStory = generatePrologue(
        contents.story.background,
        getAfterStory
      );
      document.getElementById("app").innerHTML = generateAfterStory;

      const nextBtn = document.querySelector(".next");
      nextBtn.addEventListener("click", () => {
        currentAfterStoryDungeon1++;

        if (
          currentAfterStoryDungeon1 >=
          contents.story.after_dungeon_1_story.length
        ) {
          alert("Kamu akan menghadapi dungeon 2");
          return dungeonTwo();
        }

        afterStoryDungeon1();
      });
    }

    function afterStoryDungeon2() {
      const getAfterStory =
        contents.story.after_dungeon_2_story[currentAfterStoryDungeon2].story;

      const generateAfterStory = generatePrologue(
        contents.story.background,
        getAfterStory
      );
      document.getElementById("app").innerHTML = generateAfterStory;

      const nextBtn = document.querySelector(".next");
      nextBtn.addEventListener("click", () => {
        currentAfterStoryDungeon2++;

        if (
          currentAfterStoryDungeon2 >=
          contents.story.after_dungeon_2_story.length
        ) {
          alert("Kamu akan menghadapi dungeon 3");
          return dungeonThree();
        }

        afterStoryDungeon2();
      });
    }

    function afterStoryDungeon3() {
      const getAfterStory =
        contents.story.after_dungeon_2_story[currentAfterStoryDungeon2].story;

      const generateAfterStory = generatePrologue(
        contents.story.background,
        getAfterStory
      );
      document.getElementById("app").innerHTML = generateAfterStory;

      const nextBtn = document.querySelector(".next");
      nextBtn.addEventListener("click", () => {
        currentAfterStoryDungeon2++;

        if (
          currentAfterStoryDungeon2 >=
          contents.story.after_dungeon_2_story.length
        ) {
          alert("Congrats!");
          // return dungeonThree();
        }

        afterStoryDungeon3();
      });
    }
  }

  getData();
});