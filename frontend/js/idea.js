const ideaForm = document.getElementById("ideaForm");
  const ideaList = document.getElementById("ideaList");
  const yourIdeasList = document.getElementById("yourIdeasList");
  const searchInput = document.getElementById("searchInput");
  const languageFilter = document.getElementById("languageFilter");
  const difficultyFilter = document.getElementById("difficultyFilter");
  const themeToggle = document.getElementById("themeToggle");

  let ideas = JSON.parse(localStorage.getItem("ideaForgeIdeas")) || [];

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function saveIdeas() {
    localStorage.setItem("ideaForgeIdeas", JSON.stringify(ideas));
  }

  function showNotification(message) {
    alert(message);
  }

  function createIdeaCard(idea) {
    return `
      <div class="idea-card" data-id="${idea.id}">
        <h3>${idea.title}</h3>
        <p>${idea.description}</p>
        <div>
          ${idea.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          <span class="difficulty ${idea.difficulty}">
            ${idea.difficulty.charAt(0).toUpperCase() + idea.difficulty.slice(1)}
          </span>
        </div>
        <button class="upvote-btn">👍 ${idea.upvotes || 0}</button>
        <button class="comment-btn">💬 Comment</button>
        <div class="comments-section" style="display: none;">
          <div class="comments-list">
            ${idea.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
          </div>
          <div class="comment-form">
            <input type="text" class="comment-input" placeholder="Add a comment..." />
            <button class="submit-comment">Submit</button>
          </div>
        </div>
      </div>
    `;
  }

  function displayIdeas(currentNickname = "") {
    const searchText = searchInput.value.toLowerCase();
    const selectedLang = languageFilter.value;
    const selectedDifficulty = difficultyFilter.value;

    const communityIdeas = ideas.filter(idea => {
      const matchSearch = idea.title.toLowerCase().includes(searchText) || 
                          idea.description.toLowerCase().includes(searchText);
      const matchLang = !selectedLang || idea.tags.some(tag => tag.toLowerCase() === selectedLang.toLowerCase());
      const matchDifficulty = !selectedDifficulty || idea.difficulty === selectedDifficulty;
      return matchSearch && matchLang && matchDifficulty;
    });

    const userIdeas = currentNickname
      ? ideas.filter(idea => idea.nickname === currentNickname)
      : [];

    ideaList.innerHTML = communityIdeas.length
      ? communityIdeas.map(idea => createIdeaCard(idea)).join("")
      : '<div class="empty-state"><p>No ideas found matching your criteria</p></div>';

    yourIdeasList.innerHTML = userIdeas.length
      ? userIdeas.map(idea => createIdeaCard(idea)).join("")
      : `<div class="empty-state"><p>${
          currentNickname 
            ? "You haven't submitted any ideas yet" 
            : "Enter a nickname to see your submissions"
        }</p></div>`;

    attachUpvoteListeners();
    attachCommentListeners();
  }

  function attachUpvoteListeners() {
    document.querySelectorAll(".upvote-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".idea-card");
        const id = card.dataset.id;
        const idea = ideas.find(i => i.id === id);
        if (idea) {
          idea.upvotes = (idea.upvotes || 0) + 1;
          saveIdeas();
          displayIdeas(document.getElementById("nickname").value.trim());
        }
      });
    });
  }

  function attachCommentListeners() {
    document.querySelectorAll(".comment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const section = btn.nextElementSibling;
        section.style.display = section.style.display === "none" ? "block" : "none";
      });
    });

    document.querySelectorAll(".submit-comment").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".idea-card");
        const id = card.dataset.id;
        const input = card.querySelector(".comment-input");
        const text = input.value.trim();
        if (!text) return;

        const idea = ideas.find(i => i.id === id);
        if (idea) {
          idea.comments.push(text);
          saveIdeas();
          displayIdeas(document.getElementById("nickname").value.trim());
        }
      });
    });
  }

  ideaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim()).filter(tag => tag);
    const difficulty = document.getElementById("difficulty").value;

    if (!title || !description || !difficulty) {
      showNotification("Please fill in all required fields.");
      return;
    }

    const newIdea = {
      id: generateId(),
      nickname,
      title,
      description,
      tags,
      difficulty,
      upvotes: 0,
      comments: [],
    };

    ideas.push(newIdea);
    saveIdeas();
    showNotification("Idea submitted successfully!");
    ideaForm.reset();
    displayIdeas(nickname);
  });

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    themeToggle.textContent = isDark ? "🌕 Light Mode" : "🌓 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "🌕 Light Mode";
    }

    displayIdeas();
  });

  [searchInput, languageFilter, difficultyFilter].forEach(input => {
    input.addEventListener("input", () => {
      displayIdeas(document.getElementById("nickname").value.trim());
    });
  });