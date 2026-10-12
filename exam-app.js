// ATLAS shared application engine (used by index.html and modules.html)
function percentageToCollegeGrade(percentage) {
            if (percentage >= 97) return 1.00;
            if (percentage >= 94) return 1.25;
            if (percentage >= 91) return 1.50;
            if (percentage >= 88) return 1.75;
            if (percentage >= 85) return 2.00;
            if (percentage >= 82) return 2.25;
            if (percentage >= 79) return 2.50;
            if (percentage >= 76) return 2.75;
            if (percentage >= 75) return 3.00;
            return 5.00;
        }

        let currentModule = null;
        let activeQuestions = [];
        let currentQuestionIndex = 0;
        let currentPartIndex = 0;
        let userAnswers = {}; 
        let quizTimerInterval = null;
        let secondsElapsed = 0;
        let sessionActive = false; // true while an exam session is live or paused

        const EXAM_PROGRESS_KEY = 'cspc_blis_exam_progress';

        // Progress is kept as one entry per module, so pausing a module is never
        // lost when another module is started, finished or abandoned. Saves made
        // by earlier versions used a single record; those are migrated on read.
        function getExamProgressMap() {
            const data = localStorage.getItem(EXAM_PROGRESS_KEY);
            if (!data) return {};
            let parsed;
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                return {};
            }
            if (!parsed || typeof parsed !== 'object') return {};
            // Legacy shape: a single record carrying its own moduleId
            if (parsed.moduleId) return { [parsed.moduleId]: parsed };
            return parsed;
        }

        function writeExamProgressMap(map) {
            if (!map || Object.keys(map).length === 0) {
                localStorage.removeItem(EXAM_PROGRESS_KEY);
                return;
            }
            localStorage.setItem(EXAM_PROGRESS_KEY, JSON.stringify(map));
        }

        // Without a module id this returns the most recently saved record.
        function getExamProgress(moduleId) {
            const map = getExamProgressMap();
            if (moduleId) return map[moduleId] || null;
            const records = Object.keys(map).map(key => map[key]).filter(Boolean);
            if (!records.length) return null;
            return records.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0];
        }

        function saveExamProgress() {
            if (!currentModule || !sessionActive) return;
            const map = getExamProgressMap();
            map[currentModule.id] = {
                moduleId: currentModule.id,
                moduleTitle: currentModule.title,
                activeQuestions: activeQuestions,
                currentQuestionIndex: currentQuestionIndex,
                currentPartIndex: currentPartIndex,
                userAnswers: userAnswers,
                secondsElapsed: secondsElapsed,
                savedAt: Date.now()
            };
            writeExamProgressMap(map);
        }

        // Discards the paused exam of one module (the live one by default)
        // while leaving every other module's saved progress untouched.
        function clearExamProgress(moduleId) {
            const id = moduleId || (currentModule && currentModule.id);
            if (!id) return;
            const map = getExamProgressMap();
            if (!map[id]) return;
            delete map[id];
            writeExamProgressMap(map);
        }

        function hasResumableExam(moduleId) {
            return !!getExamProgress(moduleId);
        }

        function getAttemptsHistory() {
            const data = localStorage.getItem('cspc_blis_exam_history');
            return data ? JSON.parse(data) : [];
        }

        // Check if a module has already been attempted at least once
        function hasTakenExam(moduleId) {
            return getAttemptsHistory().some(att => att.moduleId === moduleId);
        }

        // The main module is a one-time, licensure-style assessment
        function isMainModule(moduleId) {
            const mod = examModules.find(m => m.id === moduleId);
            return !!(mod && mod.main);
        }

        // College grade -> assessment remark (shared by results view and print report)
        function getAssessmentRemark(grade) {
            const g = parseFloat(grade);
            if (g <= 1.25) return "Excellent Performance! Outstanding Licensure Exam Readiness.";
            if (g <= 1.75) return "Very Good Standing! Strong comprehension of BLIS principles.";
            if (g <= 2.25) return "Satisfactory Standing. Good grasp of core concepts.";
            if (g <= 3.00) return "Passed, but requires reinforcement in specific topic areas.";
            return "Failing Grade (5.00). Review the module materials carefully and retake.";
        }

        // Minimal HTML escaping for values injected into the print report
        function escapeHtmlText(text) {
            const div = document.createElement('div');
            div.textContent = (text === null || text === undefined) ? '' : String(text);
            return div.innerHTML;
        }

        function saveAttemptHistory(attempt) {
            const history = getAttemptsHistory();
            history.unshift(attempt);
            localStorage.setItem('cspc_blis_exam_history', JSON.stringify(history));
            updateAnalytics();
            renderExamList();
            renderHoverHistory();
        }

        function clearAllData() {
            if (confirm("Are you sure you want to clear all exam history and performance data?")) {
                localStorage.removeItem('cspc_blis_exam_history');
                localStorage.removeItem(EXAM_PROGRESS_KEY);
                sessionActive = false;
                updateAnalytics();
                renderExamList();
                renderHoverHistory();
                showToast("All data successfully reset.");
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            renderExamList();
            updateAnalytics();
            renderHoverHistory();

            // The lecture overlay closes on Esc, on the close button, or by
            // clicking the dark tint around the player.
            const lectureOverlay = document.getElementById('lecture-overlay');
            if (lectureOverlay) {
                lectureOverlay.addEventListener('click', event => {
                    if (event.target === lectureOverlay) closeLecture();
                });
            }
            document.addEventListener('keydown', event => {
                if (event.key === 'Escape') closeLecture();
            });

            const examListEl = document.getElementById('exam-list-container');
            if (examListEl) {
                examListEl.addEventListener('scroll', updateExamListFade);
            }
            updateExamListFade();

            // Keep the 5-card viewport accurate when the layout reflows
            window.addEventListener('resize', () => {
                clearTimeout(window.__examCapTimer);
                window.__examCapTimer = setTimeout(capExamListHeight, 120);
            });
        });

        // Show the top/bottom fades only while there is scrollable content in that direction
        function updateExamListFade() {
            const list = document.getElementById('exam-list-container');
            const fade = document.getElementById('exam-list-fade');
            const fadeTop = document.getElementById('exam-list-fade-top');
            if (!list || !fade || !fadeTop) return;

            // Resize overlays to stop right at the scrollbar so they never cover it
            const scrollbarWidth = list.offsetWidth - list.clientWidth;
            fade.style.right = scrollbarWidth + 'px';
            fadeTop.style.right = scrollbarWidth + 'px';

            const noOverflow = list.scrollHeight <= list.clientHeight + 1;
            const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 4;

            if (noOverflow || atBottom) {
                fade.classList.add('hidden');
            } else {
                fade.classList.remove('hidden');
            }

            if (noOverflow || list.scrollTop <= 4) {
                fadeTop.classList.remove('show');
            } else {
                fadeTop.classList.add('show');
            }
        }

        // Keep the module list to a maximum of 5 visible cards; the rest scroll.
        function capExamListHeight() {
            const wrap = document.querySelector('.exam-list-wrap');
            const list = document.getElementById('exam-list-container');
            if (!list) return;

            const MAX_VISIBLE = 5;
            const items = list.querySelectorAll('.exam-item');

            // Fewer cards than the cap: size naturally, no inner scrolling.
            if (items.length <= MAX_VISIBLE) {
                list.style.maxHeight = 'none';
                if (wrap) wrap.style.maxHeight = 'none';
                return;
            }

            const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
            let height = 0;
            for (let i = 0; i < MAX_VISIBLE; i++) {
                height += items[i].getBoundingClientRect().height;
            }
            height += gap * (MAX_VISIBLE - 1);

            const cap = Math.ceil(height) + 'px';
            list.style.maxHeight = cap;
            if (wrap) wrap.style.maxHeight = cap;
        }

        function switchView(viewId) {
            const leavingQuiz = document.getElementById('quiz-view').classList.contains('active');

            // If we are leaving a live exam, pause it: save progress and stop the clock
            if (leavingQuiz && sessionActive && viewId !== 'quiz-view') {
                saveExamProgress();
                if (quizTimerInterval) clearInterval(quizTimerInterval);
            }

            document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');

            // The module progress bar only lives while a quiz is on screen
            if (viewId !== 'quiz-view') hideExamProgress();
            
            // The printable A4 report only lives while its results view is open
            if (viewId !== 'results-view') {
                const printReportEl = document.getElementById('print-report');
                if (printReportEl) printReportEl.innerHTML = '';
                document.body.classList.remove('has-print-report');
            }

            const hoverDropdown = document.getElementById('history-hover-dropdown');
            if (hoverDropdown) hoverDropdown.classList.remove('active');
            
            if (viewId === 'dashboard-view') {
                updateAnalytics();
                renderExamList();
                if (quizTimerInterval) clearInterval(quizTimerInterval);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Leave the exam: save progress, stop the timer, return to dashboard
        function exitExam() {
            if (sessionActive) {
                saveExamProgress();
                if (quizTimerInterval) clearInterval(quizTimerInterval);
                switchView('dashboard-view');
                showToast("Exam paused. Your answers and timer were saved.");
            } else {
                switchView('dashboard-view');
            }
        }

        function formatTime(totalSeconds) {
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            return `${mins}m ${secs}s`;
        }

        // ------------------------------------------------------------------
        // Main-module gating
        // The Abstract Examination Trial Modules stay hidden until the main
        // module ("Comprehensive Abstracting") has been assessed. Afterwards,
        // only the trial modules matching the parts that need work are shown.
        // ------------------------------------------------------------------
        const UNLOCK_THRESHOLD = 80; // a part at/above this counts as "Mastered"

        function getMainModuleRecord() {
            const main = examModules.find(m => m.main);
            if (!main) return null;
            return getAttemptsHistory().find(att => att.moduleId === main.id) || null;
        }

        // Percentage scored on each part of the main module
        function getMainPartScores() {
            const main = examModules.find(m => m.main);
            const record = getMainModuleRecord();
            if (!main || !record || !Array.isArray(main.parts)) return null;

            const tally = {};
            main.parts.forEach(part => { tally[part] = { correct: 0, total: 0 }; });

            (record.details || []).forEach(detail => {
                let part = detail.part;
                if (!part) {
                    const q = main.questions.find(x => x.text === detail.question);
                    part = (q && q.part) ? q.part : null;
                }
                if (part && tally[part]) {
                    tally[part].total++;
                    if (detail.isCorrect) tally[part].correct++;
                }
            });

            const scores = {};
            Object.keys(tally).forEach(part => {
                scores[part] = tally[part].total > 0
                    ? Math.round((tally[part].correct / tally[part].total) * 100)
                    : 0;
            });
            return scores;
        }

        // What is available to the learner right now
        function getUnlockInfo() {
            const record = getMainModuleRecord();
            if (!record) {
                return { taken: false, reason: 'locked', weakParts: [], partScores: {}, unlockedIds: null };
            }

            const partScores = getMainPartScores() || {};
            let weakParts = Object.keys(partScores).filter(part => partScores[part] < UNLOCK_THRESHOLD);
            let reason = 'weak';
            if (weakParts.length === 0) {
                // Nothing to reinforce: open the whole trial library
                reason = 'all-strong';
                weakParts = Object.keys(partScores);
            }

            const unlockedIds = new Set();
            examModules.filter(mod => !mod.main).forEach(mod => {
                const topics = (typeof TRIAL_MODULE_TOPICS !== 'undefined' && TRIAL_MODULE_TOPICS[mod.id]) || [];
                if (topics.some(topic => weakParts.indexOf(topic) !== -1)) unlockedIds.add(mod.id);
                // Never hide a module that is already in progress or attempted
                if (hasTakenExam(mod.id) || hasResumableExam(mod.id)) unlockedIds.add(mod.id);
            });

            return { taken: true, reason: reason, weakParts: weakParts, partScores: partScores, unlockedIds: unlockedIds };
        }

        // Trial modules the learner should answer next: the ones unlocked by the
        // Main Module result that have not been attempted yet.
        function getRecommendedModuleIds() {
            const record = getMainModuleRecord();
            if (!record) return [];

            const info = getUnlockInfo();
            const ids = [];
            examModules.filter(mod => !mod.main).forEach(mod => {
                if (!info.unlockedIds || !info.unlockedIds.has(mod.id)) return;
                if (hasTakenExam(mod.id)) return;
                ids.push(mod.id);
            });
            return ids;
        }

        // Lock state shown on the Modules page
        function updateModulesGate() {
            const section = document.getElementById('trial-modules-section');
            const wrap = document.querySelector('.exam-list-wrap');
            const search = document.getElementById('module-search');
            if (!wrap) return;

            const unlock = getUnlockInfo();

            // The trial-module list always stays on the page: until the Main Module
            // is assessed its cards sit under a white tint with an overlay message
            // instead of being replaced by a separate lock panel.
            if (section) section.style.display = '';
            if (search) search.style.display = unlock.taken ? '' : 'none';

            if (wrap) {
                wrap.classList.toggle('is-locked', !unlock.taken);

                let overlay = wrap.querySelector('.list-lock-overlay');
                if (unlock.taken) {
                    if (overlay) overlay.remove();
                } else if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'list-lock-overlay';
                    overlay.innerHTML = `
                        <i class="ri-lock-2-line"></i>
                        <h3>Your trial modules are locked</h3>
                        <p>Complete the <strong>Comprehensive Abstracting</strong> main module first. The trial modules shown here are then unlocked based on how you answered &mdash; matched to the parts you need to strengthen.</p>
                        <button class="btn btn-primary" onclick="location.href='index.html'"><i class="ri-play-line"></i> Go to Main Module</button>
                    `;
                    wrap.appendChild(overlay);
                }
            }
        }

        function renderExamList() {
            const mainContainer = document.getElementById('main-module-container');
            const container = document.getElementById('exam-list-container');
            if (!mainContainer && !container) return;

            if (container) container.innerHTML = '';
            if (mainContainer) mainContainer.innerHTML = '';

            const searchInput = document.getElementById('module-search-input');
            const query = (searchInput && searchInput.value.trim().toLowerCase()) || '';

            // Modules the learner should answer next (unlocked, not yet taken)
            const recommendedIds = getRecommendedModuleIds();

            const matches = (mod) => {
                if (!query) return true;
                return `${mod.title} ${mod.description}`.toLowerCase().includes(query);
            };

            const buildItem = (mod, locked) => {
                const resumable = hasResumableExam(mod.id);
                const taken = hasTakenExam(mod.id);

                // The main module is the headline assessment of the site: it gets
                // a hero layout with its three parts described.
                if (mod.main) return buildMainModuleCard(mod, resumable, taken);

                const recommended = recommendedIds.indexOf(mod.id) !== -1;

                let buttonHtml;
                if (locked) {
                    buttonHtml = `<button class="btn" disabled><i class="ri-lock-line"></i> Locked</button>`;
                } else if (resumable) {
                    buttonHtml = `<button class="btn btn-resume" onclick="resumeExam('${mod.id}')"><i class="ri-play-circle-line"></i> Resume</button>`;
                } else if (taken) {
                    buttonHtml = `<button class="btn btn-retake" onclick="startQuiz('${mod.id}')"><i class="ri-restart-line"></i> Retake</button>`;
                } else {
                    buttonHtml = `<button class="btn btn-primary" onclick="startQuiz('${mod.id}')"><i class="ri-play-line"></i> Start</button>`;
                }

                const item = document.createElement('div');
                item.className = 'exam-item';
                item.innerHTML = `
                    <div class="exam-info">
                        ${recommended ? '<span class="exam-badge badge-recommended"><i class="ri-star-line"></i> Recommended</span>' : ''}
                        <h3>${mod.title}</h3>
                        <p>${mod.description}</p>
                        <span class="exam-meta">
                            <i class="ri-question-line"></i> ${mod.questions.length} Items
                            <span class="meta-divider"></span>
                            <i class="ri-timer-line"></i> Timed Assessment
                            ${resumable ? '<span class="meta-divider"></span><i class="ri-pause-circle-line"></i> In Progress' : ''}
                        </span>
                    </div>
                    ${buttonHtml}
                `;
                return item;
            };

            // The main module (index.html) is rendered on its own
            if (mainContainer) {
                examModules.filter(mod => mod.main).forEach(mod => {
                    if (!matches(mod)) return;
                    mainContainer.appendChild(buildItem(mod));
                });
                mainContainer.style.display = mainContainer.children.length ? '' : 'none';
            }

            // Trial modules (modules.html): while the Main Module is pending every
            // card is previewed under the lock overlay; afterwards only the
            // unlocked ones stay interactive.
            if (container) {
                const unlock = getUnlockInfo();

                examModules.filter(mod => !mod.main).forEach(mod => {
                    if (unlock.taken && unlock.unlockedIds && !unlock.unlockedIds.has(mod.id)) return;
                    if (!matches(mod)) return;
                    container.appendChild(buildItem(mod, !unlock.taken));
                });

                // Empty state for an active search that matches nothing
                if (!container.innerHTML.trim()) {
                    const empty = document.createElement('div');
                    empty.className = 'exam-empty';
                    empty.innerHTML = '<i class="ri-search-eye-line"></i> No modules match your search.';
                    container.appendChild(empty);
                }

                capExamListHeight();
                updateExamListFade();
            }

            updateModulesGate();
        }

        // The Main Module hero card (index.html) — the headline assessment of the
        // site, shown with its three parts described.
        function buildMainModuleCard(mod, resumable, taken) {
            let buttonHtml;
            if (resumable) {
                buttonHtml = `<button class="btn btn-resume btn-hero" onclick="resumeExam('${mod.id}')"><i class="ri-play-circle-line"></i> Resume Assessment</button>`;
            } else if (taken) {
                buttonHtml = `<button class="btn btn-hero" onclick="viewMainResult()"><i class="ri-file-text-line"></i> View Result</button>`;
            } else {
                buttonHtml = `<button class="btn btn-primary btn-hero" onclick="startQuiz('${mod.id}')"><i class="ri-play-line"></i> Start Assessment</button>`;
            }

            const statusChip = resumable
                ? '<span class="hero-chip chip-progress"><i class="ri-pause-circle-line"></i> In Progress</span>'
                : (taken ? '<span class="hero-chip chip-done"><i class="ri-checkbox-circle-line"></i> Completed</span>' : '');

            const partCards = (mod.parts || []).map((part, index) => {
                const count = mod.questions.filter(question => question.part === part).length;
                const blurb = (typeof MAIN_PART_BLURBS !== 'undefined' && MAIN_PART_BLURBS[part]) || '';
                return `
                    <li class="part-card">
                        <span class="part-index">Part ${index + 1}</span>
                        <h3>${part}</h3>
                        <p>${blurb}</p>
                        <span class="part-items"><i class="ri-question-line"></i> ${count} multiple-choice items</span>
                    </li>`;
            }).join('');

            const note = taken
                ? 'Your result, grade and A4 printable report stay available any time.'
                : 'Finish all three parts to unlock the trial modules matched to your result.';

            const hero = document.createElement('article');
            hero.className = 'main-hero';
            hero.innerHTML = `
                <div class="hero-body">
                    <div class="hero-head">
                        <span class="hero-kicker"><i class="ri-award-line"></i> Main Module &middot; One-Time Assessment</span>
                        <h1 class="hero-title">${mod.title}</h1>
                        <p class="hero-lede">${mod.description}</p>
                    </div>

                    <div class="hero-chips">
                        <span class="hero-chip"><i class="ri-question-line"></i> ${mod.questions.length} Items</span>
                        <span class="hero-chip"><i class="ri-timer-line"></i> Timed Assessment</span>
                        <span class="hero-chip"><i class="ri-lock-line"></i> Cannot Be Retaken</span>
                        ${statusChip}
                    </div>

                    <div class="hero-actions">
                        ${buttonHtml}
                        <span class="hero-note">${note}</span>
                    </div>
                </div>

                <div class="hero-parts">
                    <ol class="part-list">
                        ${partCards}
                    </ol>
                </div>
            `;
            return hero;
        }

        // Expand / collapse the module search field
        function toggleModuleSearch() {
            const wrap = document.getElementById('module-search');
            const input = document.getElementById('module-search-input');
            if (!wrap) return;
            const expanding = !wrap.classList.contains('expanded');
            wrap.classList.toggle('expanded', expanding);
            if (expanding) {
                input.focus();
            } else {
                input.value = '';
                renderExamList();
            }
        }

        function shuffleArray(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function startQuiz(moduleId) {
            const target = examModules.find(m => m.id === moduleId);
            if (!target) return;

            // The main module is a one-time assessment: once finished it can no
            // longer be retaken (its saved result can still be re-opened).
            if (target.main && hasTakenExam(target.id) && !hasResumableExam(target.id)) {
                showToast("The main module can only be taken once. Open your saved result instead.");
                return;
            }

            currentModule = target;

            // A fresh start discards any paused progress for this module only —
            // exams paused in other modules stay resumable
            clearExamProgress(target.id);

            activeQuestions = buildActiveQuestions(currentModule);

            currentQuestionIndex = 0;
            currentPartIndex = 0;
            userAnswers = {};
            secondsElapsed = 0;
            sessionActive = true;

            document.getElementById('quiz-active-title').innerHTML = `<i class="ri-book-2-line"></i> ${currentModule.title}`;

            switchView('quiz-view');
            startTimer();
            renderQuiz();
            saveExamProgress();
        }

        // Resume a previously paused exam (restores answers and elapsed time)
        function resumeExam(moduleId) {
            const p = getExamProgress(moduleId);
            if (!p) return;

            currentModule = examModules.find(m => m.id === p.moduleId);
            if (!currentModule) {
                // Progress saved for a module that no longer exists
                clearExamProgress(p.moduleId);
                return;
            }

            activeQuestions = p.activeQuestions;
            currentQuestionIndex = p.currentQuestionIndex || 0;
            currentPartIndex = p.currentPartIndex || 0;
            userAnswers = p.userAnswers || {};
            secondsElapsed = p.secondsElapsed || 0;
            sessionActive = true;

            document.getElementById('quiz-active-title').innerHTML = `<i class="ri-book-2-line"></i> ${currentModule.title}`;

            switchView('quiz-view');
            startTimer();
            renderQuiz();
            showToast(`Exam resumed. Timer continues from ${formatTime(secondsElapsed)}.`);
        }

        function retakeCurrentExam() {
            if (currentModule) {
                startQuiz(currentModule.id);
            }
        }

        function updateTimerDisplay() {
            const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const secs = (secondsElapsed % 60).toString().padStart(2, '0');
            document.getElementById('quiz-timer').innerHTML = `<i class="ri-time-line"></i> ${mins}:${secs}`;
        }

        function startTimer() {
            if (quizTimerInterval) clearInterval(quizTimerInterval);
            updateTimerDisplay();
            quizTimerInterval = setInterval(() => {
                secondsElapsed++;
                updateTimerDisplay();
            }, 1000);
        }

        // Progress bar under the top bar: share of the module answered so far
        function updateExamProgress() {
            const bar = document.getElementById('exam-progress');
            const fill = document.getElementById('exam-progress-fill');
            if (!bar || !fill) return;

            const total = activeQuestions.length;
            const answered = activeQuestions.filter(q => userAnswers[q.id] !== undefined).length;
            const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

            bar.style.display = '';
            fill.style.width = pct + '%';
            bar.setAttribute('aria-valuenow', String(pct));
            bar.setAttribute('aria-valuetext', answered + ' of ' + total + ' questions answered');
        }

        function hideExamProgress() {
            const bar = document.getElementById('exam-progress');
            if (bar) bar.style.display = 'none';
        }

        function renderQuestion() {
            const q = activeQuestions[currentQuestionIndex];
            document.getElementById('quiz-progress').innerHTML =
                `Question <span id="current-q-num">${currentQuestionIndex + 1}</span> of <span id="total-q-num">${activeQuestions.length}</span>`;
            document.getElementById('q-category-tag').textContent = `Category: ${q.category}`;
            document.getElementById('question-text-container').textContent = q.text;

            // Hide any unanswered warning when a new question is shown
            const warning = document.getElementById('unanswered-warning');
            warning.classList.remove('show');

            const optionsContainer = document.getElementById('options-list-container');
            optionsContainer.dataset.qid = q.id;
            optionsContainer.innerHTML = '';

            q.options.forEach((optText, idx) => {
                const isSelected = userAnswers[q.id] === idx;
                const optionItem = document.createElement('label');
                optionItem.className = `option-item ${isSelected ? 'selected' : ''}`;
                optionItem.innerHTML = `
                    <input type="radio" name="question-opt" value="${idx}" ${isSelected ? 'checked' : ''} onclick="selectOption('${q.id}', ${idx})">
                    <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${optText}</span>
                `;
                optionItem.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'INPUT') {
                        const radio = optionItem.querySelector('input');
                        radio.checked = true;
                        selectOption(q.id, idx);
                    }
                });
                optionsContainer.appendChild(optionItem);
            });

            document.getElementById('btn-prev').style.display = currentQuestionIndex === 0 ? 'none' : 'inline-flex';
            const nextBtn = document.getElementById('btn-next');
            if (currentQuestionIndex === activeQuestions.length - 1) {
                nextBtn.innerHTML = 'Submit Exam <i class="ri-check-line"></i>';
                nextBtn.className = 'btn btn-primary';
                nextBtn.onclick = submitQuiz;
            } else {
                nextBtn.innerHTML = 'Next Question <i class="ri-arrow-right-line"></i>';
                nextBtn.className = 'btn btn-primary';
                nextBtn.onclick = nextQuestion;
            }

            updateExamProgress();
        }

        function selectOption(questionId, optionIndex) {
            userAnswers[questionId] = optionIndex;
            document.getElementById('unanswered-warning').classList.remove('show');

            // Scope the selection to this question's own option group
            document.querySelectorAll('.options-list').forEach(list => {
                if (list.dataset.qid !== questionId) return;
                list.querySelectorAll('.option-item').forEach((el, idx) => {
                    el.classList.toggle('selected', idx === optionIndex);
                });
            });

            // Clear any "unanswered" highlight on the question card
            const card = document.getElementById('page-q-' + questionId);
            if (card) card.classList.remove('is-unanswered');

            saveExamProgress();
            updateExamProgress();
        }

        // Warn (and block) if the current question is unanswered
        function showUnansweredWarning(message) {
            const warning = document.getElementById('unanswered-warning');
            warning.innerHTML = `<i class="ri-error-warning-line"></i> ${message || "You haven't answered this question yet. Please select an option to continue."}`;
            warning.classList.add('show');

            // Shake whichever question container is currently visible
            const target = isPartMode()
                ? document.getElementById('questions-page')
                : document.getElementById('options-list-container');
            if (target) {
                target.classList.remove('shake');
                void target.offsetWidth; // restart animation
                target.classList.add('shake');
            }

            showToast(message || `Question ${currentQuestionIndex + 1} is unanswered. Please select an option to continue.`);
        }

        function nextQuestion() {
            const q = activeQuestions[currentQuestionIndex];
            if (userAnswers[q.id] === undefined) {
                showUnansweredWarning();
                return;
            }
            if (currentQuestionIndex < activeQuestions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
                saveExamProgress();
            }
        }

        function prevQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
                saveExamProgress();
            }
        }

        /* ============================================================
           MULTI-PART ("PAGED") EXAMS
           A module that declares a `parts` array is presented one part
           at a time, five questions per page. A part cannot be left
           until every question on it has been answered.
           ============================================================ */

        function hasParts(mod) {
            return !!mod && Array.isArray(mod.parts) && mod.parts.length > 0;
        }

        function isPartMode() {
            return hasParts(currentModule);
        }

        // Build the active (shuffled) question set. For paged modules the
        // shuffle happens inside each part so the grouping stays intact.
        function buildActiveQuestions(mod) {
            const prepare = (q) => {
                const originalOptions = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
                const shuffledOptions = shuffleArray(originalOptions);
                return {
                    ...q,
                    options: shuffledOptions.map(o => o.text),
                    answer: shuffledOptions.findIndex(o => o.originalIndex === q.answer)
                };
            };

            if (hasParts(mod)) {
                return mod.parts.flatMap(part =>
                    shuffleArray(mod.questions.filter(q => q.part === part)).map(prepare)
                );
            }
            return shuffleArray(mod.questions).map(prepare);
        }

        // The exam split into pages (one page per part)
        function getPartPages() {
            if (!isPartMode()) {
                return [{ name: currentModule ? currentModule.title : 'Questions', questions: activeQuestions }];
            }

            const pages = currentModule.parts
                .map(name => ({ name, questions: activeQuestions.filter(q => q.part === name) }))
                .filter(pg => pg.questions.length > 0);

            // Safety net: keep any question whose part label is missing
            const included = new Set(pages.flatMap(pg => pg.questions.map(q => q.id)));
            const orphans = activeQuestions.filter(q => !included.has(q.id));
            if (orphans.length > 0) pages.push({ name: 'Additional Questions', questions: orphans });

            return pages;
        }

        function questionNumber(q) {
            const idx = activeQuestions.findIndex(item => item.id === q.id);
            return idx >= 0 ? idx + 1 : '';
        }

        // Render the quiz using the layout that matches the module type
        function renderQuiz() {
            const stepper = document.getElementById('part-stepper');
            const singleCard = document.getElementById('single-question-card');
            const page = document.getElementById('questions-page');

            if (isPartMode()) {
                singleCard.style.display = 'none';
                stepper.style.display = '';
                page.style.display = 'block';
                renderPartPage();
            } else {
                stepper.style.display = 'none';
                page.style.display = 'none';
                page.innerHTML = '';
                singleCard.style.display = '';
                renderQuestion();
            }
        }

        function renderPartPage() {
            const pages = getPartPages();
            if (pages.length === 0) return;

            if (currentPartIndex < 0) currentPartIndex = 0;
            if (currentPartIndex > pages.length - 1) currentPartIndex = pages.length - 1;

            const page = pages[currentPartIndex];

            // Meta bar: part number plus the question range shown on this page
            let firstNumber = 1;
            for (let i = 0; i < currentPartIndex; i++) firstNumber += pages[i].questions.length;
            const lastNumber = firstNumber + page.questions.length - 1;
            document.getElementById('quiz-progress').innerHTML =
                `Part ${currentPartIndex + 1} of ${pages.length} &middot; Questions ${firstNumber}&ndash;${lastNumber} of ${activeQuestions.length}`;

            renderPartStepper(pages);

            const container = document.getElementById('questions-page');
            container.innerHTML = '';
            page.questions.forEach(q => container.appendChild(buildQuestionCard(q)));

            document.getElementById('unanswered-warning').classList.remove('show');

            document.getElementById('btn-prev').style.display = currentPartIndex === 0 ? 'none' : 'inline-flex';

            const nextBtn = document.getElementById('btn-next');
            if (currentPartIndex === pages.length - 1) {
                nextBtn.innerHTML = 'Submit Exam <i class="ri-check-line"></i>';
                nextBtn.onclick = submitQuiz;
            } else {
                nextBtn.innerHTML = 'Next Part <i class="ri-arrow-right-line"></i>';
                nextBtn.onclick = nextPart;
            }

            updateExamProgress();
        }

        function renderPartStepper(pages) {
            const stepper = document.getElementById('part-stepper');
            if (!stepper) return;
            stepper.innerHTML = '';
            pages.forEach((pg, idx) => {
                const li = document.createElement('li');
                let cls = 'part-step';
                if (idx === currentPartIndex) cls += ' is-active';
                else if (idx < currentPartIndex) cls += ' is-done';
                li.className = cls;
                li.innerHTML = `<span class="part-step-num">${idx + 1}</span><span class="part-step-name">${pg.name}</span>`;
                stepper.appendChild(li);
            });
        }

        // A single question card used inside a multi-part page
        function buildQuestionCard(q) {
            const card = document.createElement('article');
            card.className = 'question-card page-question';
            card.id = 'page-q-' + q.id;

            const number = document.createElement('div');
            number.className = 'question-number';
            number.innerHTML = `Question ${questionNumber(q)} &middot; ${q.category}`;
            card.appendChild(number);

            const text = document.createElement('div');
            text.className = 'question-text';
            text.textContent = q.text;
            card.appendChild(text);

            const options = document.createElement('div');
            options.className = 'options-list';
            options.dataset.qid = q.id;

            q.options.forEach((optText, idx) => {
                const isSelected = userAnswers[q.id] === idx;
                const optionItem = document.createElement('label');
                optionItem.className = `option-item ${isSelected ? 'selected' : ''}`;
                optionItem.innerHTML = `
                    <input type="radio" name="q-${q.id}" value="${idx}" ${isSelected ? 'checked' : ''}>
                    <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${optText}</span>
                `;
                optionItem.addEventListener('click', () => {
                    const radio = optionItem.querySelector('input');
                    radio.checked = true;
                    selectOption(q.id, idx);
                });
                options.appendChild(optionItem);
            });

            card.appendChild(options);
            return card;
        }

        // Button dispatchers shared by both quiz layouts
        function goToNext() {
            if (isPartMode()) nextPart();
            else nextQuestion();
        }

        function goToPrev() {
            if (isPartMode()) prevPart();
            else prevQuestion();
        }

        function nextPart() {
            const pages = getPartPages();
            const page = pages[currentPartIndex];
            if (!page) return;

            const unanswered = page.questions.filter(q => userAnswers[q.id] === undefined);
            if (unanswered.length > 0) {
                focusUnansweredQuestion(unanswered[0]);
                showUnansweredWarning(
                    unanswered.length === 1
                        ? `Question ${questionNumber(unanswered[0])} is unanswered. Please select an option to continue.`
                        : `You still have ${unanswered.length} unanswered questions in this part. Please answer them all to continue.`
                );
                return;
            }

            if (currentPartIndex < pages.length - 1) {
                currentPartIndex++;
                renderPartPage();
                saveExamProgress();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                submitQuiz();
            }
        }

        function prevPart() {
            if (currentPartIndex > 0) {
                currentPartIndex--;
                renderPartPage();
                saveExamProgress();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        // Scroll back to an unanswered question and highlight it
        function focusUnansweredQuestion(q) {
            const card = document.getElementById('page-q-' + q.id);
            if (!card) return;
            card.classList.remove('is-unanswered');
            void card.offsetWidth; // restart the highlight
            card.classList.add('is-unanswered');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function submitQuiz() {
            // Guard (single-question modules): the shown question must be answered
            if (!isPartMode()) {
                const currentQ = activeQuestions[currentQuestionIndex];
                if (userAnswers[currentQ.id] === undefined) {
                    showUnansweredWarning();
                    return;
                }
            }

            // Warn about any unanswered questions across the exam
            const unanswered = activeQuestions.filter(q => userAnswers[q.id] === undefined);
            if (unanswered.length > 0) {
                // In paged mode, jump back to the part holding the first unanswered question
                if (isPartMode()) {
                    const pages = getPartPages();
                    const targetIndex = pages.findIndex(pg => pg.questions.some(q => userAnswers[q.id] === undefined));
                    if (targetIndex !== -1 && targetIndex !== currentPartIndex) {
                        currentPartIndex = targetIndex;
                        renderPartPage();
                    }
                    focusUnansweredQuestion(unanswered[0]);
                }
                showUnansweredWarning(`You still have ${unanswered.length} unanswered question${unanswered.length === 1 ? '' : 's'}. Please answer all questions before submitting.`);
                return;
            }

            gradeAndFinish();
        }

        function gradeAndFinish() {
            if (quizTimerInterval) clearInterval(quizTimerInterval);
            sessionActive = false;
            clearExamProgress(currentModule && currentModule.id);

            let correctCount = 0;
            const total = activeQuestions.length;
            const reviewDetails = [];

            activeQuestions.forEach(q => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.answer;
                if (isCorrect) correctCount++;

                reviewDetails.push({
                    question: q.text,
                    part: q.part || null,
                    category: q.category,
                    options: q.options,
                    userAnswer: userAns !== undefined ? userAns : null,
                    correctAnswer: q.answer,
                    isCorrect: isCorrect,
                    explanation: q.explanation
                });
            });

            const percentage = Math.round((correctCount / total) * 100);
            const collegeGrade = percentageToCollegeGrade(percentage);
            const mins = Math.floor(secondsElapsed / 60);
            const secs = secondsElapsed % 60;
            const timeString = `${mins}m ${secs}s`;

            const attemptRecord = {
                id: Date.now(),
                moduleId: currentModule.id,
                moduleTitle: currentModule.title,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                score: correctCount,
                total: total,
                percentage: percentage,
                grade: collegeGrade.toFixed(2),
                timeSpent: timeString,
                details: reviewDetails
            };

            saveAttemptHistory(attemptRecord);
            renderResultsView(attemptRecord);
            switchView('results-view');
            showToast("Exam submitted successfully!");
        }

        function renderResultsView(record) {
            document.getElementById('result-module-tag').innerHTML = `<i class="ri-award-line"></i> ${record.moduleTitle}`;
            document.getElementById('result-score-display').textContent = `${record.score}/${record.total} (${record.percentage}%)`;
            document.getElementById('result-grade-badge').textContent = `Grade: ${record.grade}`;
            
            // The main module is a one-time assessment: it cannot be retaken,
            // but its result can be re-opened and printed on a single A4 page.
            const isMain = isMainModule(record.moduleId);
            const retakeBtn = document.getElementById('btn-retake-exam');
            if (retakeBtn) retakeBtn.style.display = isMain ? 'none' : '';
            const printBtn = document.getElementById('btn-print-result');
            if (printBtn) printBtn.style.display = isMain ? '' : 'none';
            const onceNote = document.getElementById('result-once-note');
            if (onceNote) onceNote.style.display = isMain ? '' : 'none';
            renderPrintReport(record);
            
            document.getElementById('result-remark').textContent = getAssessmentRemark(record.grade);

            // Competency ratio, topic mastery and recommendations beside the review
            renderResultSidePanels(record);

            const reviewContainer = document.getElementById('review-list-container');
            reviewContainer.innerHTML = '';

            // Review analytics are grouped by part (Part 1, Part 2, Part 3...).
            // Each part is a dropdown: opening one closes the other two.
            const groups = groupDetails(record, 'part');
            const showPartHeadings = groups.length > 1;

            groups.forEach((group, groupIndex) => {
                let itemTarget = reviewContainer;

                if (showPartHeadings) {
                    const section = document.createElement('div');
                    section.className = 'review-part' + (groupIndex === 0 ? ' open' : '');

                    const head = document.createElement('div');
                    head.className = 'review-part-head';
                    head.setAttribute('role', 'button');
                    head.setAttribute('tabindex', '0');
                    head.setAttribute('aria-expanded', groupIndex === 0 ? 'true' : 'false');
                    head.innerHTML = `
                        <div class="review-part-title">
                            <span class="review-part-index">Part ${groupIndex + 1}</span>
                            <h3>${escapeHtmlText(group.name)}</h3>
                        </div>
                        <span class="review-part-right">
                            <span class="review-part-score">${group.correct}/${group.total} &middot; ${group.pct}%</span>
                            <i class="ri-arrow-down-s-line review-part-chevron"></i>
                        </span>
                    `;
                    head.addEventListener('click', () => toggleReviewPart(section));
                    head.addEventListener('keydown', event => {
                        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                            event.preventDefault();
                            toggleReviewPart(section);
                        }
                    });

                    const body = document.createElement('div');
                    body.className = 'review-part-body';

                    section.appendChild(head);
                    section.appendChild(body);
                    reviewContainer.appendChild(section);
                    itemTarget = body;
                }

                group.items.forEach(entry => {
                    const item = entry.detail;
                    const reviewEl = document.createElement('div');
                    reviewEl.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

                    let userAnsText = item.userAnswer !== null ? `${String.fromCharCode(65 + item.userAnswer)}. ${item.options[item.userAnswer]}` : 'No Answer Provided';
                    let correctAnsText = `${String.fromCharCode(65 + item.correctAnswer)}. ${item.options[item.correctAnswer]}`;

                    reviewEl.innerHTML = `
                        <div style="font-size: 0.8rem; font-family: var(--font-heading); color: var(--text-secondary); margin-bottom: 0.25rem;">Question ${entry.number} [${item.category}]</div>
                        <div style="font-weight: 600; margin-bottom: 0.75rem;">${item.question}</div>
                        <div style="font-size: 0.85rem; margin-bottom: 0.25rem; color: ${item.isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'};">
                            <strong>Your Answer:</strong> ${userAnsText} ${item.isCorrect ? '<i class="ri-check-line"></i>' : '<i class="ri-close-line"></i>'}
                        </div>
                        ${!item.isCorrect ? `<div style="font-size: 0.85rem; margin-bottom: 0.25rem; color: var(--accent-success);"><strong>Correct Answer:</strong> ${correctAnsText}</div>` : ''}
                        <div class="review-explanation">
                            <div class="review-explanation-clip">
                                <div class="review-explanation-body"><strong>Explanation:</strong> ${item.explanation}</div>
                            </div>
                        </div>
                    `;

                    // Touch screens have no hover, so a tap toggles the explanation
                    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
                        reviewEl.addEventListener('click', () => reviewEl.classList.toggle('show-explanation'));
                    }

                    itemTarget.appendChild(reviewEl);
                });
            });
        }

        // Accordion behaviour for the review parts: opening one closes the rest
        function toggleReviewPart(section) {
            const container = section.parentElement;
            const wasOpen = section.classList.contains('open');

            Array.prototype.forEach.call(container.querySelectorAll('.review-part'), part => {
                part.classList.remove('open');
                const head = part.querySelector('.review-part-head');
                if (head) head.setAttribute('aria-expanded', 'false');
            });

            if (!wasOpen) {
                section.classList.add('open');
                const head = section.querySelector('.review-part-head');
                if (head) head.setAttribute('aria-expanded', 'true');
            }
        }

        // Group a record's answers into labelled sections, kept in module order.
        // mode 'part'  -> the module's declared parts (Part 1, Part 2, Part 3...)
        // mode 'category' -> the question categories (used for single-topic trials)
        function groupDetails(record, mode) {
            const mod = examModules.find(m => m.id === record.moduleId);
            const details = (record && record.details) || [];
            const order = [];
            const groups = {};

            if (mode === 'part' && mod && Array.isArray(mod.parts)) {
                mod.parts.forEach(part => { groups[part] = []; order.push(part); });
            }

            details.forEach((detail, idx) => {
                const question = mod ? mod.questions.find(x => x.text === detail.question) : null;
                let label;
                if (mode === 'part') {
                    label = detail.part || (question && question.part) ||
                        (mod ? mod.title : 'General');
                } else {
                    label = detail.category || (question && question.category) ||
                        (mod ? mod.title : 'General');
                }

                if (!groups[label]) { groups[label] = []; order.push(label); }
                groups[label].push({ detail: detail, number: idx + 1 });
            });

            return order.map(name => {
                const items = groups[name] || [];
                const correct = items.filter(entry => entry.detail.isCorrect).length;
                const pct = items.length ? Math.round((correct / items.length) * 100) : 0;
                return { name: name, items: items, correct: correct, total: items.length, pct: pct, level: getMasteryLevel(pct) };
            }).filter(group => group.items.length > 0);
        }

        // The panels shown beside the detailed review: competency & accuracy for
        // this attempt, topic mastery, and the learning materials that suit it.
        function renderResultSidePanels(record) {
            const pieEl = document.getElementById('result-pie');
            if (!pieEl) return; // this page has no results side panels

            const total = record.total || (record.details || []).length || 1;
            const correct = (record.score === undefined || record.score === null) ? 0 : record.score;
            const incorrect = Math.max(0, total - correct);
            const percentage = (record.percentage === undefined || record.percentage === null)
                ? Math.round((correct / total) * 100)
                : record.percentage;

            const degrees = Math.round((percentage / 100) * 360);
            pieEl.style.background = `conic-gradient(var(--accent-success) 0deg ${degrees}deg, var(--accent-danger) ${degrees}deg 360deg)`;

            const setText = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            };
            setText('result-pie-percentage', `${percentage}%`);
            setText('result-stat-grade', record.grade);
            setText('result-stat-items', total);
            setText('result-stat-correct', correct);
            setText('result-stat-incorrect', incorrect);

            // Topic mastery: the main module's parts, or the trial module's categories
            const masteryEl = document.getElementById('result-mastery-list');
            if (masteryEl) {
                const mod = examModules.find(m => m.id === record.moduleId);
                const byParts = !!(mod && Array.isArray(mod.parts) && mod.parts.length);
                const groups = groupDetails(record, byParts ? 'part' : 'category');

                masteryEl.innerHTML = '';
                groups.forEach(group => {
                    const row = document.createElement('div');
                    row.className = 'mastery-topic';
                    row.innerHTML = `
                        <div class="mastery-topic-top">
                            <span class="mastery-topic-name">${escapeHtmlText(group.name)}</span>
                            <span class="mastery-badge level-${group.level.key}">${group.level.label} ${group.pct}%</span>
                        </div>
                        <div class="mastery-track">
                            <div class="mastery-fill level-${group.level.key}" style="width: ${group.pct}%;"></div>
                        </div>
                        <div class="mastery-topic-sub">${group.correct} of ${group.total} correct</div>
                    `;
                    masteryEl.appendChild(row);
                });
            }

            renderResultLearningMaterials();
            renderResultLectures(record);
        }

        // Learning materials beside the review: the resources the Review Library
        // curates (library.html), reused here for the result being looked at.
        function renderResultLearningMaterials() {
            const list = document.getElementById('result-material-list');
            if (!list || typeof LEARNING_MATERIALS === 'undefined') return;

            list.innerHTML = '';
            LEARNING_MATERIALS.forEach(material => {
                const link = document.createElement('a');
                link.className = 'material-item';
                link.href = material.url;
                link.target = '_blank';
                link.rel = 'noopener';
                link.innerHTML = `
                    <span class="material-tag">${escapeHtmlText(material.tag)}</span>
                    <span class="material-title">${escapeHtmlText(material.title)}</span>
                    <i class="ri-arrow-right-up-line"></i>
                `;
                list.appendChild(link);
            });
        }

        // A page opened straight from disk (file://...) sends no referrer at all,
        // and YouTube refuses to hand out an embedded player without one — that
        // is "error 153". Running the site over http://localhost (Start ATLAS.bat)
        // gives it a real origin, and the lectures then play inside the page.
        function isLocalFileMode() {
            return location.protocol === 'file:';
        }

        // Video lectures beside the review: real YouTube videos, embedded in the
        // page itself. Clicking a row swaps in the player, so watching a lecture
        // never sends anyone to YouTube.
        function renderResultLectures(record) {
            const list = document.getElementById('result-video-list');
            if (!list || typeof LEARNING_VIDEOS === 'undefined') return;

            list.innerHTML = '';
            pickLectureIds(record).forEach(id => {
                const video = LEARNING_VIDEOS.find(item => item.id === id);
                if (!video) return;

                const row = document.createElement('div');
                row.className = 'lecture';
                row.innerHTML = `
                    <button class="lecture-hit" type="button" onclick="playLecture(this)">
                        <span class="lecture-thumb">
                            <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="" loading="lazy">
                            <span class="lecture-play"><i class="ri-play-fill"></i></span>
                        </span>
                        <span class="lecture-meta">
                            <span class="lecture-title">${escapeHtmlText(video.title)}</span>
                            <span class="lecture-channel">${escapeHtmlText(video.channel)} &middot; YouTube</span>
                        </span>
                    </button>
                `;
                list.appendChild(row);
            });

            // When the pages are opened from disk the player cannot work, so say
            // why and point at the launcher that fixes it.
            if (isLocalFileMode()) {
                const note = document.createElement('p');
                note.className = 'lecture-note';
                note.innerHTML = '<i class="ri-error-warning-line"></i><span>YouTube blocks in-page playback when the site is opened straight from disk (error 153). Start it with <strong>Start ATLAS.bat</strong> to watch lectures here &mdash; until then a lecture opens on YouTube.</span>';
                list.parentNode.insertBefore(note, list);
            }
        }

        // Which lectures to show: the topics this attempt was weakest in decide
        // the order of preference, and the three best-fitting lectures are shown.
        function pickLectureIds(record) {
            const mod = examModules.find(m => m.id === record.moduleId);
            const byParts = !!(mod && Array.isArray(mod.parts) && mod.parts.length);
            const weakTopics = groupDetails(record, byParts ? 'part' : 'category')
                .filter(group => group.pct < UNLOCK_THRESHOLD)
                .map(group => group.name.toLowerCase())
                .join(' ');

            const score = video => video.tags.reduce(
                (total, tag) => total + (weakTopics.indexOf(tag) !== -1 ? 1 : 0), 0);

            return LEARNING_VIDEOS
                .map((video, index) => ({ id: video.id, score: score(video), order: index }))
                .sort((a, b) => (b.score - a.score) || (a.order - b.order))
                .slice(0, 3)
                .map(entry => entry.id);
        }

        // Play a lecture in the centred overlay — bigger picture, dark-tinted
        // backdrop, playback starting straight away (nothing leaves the site).
        function playLecture(button) {
            const row = button.closest('.lecture');
            if (!row) return;

            const img = row.querySelector('.lecture-thumb img');
            const titleEl = row.querySelector('.lecture-title');
            if (!img) return;

            const match = /\/vi\/([A-Za-z0-9_-]{11})\//.exec(img.getAttribute('src') || '');
            if (!match) return;

            if (isLocalFileMode()) {
                window.open(`https://www.youtube.com/watch?v=${match[1]}`, '_blank', 'noopener');
                return;
            }

            openLectureOverlay(match[1], titleEl ? titleEl.textContent : 'Video lecture');
        }

        function openLectureOverlay(videoId, title) {
            const overlay = document.getElementById('lecture-overlay');
            const holder = document.getElementById('lecture-overlay-player');
            const titleEl = document.getElementById('lecture-overlay-title');

            if (!overlay || !holder) {
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener');
                return;
            }

            holder.innerHTML = '';
            const frame = document.createElement('iframe');
            frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
            frame.title = title;
            frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
            frame.setAttribute('allowfullscreen', '');
            holder.appendChild(frame);

            if (titleEl) titleEl.textContent = title;

            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('overlay-open');

            const close = overlay.querySelector('.lecture-overlay-close');
            if (close && typeof close.focus === 'function') close.focus();
        }

        function closeLecture() {
            const overlay = document.getElementById('lecture-overlay');
            if (!overlay || !overlay.classList.contains('open')) return;

            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('overlay-open');

            // Clearing the holder stops the video instead of letting it play on
            const holder = document.getElementById('lecture-overlay-player');
            if (holder) holder.innerHTML = '';
        }

        // Re-open the saved (and only) main module result — repeatable at will
        function viewMainResult() {
            const attempt = getAttemptsHistory().find(att => att.moduleId === 'mod-main');
            if (!attempt) {
                showToast("No saved main module result was found.");
                return;
            }
            currentModule = examModules.find(m => m.id === 'mod-main') || currentModule;
            renderResultsView(attempt);
            switchView('results-view');
            showToast("Viewing your saved main module result.");
        }

        function printResult() {
            const report = document.getElementById('print-report');
            if (!report || !report.innerHTML.trim()) {
                showToast("There is no printable result for this module yet.");
                return;
            }
            window.print();
        }

        // Build the single-page A4 report for the main module result
        function renderPrintReport(record) {
            const report = document.getElementById('print-report');
            if (!report) return;

            if (!record || !isMainModule(record.moduleId)) {
                report.innerHTML = '';
                document.body.classList.remove('has-print-report');
                return;
            }

            const mod = examModules.find(m => m.id === record.moduleId);
            const details = record.details || [];

            // Group the recorded items by part, in the module's declared order
            const partOrder = (mod && Array.isArray(mod.parts)) ? mod.parts.slice() : [];
            const groups = {};
            partOrder.forEach(p => { groups[p] = []; });

            details.forEach((d, idx) => {
                let part = d.part;
                if (!part) {
                    const q = mod ? mod.questions.find(x => x.text === d.question) : null;
                    part = (q && q.part) ? q.part : 'General';
                }
                if (!groups[part]) { groups[part] = []; partOrder.push(part); }
                groups[part].push({ detail: d, number: idx + 1 });
            });

            const partStats = [];
            let grids = '';
            let partNo = 0;

            partOrder.forEach(part => {
                const items = groups[part] || [];
                if (items.length === 0) return;
                partNo++;

                const correct = items.filter(it => it.detail.isCorrect).length;
                const pct = Math.round((correct / items.length) * 100);
                const level = getMasteryLevel(pct);

                partStats.push({ name: part, correct: correct, total: items.length, pct: pct, level: level });

                let cells = '';
                items.forEach(it => {
                    cells += `<div class="pr-cell${it.detail.isCorrect ? '' : ' bad'}">Q${it.number}</div>`;
                });

                grids += `
                    <div class="pr-section">Part ${partNo} &mdash; ${escapeHtmlText(part)}</div>
                    <div class="pr-grid">${cells}</div>
                `;
            });

            // Competency & accuracy figures for THIS module only — the Abstract
            // Examination Trial Modules are deliberately left out.
            const totalItems = record.total || details.length || 1;
            const correctCount = (record.score === undefined || record.score === null) ? 0 : record.score;
            const incorrectCount = Math.max(0, totalItems - correctCount);
            const accuracyPct = (record.percentage === undefined || record.percentage === null)
                ? Math.round((correctCount / totalItems) * 100)
                : record.percentage;

            let masteryRows = '';
            partStats.forEach(st => {
                masteryRows += `
                    <div class="pr-topic">
                        <div class="pr-topic-top">
                            <span>${escapeHtmlText(st.name)}</span>
                            <span class="pr-badge level-${st.level.key}">${st.level.label} ${st.pct}%</span>
                        </div>
                        <div class="pr-track"><div class="pr-fill level-${st.level.key}" style="width: ${st.pct}%;"></div></div>
                        <div class="pr-topic-sub">${st.correct} of ${st.total} correct</div>
                    </div>
                `;
            });

            const passed = parseFloat(record.grade) <= 3.00;
            const generated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            report.innerHTML = `
                <div class="pr-head">
                    <div>
                        <div class="pr-brand">ATLAS</div>
                        <div class="pr-sub">Abstract Testing &amp; Library Assessment System</div>
                    </div>
                    <div class="pr-doc">Assessment Result</div>
                </div>

                <div class="pr-title">${escapeHtmlText(record.moduleTitle)}</div>
                <div class="pr-meta">
                    <span><strong>Date:</strong> ${escapeHtmlText(record.date)}</span>
                    <span><strong>Time Spent:</strong> ${escapeHtmlText(record.timeSpent)}</span>
                    <span><strong>Total Items:</strong> ${record.total}</span>
                </div>

                <div class="pr-boxes">
                    <div class="pr-box"><div class="pr-label">Raw Score</div><div class="pr-value">${record.score}/${record.total}</div></div>
                    <div class="pr-box"><div class="pr-label">Percentage</div><div class="pr-value">${record.percentage}%</div></div>
                    <div class="pr-box"><div class="pr-label">Grade</div><div class="pr-value">${record.grade}</div></div>
                    <div class="pr-box"><div class="pr-label">Status</div><div class="pr-value">${passed ? 'Passed' : 'Failed'}</div></div>
                </div>

                <div class="pr-two-col">
                    <div class="pr-panel">
                        <div class="pr-panel-title">Competency &amp; Accuracy Ratio</div>
                        <div class="pr-ratio">
                            <svg class="pr-pie" viewBox="0 0 36 36" width="72" height="72" aria-hidden="true">
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E11D48" stroke-width="5"></circle>
                                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#0D9488" stroke-width="5" pathLength="100" stroke-dasharray="${accuracyPct} 100" transform="rotate(-90 18 18)"></circle>
                                <text x="18" y="20.6" text-anchor="middle" font-size="7" font-weight="700" fill="#1E293B">${accuracyPct}%</text>
                            </svg>
                            <div class="pr-ratio-stats">
                                <div class="pr-stat"><span>Average Grade</span><strong>${record.grade}</strong></div>
                                <div class="pr-stat"><span>Accuracy Ratio</span><strong>${correctCount} : ${incorrectCount}</strong></div>
                            </div>
                        </div>
                    </div>
                    <div class="pr-panel">
                        <div class="pr-panel-title">Topic Mastery</div>
                        <div class="pr-topics">${masteryRows}</div>
                    </div>
                </div>
                <div class="pr-note">These figures cover ${escapeHtmlText(record.moduleTitle)} (main module) only &mdash; the Abstract Examination Trial Modules are not included.</div>

                <div class="pr-section">Item Response Sheet &mdash; Question-by-Question</div>
                ${grids}

                <div class="pr-legend">
                    <span><span class="swatch"></span> Correct</span>
                    <span><span class="swatch bad"></span> Incorrect</span>
                </div>

                <div class="pr-remark"><strong>Assessment:</strong> ${escapeHtmlText(getAssessmentRemark(record.grade))}</div>

                <div class="pr-foot">
                    <span>ATLAS &bull; 4th Year BLIS &bull; Professional Board Licensure Preparation</span>
                    <span>Generated ${escapeHtmlText(generated)} &bull; One-time assessment (no retakes)</span>
                </div>
            `;

            document.body.classList.add('has-print-report');
        }

        function updateAnalytics() {
            // The competency & accuracy ratio lives on the Modules page
            const pieEl = document.getElementById('overall-pie');
            if (!pieEl) return;

            // The main module is a one-time assessment and is deliberately
            // excluded from the competency & accuracy ratio.
            const history = getAttemptsHistory().filter(att => !isMainModule(att.moduleId));
            const totalExams = history.length;

            let totalCorrect = 0;
            let totalQuestionsAnswered = 0;
            let sumPercentages = 0;
            let sumGrades = 0;

            history.forEach(att => {
                totalCorrect += att.score;
                totalQuestionsAnswered += att.total;
                sumPercentages += att.percentage;
                
                let g = parseFloat(att.grade);
                if (!isNaN(g)) {
                    sumGrades += g;
                }
            });

            const incorrectCount = totalQuestionsAnswered - totalCorrect;
            const overallPercentage = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;
            const avgGradeNum = totalExams > 0 ? (sumGrades / totalExams) : 5.00;

            const degrees = Math.round((overallPercentage / 100) * 360);
            pieEl.style.background = `conic-gradient(var(--accent-success) 0deg ${degrees}deg, var(--accent-danger) ${degrees}deg 360deg)`;
            document.getElementById('pie-percentage').textContent = `${overallPercentage}%`;

            document.getElementById('stat-total-exams').textContent = totalExams;
            document.getElementById('stat-correct-count').textContent = totalCorrect;
            document.getElementById('stat-incorrect-count').textContent = incorrectCount;
            document.getElementById('stat-avg-grade').textContent = avgGradeNum.toFixed(2);

            renderTopicMastery();
        }

        // Topic mastery bands: Needs Improvement (<60%), Proficient (60-80%), Mastered (>80%)
        function getMasteryLevel(percentage) {
            if (percentage > 80) return { key: 'good', label: 'Mastered' };
            if (percentage >= 60) return { key: 'mid', label: 'Proficient' };
            return { key: 'low', label: 'Needs Improvement' };
        }

        let masteryIndex = 0;

        function renderTopicMastery() {
            const container = document.getElementById('mastery-list-container');
            if (!container) return;

            const history = getAttemptsHistory();
            container.innerHTML = '';

            // The main module is excluded from topic mastery
            examModules.filter(mod => !mod.main).forEach(mod => {
                const attempts = history.filter(att => att.moduleId === mod.id);

                let levelKey = 'none';
                let badgeText = 'Not Attempted';
                let percentage = 0;

                if (attempts.length > 0) {
                    // Overall topic mastery = best recorded result for the topic
                    percentage = Math.max(...attempts.map(att => att.percentage));
                    const level = getMasteryLevel(percentage);
                    levelKey = level.key;
                    badgeText = `${level.label} ${percentage}%`;
                }

                const topic = document.createElement('div');
                topic.className = 'mastery-topic';
                topic.innerHTML = `
                    <div class="mastery-topic-top">
                        <span class="mastery-topic-name">${mod.title}</span>
                        <span class="mastery-badge level-${levelKey}">${badgeText}</span>
                    </div>
                    <div class="mastery-track">
                        <div class="mastery-fill level-${levelKey}" style="width: ${percentage}%;"></div>
                    </div>
                `;
                container.appendChild(topic);
            });

            // Start on the first slide whenever the list is rebuilt
            masteryIndex = 0;
            updateMasteryCarousel();
        }

        function updateMasteryCarousel() {
            const container = document.getElementById('mastery-list-container');
            if (!container) return;

            const total = container.children.length;
            if (total === 0) return;

            if (masteryIndex < 0) masteryIndex = 0;
            if (masteryIndex > total - 1) masteryIndex = total - 1;

            container.style.transform = `translateX(-${masteryIndex * 100}%)`;
        }

        function slideMastery(direction) {
            const container = document.getElementById('mastery-list-container');
            if (!container) return;

            const total = container.children.length;
            if (total === 0) return;

            // Wrap around so the carousel loops infinitely
            masteryIndex = (masteryIndex + direction + total) % total;
            updateMasteryCarousel();
        }

        // Hover functionality showing ONLY the last recent modules
        function showHistoryHover() {
            const dropdown = document.getElementById('history-hover-dropdown');
            if (!dropdown) return;
            dropdown.classList.add('active');
            renderHoverHistory();
        }

        function hideHistoryHover() {
            const dropdown = document.getElementById('history-hover-dropdown');
            if (!dropdown) return;
            dropdown.classList.remove('active');
        }

        function renderHoverHistory() {
            const history = getAttemptsHistory();
            const container = document.getElementById('hover-history-items-container');
            if (!container) return;
            container.innerHTML = '';

            const recentTwo = history.slice(0, 2);

            if (recentTwo.length === 0) {
                container.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">No recent modules recorded.</div>`;
                return;
            }

            recentTwo.forEach(att => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.style.cursor = 'pointer';
                item.title = 'Click to view post-test results';
                item.innerHTML = `
                    <div class="history-item-title">${att.moduleTitle}</div>
                    <div class="history-meta">
                        <span>Score: <strong>${att.score}/${att.total} (${att.percentage}%)</strong></span>
                        <span>Grade: <strong>${att.grade || '5.00'}</strong></span>
                    </div>
                `;
                item.addEventListener('click', () => {
                    location.href = 'history.html?attempt=' + att.id;
                });
                container.appendChild(item);
            });
        }

        function showToast(message) {
            const toast = document.getElementById('toast-notification');
            if (!toast) return;
            toast.textContent = message;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    