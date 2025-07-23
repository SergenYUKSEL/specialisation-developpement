import { renderHeader, logoutHeaderEvents } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { redirectIfNotAuthenticated } from "../utils/auth.js";

redirectIfNotAuthenticated();

const header = document.getElementById("header");
const footer = document.getElementById("footer");

header.innerHTML = renderHeader();
logoutHeaderEvents();
footer.innerHTML = renderFooter();
