import { urlLocationHandler } from "./url-router.js";

const initgame_tic = () => {
  const tictactoe_btn = document.getElementById("startButton");

  if (tictactoe_btn) {
    tictactoe_btn.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", "/tictactoe_game");
      urlLocationHandler();
    });
  }
  const logoLink = document.querySelector(".logo");

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", "/home");
      urlLocationHandler();
    });
  }
};

export default initgame_tic;
