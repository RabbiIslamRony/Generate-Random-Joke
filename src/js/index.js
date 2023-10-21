"use strict";

import generateJoke from "./generateJoke";
import "../css/style.css";
import '../css/main.scss'
import laughing from "../images/rony.png";

const laughImg = document.getElementById("laughImg");
laughImg.src = laughing;

const jokeBtn = document.getElementById("jokeBtn");
jokeBtn.addEventListener("click", generateJoke)
console.log(generateJoke);