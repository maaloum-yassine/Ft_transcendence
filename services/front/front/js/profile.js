import { urlLocationHandler } from "./url-router.js";

const initProfile = () => {
  const logoLink = document.querySelector(".logo");

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", "/home");
      urlLocationHandler();
    });
  }
};

export default initProfile;
