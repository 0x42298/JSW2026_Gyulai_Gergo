"use strict";

const tags = document.querySelectorAll(".category-tag");
const categoryBlocks = document.querySelectorAll(".category-block");

const form = document.getElementById("fillCalculator");
const lengthInput = document.getElementById("length");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const formError = document.getElementById("formError");

const resultOverlay = document.getElementById("resultOverlay");
const closeDialogButton = document.getElementById("closeDialog");
const resultText = document.getElementById("resultText");

function setActiveTag(clickedTag) {
  tags.forEach((tag) => {
    const isActive = tag === clickedTag;
    tag.classList.toggle("active", isActive);
    tag.setAttribute("aria-selected", String(isActive));
  });
}

function filterCategories(targetCategory) {
  categoryBlocks.forEach((block) => {
    const shouldShow = targetCategory === "all" || block.dataset.category === targetCategory;
    block.hidden = !shouldShow;
  });
}

tags.forEach((tag) => {
  tag.addEventListener("click", () => {
    setActiveTag(tag);
    filterCategories(tag.dataset.target);
  });
});

function closeDialog() {
  resultOverlay.classList.remove("visible");
  resultOverlay.setAttribute("aria-hidden", "true");
}

function validateInput(value) {
  if (value === "") {
    return "Minden mező kitöltése kötelező.";
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "Az adatok csak számok lehetnek.";
  }

  if (numericValue <= 0) {
    return "A számok nem lehetnek nullák vagy negatívak.";
  }

  return "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputValues = [lengthInput.value.trim(), widthInput.value.trim(), heightInput.value.trim()];

  for (const value of inputValues) {
    const errorMessage = validateInput(value);
    if (errorMessage) {
      formError.textContent = errorMessage;
      return;
    }
  }

  const length = Number(lengthInput.value);
  const width = Number(widthInput.value);
  const height = Number(heightInput.value);

  const volumeCm3 = length * width * height;
  const volumeLiters = volumeCm3 / 1000;

  const formattedCm3 = volumeCm3.toLocaleString("hu-HU");
  const formattedLiters = volumeLiters.toLocaleString("hu-HU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  resultText.textContent = `A doboz maximum térkitöltő igénye: ${formattedCm3} cm³ (≈ ${formattedLiters} liter).`;

  formError.textContent = "";
  form.reset();

  resultOverlay.classList.add("visible");
  resultOverlay.setAttribute("aria-hidden", "false");
});

closeDialogButton.addEventListener("click", closeDialog);

resultOverlay.addEventListener("click", (event) => {
  if (event.target === resultOverlay) {
    closeDialog();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resultOverlay.classList.contains("visible")) {
    closeDialog();
  }
});

filterCategories("all");
