import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [ideas, setIdeas] = useState([]);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Fetch ideas from the server
        const fetchIdeas = async () => {
            const response = await axios.get('http://localhost:5000/ideas');
            setIdeas(response.data);
        };
        fetchIdeas();
    }, []);

    const submitIdea = async () => {
        await axios.post('http://localhost:5000/ideas', { title, description, nickname });
        setTitle('');
        setDescription('');
    };
    document.addEventListener("DOMContentLoaded", () => {
        // Simple authentication simulation
        const loginForm = document.querySelector("form");
        if (loginForm) {
          loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
      
            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;
      
            if (email.endsWith("@gmail.com") && password.length >= 8) {
              // Redirect to dashboard after successful login
              window.location.href = "dashboard.html";
            } else {
              alert("Invalid credentials. Please check your email or password.");
            }
          });
        }
      
        // Logout functionality
        const logoutLink = document.querySelector("a[href='#logout']");
        if (logoutLink) {
          logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "login.html";
          });
        }
      
        // Hero button navigation from dashboard to login
        const heroButton = document.querySelector(".hero .btn");
        if (heroButton) {
          heroButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "login.html";
          });
        }
      
        // Search + filter for ideas page (if present)
        const searchInput = document.getElementById("searchInput");
        const languageFilter = document.getElementById("languageFilter");
        const difficultyFilter = document.getElementById("difficultyFilter");
        const ideaCards = document.querySelectorAll(".idea-card");
      
        function filterIdeas() {
          const query = searchInput?.value.toLowerCase() || "";
          const language = languageFilter?.value || "";
          const difficulty = difficultyFilter?.value || "";
      
          ideaCards.forEach(card => {
            const content = card.innerText.toLowerCase();
            const matchesQuery = content.includes(query);
            const matchesLanguage = !language || card.dataset.language === language;
            const matchesDifficulty = !difficulty || card.dataset.difficulty === difficulty;
      
            if (matchesQuery && matchesLanguage && matchesDifficulty) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });
        }
      
        if (searchInput && languageFilter && difficultyFilter) {
          searchInput.addEventListener("input", filterIdeas);
          languageFilter.addEventListener("change", filterIdeas);
          difficultyFilter.addEventListener("change", filterIdeas);
        }
      });
      