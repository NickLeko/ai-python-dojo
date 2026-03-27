(function () {
  const STORAGE_KEY = "ai-python-dojo-progress";
  const XP_BY_DIFFICULTY = {
    easy: 10,
    medium: 15,
    hard: 20
  };

  const state = {
    screen: "home",
    filters: {
      mode: "all",
      source: "all",
      difficulty: "all",
      tag: "all"
    },
    session: {
      queue: [],
      index: 0,
      limit: null
    },
    currentChallenge: null,
    currentAnswer: null,
    feedbackVisible: false,
    progress: loadProgress()
  };

  const elements = {
    screens: document.querySelectorAll(".screen"),
    navLinks: document.querySelectorAll(".nav-link"),
    startModeButtons: document.querySelectorAll(".start-mode-button"),
    presetButtons: document.querySelectorAll(".preset-button"),
    modeFilter: document.getElementById("mode-filter"),
    sourceFilter: document.getElementById("source-filter"),
    difficultyFilter: document.getElementById("difficulty-filter"),
    tagFilter: document.getElementById("tag-filter"),
    startRandomButton: document.getElementById("start-random-button"),
    practiceTitle: document.getElementById("practice-title"),
    practicePosition: document.getElementById("practice-position"),
    practiceModeBadge: document.getElementById("practice-mode-badge"),
    practiceDifficultyBadge: document.getElementById("practice-difficulty-badge"),
    sessionProgressLabel: document.getElementById("session-progress-label"),
    sessionProgressValue: document.getElementById("session-progress-value"),
    sessionProgressFill: document.getElementById("session-progress-fill"),
    sessionCompleteCard: document.getElementById("session-complete-card"),
    sessionCompleteTitle: document.getElementById("session-complete-title"),
    sessionCompleteCopy: document.getElementById("session-complete-copy"),
    sessionCompleteAccuracy: document.getElementById("session-complete-accuracy"),
    sessionCompleteCorrect: document.getElementById("session-complete-correct"),
    sessionCompleteXp: document.getElementById("session-complete-xp"),
    sessionReplayButton: document.getElementById("session-replay-button"),
    sessionStatsButton: document.getElementById("session-stats-button"),
    challengeTitle: document.getElementById("challenge-title"),
    challengePrompt: document.getElementById("challenge-prompt"),
    challengeCode: document.getElementById("challenge-code"),
    challengeTags: document.getElementById("challenge-tags"),
    answerArea: document.getElementById("answer-area"),
    submitAnswerButton: document.getElementById("submit-answer-button"),
    nextChallengeButton: document.getElementById("next-challenge-button"),
    feedbackPanel: document.getElementById("feedback-panel"),
    feedbackStatus: document.getElementById("feedback-status"),
    feedbackAnswer: document.getElementById("feedback-answer"),
    feedbackAnswerCode: document.getElementById("feedback-answer-code"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    feedbackAiContext: document.getElementById("feedback-ai-context"),
    feedbackTakeaway: document.getElementById("feedback-takeaway"),
    resetProgressButton: document.getElementById("reset-progress-button"),
    statXp: document.getElementById("stat-xp"),
    statAccuracy: document.getElementById("stat-accuracy"),
    statStreak: document.getElementById("stat-streak"),
    statBestStreak: document.getElementById("stat-best-streak"),
    overallDetailList: document.getElementById("overall-detail-list"),
    modeDetailList: document.getElementById("mode-detail-list"),
    tagDetailList: document.getElementById("tag-detail-list"),
    modeCountRead: document.getElementById("mode-count-read"),
    modeCountDebug: document.getElementById("mode-count-debug"),
    modeCountPatch: document.getElementById("mode-count-patch"),
    modeMissedRead: document.getElementById("mode-missed-read"),
    modeMissedDebug: document.getElementById("mode-missed-debug"),
    modeMissedPatch: document.getElementById("mode-missed-patch")
  };

  const allTags = [...new Set(window.CHALLENGES.flatMap((challenge) => challenge.tags))].sort();

  initialize();

  function initialize() {
    populateTagFilter();
    wireEvents();
    renderStats();
    renderModeCards();
    showScreen("home");
  }

  function wireEvents() {
    elements.navLinks.forEach((button) => {
      button.addEventListener("click", () => showScreen(button.dataset.screen));
    });

    elements.startModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        elements.modeFilter.value = button.dataset.mode;
        state.filters.mode = button.dataset.mode;
        state.session.limit = null;
        startPractice(true);
      });
    });

    elements.presetButtons.forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });

    [elements.modeFilter, elements.sourceFilter, elements.difficultyFilter, elements.tagFilter].forEach((input) => {
      input.addEventListener("change", () => {
        state.filters.mode = elements.modeFilter.value;
        state.filters.source = elements.sourceFilter.value;
        state.filters.difficulty = elements.difficultyFilter.value;
        state.filters.tag = elements.tagFilter.value;
        renderModeCards();
      });
    });

    elements.startRandomButton.addEventListener("click", () => {
      state.session.limit = null;
      startPractice(true);
    });
    elements.submitAnswerButton.addEventListener("click", submitAnswer);
    elements.nextChallengeButton.addEventListener("click", () => {
      state.session.index += 1;
      if (state.session.index >= state.session.queue.length) {
        showSessionComplete();
      } else {
        startPractice();
      }
    });
    elements.resetProgressButton.addEventListener("click", resetProgress);
    elements.sessionReplayButton.addEventListener("click", () => {
      state.session.limit = state.session.queue.length || state.session.limit;
      startPractice(true);
    });
    elements.sessionStatsButton.addEventListener("click", () => showScreen("stats"));

    document.addEventListener("keydown", handleKeyboardShortcuts);
  }

  function populateTagFilter() {
    allTags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = tag;
      elements.tagFilter.appendChild(option);
    });
  }

  function showScreen(name) {
    state.screen = name;
    elements.screens.forEach((screen) => {
      screen.classList.toggle("active", screen.id === `screen-${name}`);
    });
    if (name === "stats") {
      renderStats();
    }
  }

  function startPractice(resetQueue) {
    if (resetQueue || !state.session.queue.length || state.session.index >= state.session.queue.length) {
      state.session.queue = buildSessionQueue();
      state.session.index = 0;
      state.session.correctCount = 0;
      state.session.answeredCount = 0;
      state.session.xpEarned = 0;
    }

    const challenge = state.session.queue[state.session.index] || null;
    if (!challenge) {
      alert("No challenges match those filters yet. Try All challenges or a different mode.");
      return;
    }

    state.currentChallenge = challenge;
    state.currentAnswer = null;
    state.feedbackVisible = false;

    elements.sessionCompleteCard.hidden = true;
    renderChallenge(challenge);
    renderSessionProgress();
    showScreen("practice");
  }

  function getFilteredChallenges() {
    return window.CHALLENGES.filter((challenge) => {
      if (state.filters.mode !== "all" && challenge.mode !== state.filters.mode) {
        return false;
      }
      if (state.filters.difficulty !== "all" && challenge.difficulty !== state.filters.difficulty) {
        return false;
      }
      if (state.filters.tag !== "all" && !challenge.tags.includes(state.filters.tag)) {
        return false;
      }
      if (state.filters.source === "unanswered" && state.progress.completedIds.includes(challenge.id)) {
        return false;
      }
      if (state.filters.source === "missed" && !state.progress.missedIds.includes(challenge.id)) {
        return false;
      }
      return true;
    });
  }

  function buildSessionQueue() {
    const filtered = getFilteredChallenges();
    if (!filtered.length) {
      return [];
    }

    const unseen = filtered.filter((challenge) => !state.progress.completedIds.includes(challenge.id));
    const pool = unseen.length ? unseen : filtered;
    const shuffled = shuffle([...pool]);
    return state.session.limit ? shuffled.slice(0, state.session.limit) : shuffled;
  }

  function renderChallenge(challenge) {
    elements.practiceTitle.textContent = challenge.title;
    elements.practiceModeBadge.textContent = formatMode(challenge.mode);
    elements.practiceDifficultyBadge.textContent = capitalize(challenge.difficulty);
    elements.challengeTitle.textContent = challenge.title;
    elements.challengePrompt.textContent = challenge.prompt;
    elements.challengeCode.textContent = challenge.code;
    elements.challengeTags.innerHTML = "";

    challenge.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      elements.challengeTags.appendChild(span);
    });

    elements.answerArea.innerHTML = "";
    elements.submitAnswerButton.hidden = false;
    elements.nextChallengeButton.hidden = true;
    elements.feedbackPanel.hidden = true;
    elements.feedbackPanel.className = "feedback-panel";
    elements.feedbackAnswer.hidden = true;
    elements.feedbackAnswerCode.textContent = "";
    elements.feedbackAiContext.textContent = "";

    if (challenge.type.startsWith("multiple_choice")) {
      renderMultipleChoice(challenge);
    } else {
      renderPatchInput(challenge);
    }
  }

  function renderMultipleChoice(challenge) {
    challenge.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "answer-option";
      button.type = "button";
      button.innerHTML = `<strong>${index + 1}.</strong> ${escapeHtml(option).replace(/\n/g, "<br>")}`;
      button.addEventListener("click", () => {
        state.currentAnswer = index;
        [...elements.answerArea.children].forEach((child) => child.classList.remove("selected"));
        button.classList.add("selected");
      });
      elements.answerArea.appendChild(button);
    });
  }

  function renderPatchInput(challenge) {
    const hint = document.createElement("p");
    hint.className = "patch-hint";
    hint.textContent = challenge.type === "two_line_patch" ? "Enter up to two lines." : "Enter one corrected line.";

    const textarea = document.createElement(challenge.type === "two_line_patch" ? "textarea" : "input");
    textarea.className = "patch-input";
    textarea.id = "patch-input";

    if (challenge.type === "two_line_patch") {
      textarea.rows = 4;
      textarea.placeholder = "Type the tiny patch here";
    } else {
      textarea.type = "text";
      textarea.placeholder = "Type the corrected line here";
    }

    textarea.addEventListener("input", () => {
      state.currentAnswer = textarea.value;
    });

    elements.answerArea.append(hint, textarea);
  }

  function submitAnswer() {
    const challenge = state.currentChallenge;
    if (!challenge) {
      return;
    }

    if (challenge.type.startsWith("multiple_choice") && typeof state.currentAnswer !== "number") {
      alert("Pick an answer first.");
      return;
    }

    if (!challenge.type.startsWith("multiple_choice") && !String(state.currentAnswer || "").trim()) {
      alert("Enter your patch first.");
      return;
    }

    const isCorrect = challenge.type.startsWith("multiple_choice")
      ? state.currentAnswer === challenge.correctAnswer
      : isAcceptedPatch(state.currentAnswer, challenge.acceptedAnswers);

    const xpGain = updateProgress(challenge, isCorrect);
    revealFeedback(challenge, isCorrect, xpGain);
    renderStats();
  }

  function revealFeedback(challenge, isCorrect, xpGain) {
    state.feedbackVisible = true;
    elements.submitAnswerButton.hidden = true;
    elements.nextChallengeButton.hidden = false;
    elements.feedbackPanel.hidden = false;
    elements.feedbackPanel.classList.add(isCorrect ? "correct" : "incorrect");
    elements.feedbackStatus.textContent = isCorrect
      ? `Correct. +${xpGain} XP`
      : "Not quite.";
    if (challenge.type.startsWith("multiple_choice")) {
      elements.feedbackAnswer.hidden = false;
      elements.feedbackAnswerCode.textContent = `Correct answer:\n${challenge.options[challenge.correctAnswer]}`;
    } else if (challenge.acceptedAnswers && challenge.acceptedAnswers.length) {
      elements.feedbackAnswer.hidden = false;
      elements.feedbackAnswerCode.textContent = `Accepted answer:\n${challenge.acceptedAnswers[0]}`;
    }
    elements.feedbackExplanation.textContent = challenge.explanation;
    elements.feedbackAiContext.textContent = buildAiContext(challenge);
    elements.feedbackTakeaway.textContent = `Takeaway: ${challenge.takeaway}`;

    if (challenge.type.startsWith("multiple_choice")) {
      [...elements.answerArea.children].forEach((button, index) => {
        button.disabled = true;
        if (index === challenge.correctAnswer) {
          button.classList.add("correct");
        } else if (index === state.currentAnswer && !isCorrect) {
          button.classList.add("incorrect");
        }
      });
    }
  }

  function updateProgress(challenge, isCorrect) {
    const progress = state.progress;
    const xpGain = isCorrect ? awardXp(challenge.difficulty) + streakBonus(progress.currentStreak + 1) : 0;
    const session = state.session;
    session.correctCount = (session.correctCount || 0) + (isCorrect ? 1 : 0);
    session.answeredCount = (session.answeredCount || 0) + 1;
    session.xpEarned = (session.xpEarned || 0) + xpGain;

    progress.totalAnswered += 1;
    if (isCorrect) {
      progress.correctCount += 1;
      progress.totalXp += xpGain;
      progress.currentStreak += 1;
      progress.bestStreak = Math.max(progress.bestStreak, progress.currentStreak);
      removeFromArray(progress.missedIds, challenge.id);
    } else {
      progress.currentStreak = 0;
      if (!progress.missedIds.includes(challenge.id)) {
        progress.missedIds.push(challenge.id);
      }
    }

    if (!progress.completedIds.includes(challenge.id)) {
      progress.completedIds.push(challenge.id);
    }

    const modeStats = progress.modeStats[challenge.mode];
    modeStats.answered += 1;
    if (isCorrect) {
      modeStats.correct += 1;
    }
    modeStats.bestAccuracy = Math.max(modeStats.bestAccuracy, calcAccuracy(modeStats.correct, modeStats.answered));

    challenge.tags.forEach((tag) => {
      const current = progress.tagStats[tag] || { answered: 0, correct: 0 };
      current.answered += 1;
      if (isCorrect) {
        current.correct += 1;
      }
      progress.tagStats[tag] = current;
    });

    saveProgress(progress);
    renderModeCards();
    return xpGain;
  }

  function renderSessionProgress() {
    const total = state.session.queue.length || 1;
    const current = Math.min(state.session.index + 1, total);
    const percent = Math.round((state.session.index / total) * 100);
    elements.practicePosition.textContent = `Challenge ${current} of ${total}`;
    elements.sessionProgressLabel.textContent = state.session.limit ? `Session goal: ${total} reps` : "Session progress";
    elements.sessionProgressValue.textContent = `${percent}%`;
    elements.sessionProgressFill.style.width = `${percent}%`;
  }

  function showSessionComplete() {
    const total = state.session.queue.length || 0;
    const correct = state.session.correctCount || 0;
    const xpEarned = state.session.xpEarned || 0;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const badge = accuracy === 100 ? "Perfect Run" : accuracy >= 80 ? "Dojo Clear" : "Session Complete";

    elements.sessionCompleteCard.hidden = false;
    elements.sessionCompleteTitle.textContent = badge;
    elements.sessionCompleteCopy.textContent = accuracy === 100
      ? "You cleared the whole set without dropping a rep. Strong precision."
      : "You finished the set. Review the misses or jump into another short run.";
    elements.sessionCompleteAccuracy.textContent = `${accuracy}%`;
    elements.sessionCompleteCorrect.textContent = `${correct}/${total}`;
    elements.sessionCompleteXp.textContent = `+${xpEarned}`;
    elements.sessionProgressValue.textContent = "100%";
    elements.sessionProgressFill.style.width = "100%";
  }

  function renderStats() {
    const progress = state.progress;
    elements.statXp.textContent = progress.totalXp;
    elements.statAccuracy.textContent = `${calcAccuracy(progress.correctCount, progress.totalAnswered)}%`;
    elements.statStreak.textContent = progress.currentStreak;
    elements.statBestStreak.textContent = progress.bestStreak;

    renderDetailList(elements.overallDetailList, [
      ["Challenges completed", progress.completedIds.length],
      ["Total answered", progress.totalAnswered],
      ["Correct answers", progress.correctCount],
      ["Missed challenges saved", progress.missedIds.length]
    ]);

    renderDetailList(elements.modeDetailList, Object.entries(progress.modeStats).map(([mode, stats]) => {
      const accuracy = `${calcAccuracy(stats.correct, stats.answered)}%`;
      return [`${formatMode(mode)} accuracy`, `${accuracy} (${stats.correct}/${stats.answered})`];
    }));

    const topTags = Object.entries(progress.tagStats)
      .sort((a, b) => b[1].answered - a[1].answered)
      .slice(0, 6)
      .map(([tag, stats]) => [tag, `${calcAccuracy(stats.correct, stats.answered)}% over ${stats.answered}`]);

    renderDetailList(
      elements.tagDetailList,
      topTags.length ? topTags : [["No tag data yet", "Practice a few reps to populate this."]]
    );
  }

  function renderDetailList(target, rows) {
    target.innerHTML = "";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "detail-row";
      row.innerHTML = `<span>${escapeHtml(String(label))}</span><strong>${escapeHtml(String(value))}</strong>`;
      target.appendChild(row);
    });
  }

  function loadProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored ? mergeProgress(stored) : defaultProgress();
    } catch (error) {
      return defaultProgress();
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function resetProgress() {
    const confirmed = window.confirm("Reset all local AI Python Dojo progress on this device?");
    if (!confirmed) {
      return;
    }
    state.progress = defaultProgress();
    saveProgress(state.progress);
    renderStats();
    renderModeCards();
    showScreen("home");
  }

  function renderModeCards() {
    const counts = {
      read: window.CHALLENGES.filter((challenge) => challenge.mode === "read").length,
      debug: window.CHALLENGES.filter((challenge) => challenge.mode === "debug").length,
      patch: window.CHALLENGES.filter((challenge) => challenge.mode === "patch").length
    };

    const missed = { read: 0, debug: 0, patch: 0 };
    state.progress.missedIds.forEach((id) => {
      const challenge = window.CHALLENGES.find((item) => item.id === id);
      if (challenge) {
        missed[challenge.mode] += 1;
      }
    });

    elements.modeCountRead.textContent = `${counts.read} reps`;
    elements.modeCountDebug.textContent = `${counts.debug} reps`;
    elements.modeCountPatch.textContent = `${counts.patch} reps`;
    elements.modeMissedRead.textContent = `${missed.read} missed`;
    elements.modeMissedDebug.textContent = `${missed.debug} missed`;
    elements.modeMissedPatch.textContent = `${missed.patch} missed`;
  }

  function applyPreset(preset) {
    state.session.limit = null;

    if (preset === "quick5") {
      state.filters = { mode: "all", source: "all", difficulty: "all", tag: "all" };
      state.session.limit = 5;
    } else if (preset === "missed") {
      state.filters = { mode: "all", source: "missed", difficulty: "all", tag: "all" };
    } else if (preset === "patch") {
      state.filters = { mode: "patch", source: "all", difficulty: "all", tag: "all" };
    } else if (preset === "json") {
      state.filters = { mode: "all", source: "all", difficulty: "all", tag: "json" };
    }

    syncFilterInputs();
    renderModeCards();
    startPractice(true);
  }

  function syncFilterInputs() {
    elements.modeFilter.value = state.filters.mode;
    elements.sourceFilter.value = state.filters.source;
    elements.difficultyFilter.value = state.filters.difficulty;
    elements.tagFilter.value = state.filters.tag;
  }

  function buildAiContext(challenge) {
    const topTags = challenge.tags.slice(0, 2).join(" + ");
    return `Why this matters in AI workflows: this pattern shows up in ${topTags || "common"} pipeline code where a tiny Python mistake can break parsing, validation, or control flow.`;
  }

  function defaultProgress() {
    return {
      totalXp: 0,
      totalAnswered: 0,
      correctCount: 0,
      currentStreak: 0,
      bestStreak: 0,
      completedIds: [],
      missedIds: [],
      modeStats: {
        read: { answered: 0, correct: 0, bestAccuracy: 0 },
        debug: { answered: 0, correct: 0, bestAccuracy: 0 },
        patch: { answered: 0, correct: 0, bestAccuracy: 0 }
      },
      tagStats: {}
    };
  }

  function mergeProgress(stored) {
    const base = defaultProgress();
    return {
      ...base,
      ...stored,
      modeStats: {
        read: { ...base.modeStats.read, ...(stored.modeStats || {}).read },
        debug: { ...base.modeStats.debug, ...(stored.modeStats || {}).debug },
        patch: { ...base.modeStats.patch, ...(stored.modeStats || {}).patch }
      },
      tagStats: stored.tagStats || {}
    };
  }

  function awardXp(difficulty) {
    return XP_BY_DIFFICULTY[difficulty] || 10;
  }

  function streakBonus(nextStreak) {
    return nextStreak % 5 === 0 ? 5 : 0;
  }

  function calcAccuracy(correct, answered) {
    if (!answered) {
      return 0;
    }
    return Math.round((correct / answered) * 100);
  }

  function isAcceptedPatch(answer, acceptedAnswers) {
    const normalizedAnswer = normalizeCode(answer);
    return acceptedAnswers.some((candidate) => normalizeCode(candidate) === normalizedAnswer);
  }

  function normalizeCode(value) {
    return String(value || "")
      .trim()
      .replace(/\r\n/g, "\n")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n");
  }

  function removeFromArray(array, value) {
    const index = array.indexOf(value);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }

  function formatMode(mode) {
    return `${capitalize(mode)} Mode`;
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function handleKeyboardShortcuts(event) {
    if (state.screen !== "practice" || !state.currentChallenge) {
      return;
    }

    if (state.currentChallenge.type.startsWith("multiple_choice")) {
      const number = Number(event.key);
      if (number >= 1 && number <= state.currentChallenge.options.length) {
        const button = elements.answerArea.children[number - 1];
        if (button) {
          button.click();
        }
      }
    }

    if (event.key === "Enter" && !state.feedbackVisible) {
      const target = document.activeElement;
      if (target && target.tagName === "TEXTAREA" && !event.metaKey && !event.ctrlKey) {
        return;
      }
      submitAnswer();
    }

    if ((event.key === "n" || event.key === "N") && state.feedbackVisible) {
      state.session.index += 1;
      if (state.session.index >= state.session.queue.length) {
        showSessionComplete();
      } else {
        startPractice();
      }
    }
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
