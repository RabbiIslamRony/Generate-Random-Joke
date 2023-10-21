import generateJoke from "./generateJoke";
import '../src/styles/main.scss'
import laughing from "./assets/rony.png";

const laughImg = document.getElementById("laughImg");
laughImg.src = laughing;

const jokeBtn = document.getElementById("jokeBtn");
jokeBtn.addEventListener("click", generateJoke)
console.log(generateJoke);