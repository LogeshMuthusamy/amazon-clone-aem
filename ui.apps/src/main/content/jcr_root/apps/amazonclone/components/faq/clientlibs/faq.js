document.addEventListener("DOMContentLoaded", function () {
  // Attach behavior per component instance so multiple components work independently
  document.querySelectorAll(".faq-component").forEach(function (component) {
    const questions = component.querySelectorAll(".faq-question");
    const expandBtn = component.querySelector(".expand-all");
    const collapseBtn = component.querySelector(".collapse-all");

    questions.forEach(function (question) {
      question.addEventListener("click", function () {
        const item = this.closest(".faq-item");
        const answer = this.nextElementSibling;
        if (item && answer) {
          const isExpanded = item.classList.toggle("expanded");
          if (isExpanded) {
            answer.classList.add("show");
          } else {
            answer.classList.remove("show");
          }
        }
      });
    });

    if (expandBtn) {
      expandBtn.addEventListener("click", function () {
        component.querySelectorAll(".faq-item").forEach(function (item) {
          item.classList.add("expanded");
          const answer = item.querySelector(".faq-answer");
          if (answer) {
            answer.classList.add("show");
          }
        });
      });
    }

    if (collapseBtn) {
      collapseBtn.addEventListener("click", function () {
        component.querySelectorAll(".faq-item").forEach(function (item) {
          item.classList.remove("expanded");
          const answer = item.querySelector(".faq-answer");
          if (answer) {
            answer.classList.remove("show");
          }
        });
      });
    }
  });
});
