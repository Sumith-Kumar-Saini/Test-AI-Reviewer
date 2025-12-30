/** @type {HTMLFormElement} */
const form = document.querySelector("form");
/** @type {HTMLInputElement} */
const promptInput = document.querySelector("#prompt");
/** @type {HTMLTextAreaElement} */
const fileInput = document.querySelector("#file");
/** @type {HTMLDivElement} */
const output = document.querySelector("#output");
/** @type {HTMLButtonElement} */
const submit = document.querySelector("#submit");
/** @type {HTMLDivElement} */
const loading = document.querySelector(".loading-state");

form.addEventListener("submit", (el) => {
  el.preventDefault();
  sendPrompt();
});

async function sendPrompt() {
  const promptContent = promptInput.value.trim();
  const fileContent = fileInput.value.trim();
  console.log({ promptContent, fileContent });
  if (promptContent && fileContent) {
    loading.style.display = "block";
    try {
      const { data } = await axios.post("/service/reviewer", {
        prompt: promptContent,
        file: fileContent,
      });
      loading.style.display = "none";
      const review = JSON.stringify(data.review, null, 2).trim().split("\n");
      const ReviewedContent = review
        .map((content, idx) => {
          return `<pre id="pre-${idx + 1}">${content}</pre>`;
        })
        .join("");

      output.innerHTML =
        typeof data.review === "string" ? data.review : ReviewedContent;
    } catch (error) {
      loading.style.display = "none";
      output.innerHTML = `<p class=\"error-message\">Error: ${error.message}</p>`;
    }
  }
}
