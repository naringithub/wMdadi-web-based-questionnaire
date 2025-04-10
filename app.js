/**
 * Dysphagia Assessment Questionnaire Application
 * Main JavaScript functionality
 */

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentQuestionIndex = 0;
    let currentSection = '';
    let userResponses = {};
    let speechSynthesis = window.speechSynthesis;
    let speechRecognition = null;
    
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultsScreen = document.getElementById('results-screen');
    const loadScreen = document.getElementById('load-screen');
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const sectionTitle = document.getElementById('section-title');
    const questionText = document.getElementById('question-text');
    const readAloudBtn = document.getElementById('read-aloud-btn');
    const optionButtons = document.querySelectorAll('.option-btn');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const voiceStatus = document.getElementById('voice-status');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const saveProgressBtn = document.getElementById('save-progress-btn');
    
    const startBtn = document.getElementById('start-btn');
    const saveModal = document.getElementById('save-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmSaveBtn = document.getElementById('confirm-save-btn');
    const cancelSaveBtn = document.getElementById('cancel-save-btn');
    const saveName = document.getElementById('save-name');
    
    const loadSessionBtn = document.getElementById('load-session-btn');
    const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
    const savedSessionsList = document.getElementById('saved-sessions-list');
    
    const saveResultsBtn = document.getElementById('save-results-btn');
    const printResultsBtn = document.getElementById('print-results-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    // Prepare questions array from questionnaire data
    const allQuestions = [];
    
    // Initialize the application
    function init() {
        prepareQuestions();
        setupEventListeners();
        checkForSpeechSupport();
    }
    
    // Prepare questions array from questionnaire data structure
    function prepareQuestions() {
        // Add emotional questions
        questionnaireData.sections.emotional.questions.forEach(question => {
            allQuestions.push({
                id: question.id,
                text: question.text,
                section: 'emotional',
                sectionName: questionnaireData.sections.emotional.name
            });
        });
        
        // Add functional questions
        questionnaireData.sections.functional.questions.forEach(question => {
            allQuestions.push({
                id: question.id,
                text: question.text,
                section: 'functional',
                sectionName: questionnaireData.sections.functional.name
            });
        });
        
        // Add physical questions
        questionnaireData.sections.physical.questions.forEach(question => {
            allQuestions.push({
                id: question.id,
                text: question.text,
                section: 'physical',
                sectionName: questionnaireData.sections.physical.name
            });
        });
        
        // Add global question
        questionnaireData.sections.global.questions.forEach(question => {
            allQuestions.push({
                id: question.id,
                text: question.text,
                section: 'global',
                sectionName: questionnaireData.sections.global.name
            });
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Start button
        startBtn.addEventListener('click', startQuestionnaire);
        
        // Option buttons
        optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                selectOption(this.dataset.value);
            });
        });
        
        // Navigation buttons
        prevBtn.addEventListener('click', goToPreviousQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);
        
        // Read aloud button
        readAloudBtn.addEventListener('click', readCurrentQuestionAloud);
        
        // Voice input button
        voiceInputBtn.addEventListener('click', startVoiceInput);
        
        // Save progress button
        saveProgressBtn.addEventListener('click', openSaveModal);
        
        // Modal buttons
        closeModal.addEventListener('click', closeSaveModal);
        confirmSaveBtn.addEventListener('click', saveProgress);
        cancelSaveBtn.addEventListener('click', closeSaveModal);
        
        // Load session button
        loadSessionBtn.addEventListener('click', showLoadScreen);
        backToWelcomeBtn.addEventListener('click', showWelcomeScreen);
        
        // Results screen buttons
        saveResultsBtn.addEventListener('click', saveResults);
        printResultsBtn.addEventListener('click', printResults);
        restartBtn.addEventListener('click', restartQuestionnaire);
    }
    
    // Check if speech synthesis and recognition are supported
    function checkForSpeechSupport() {
        // Check for Speech Synthesis support
        if ('speechSynthesis' in window) {
            console.log('Speech synthesis supported');
        } else {
            console.log('Speech synthesis not supported');
            readAloudBtn.style.display = 'none';
        }
        
        // Check for Speech Recognition support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            console.log('Speech recognition supported');
            speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            speechRecognition.lang = 'th-TH';
            speechRecognition.continuous = false;
            speechRecognition.interimResults = false;
            
            speechRecognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript.trim();
                processVoiceInput(transcript);
            };
            
            speechRecognition.onerror = function(event) {
                voiceStatus.textContent = 'ไม่สามารถรับเสียงได้ กรุณาลองอีกครั้ง';
                setTimeout(() => {
                    voiceStatus.textContent = '';
                }, 3000);
            };
            
            speechRecognition.onend = function() {
                voiceInputBtn.disabled = false;
                voiceInputBtn.textContent = '🎤 พูดหมายเลข 1-5';
            };
        } else {
            console.log('Speech recognition not supported');
            voiceInputBtn.style.display = 'none';
        }
    }
    
    // Start the questionnaire
    function startQuestionnaire() {
        showScreen(questionScreen);
        currentQuestionIndex = 0;
        userResponses = {};
        loadQuestion(currentQuestionIndex);
    }
    
    // Load a specific question
    function loadQuestion(index) {
        if (index < 0 || index >= allQuestions.length) {
            return;
        }
        
        const question = allQuestions[index];
        questionText.textContent = question.text;
        sectionTitle.textContent = question.sectionName;
        currentSection = question.section;
        
        // Update progress
        const progress = ((index + 1) / allQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `คำถามที่ ${index + 1} จาก ${allQuestions.length}`;
        
        // Update button states
        prevBtn.disabled = index === 0;
        
        // Clear previous selection
        optionButtons.forEach(button => {
            button.classList.remove('selected');
        });
        
        // Set current selection if answered
        if (userResponses[question.id]) {
            const selectedButton = document.querySelector(`.option-btn[data-value="${userResponses[question.id]}"]`);
            if (selectedButton) {
                selectedButton.classList.add('selected');
            }
        }
        
        // Update next button text for last question
        if (index === allQuestions.length - 1) {
            nextBtn.textContent = 'ดูผลการประเมิน';
        } else {
            nextBtn.textContent = 'ถัดไป';
        }
    }
    
    // Select an option for the current question
    function selectOption(value) {
        const question = allQuestions[currentQuestionIndex];
        userResponses[question.id] = parseInt(value);
        
        // Update UI
        optionButtons.forEach(button => {
            button.classList.remove('selected');
            if (button.dataset.value === value) {
                button.classList.add('selected');
            }
        });
        
        // Auto-advance to next question after a short delay
        if (currentQuestionIndex < allQuestions.length - 1) {
            setTimeout(() => {
                goToNextQuestion();
            }, 500);
        }
    }
    
    // Go to the previous question
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    }
    
    // Go to the next question or show results
    function goToNextQuestion() {
        if (currentQuestionIndex < allQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            calculateAndShowResults();
        }
    }
    
    // Read the current question aloud
    function readCurrentQuestionAloud() {
        if (!speechSynthesis) return;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const question = allQuestions[currentQuestionIndex];
        const utterance = new SpeechSynthesisUtterance(question.text);
        utterance.lang = 'th-TH';
        
        // Visual feedback
        readAloudBtn.classList.add('active');
        
        utterance.onend = function() {
            readAloudBtn.classList.remove('active');
        };
        
        speechSynthesis.speak(utterance);
    }
    
    // Start voice input for selection
    function startVoiceInput() {
        if (!speechRecognition) return;
        
        voiceInputBtn.disabled = true;
        voiceInputBtn.textContent = '🎤 กำลังฟัง...';
        voiceStatus.textContent = 'กรุณาพูดหมายเลข 1 ถึง 5';
        
        speechRecognition.start();
    }
    
    // Process voice input
    function processVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Try to extract a number from 1-5
        let number = null;
        
        // Check for Thai numerals or words
        if (transcript.includes('หนึ่ง') || transcript.includes('1')) {
            number = 1;
        } else if (transcript.includes('สอง') || transcript.includes('2')) {
            number = 2;
        } else if (transcript.includes('สาม') || transcript.includes('3')) {
            number = 3;
        } else if (transcript.includes('สี่') || transcript.includes('4')) {
            number = 4;
        } else if (transcript.includes('ห้า') || transcript.includes('5')) {
            number = 5;
        }
        
        if (number !== null) {
            voiceStatus.textContent = `เลือกตัวเลือกที่ ${number}`;
            selectOption(number.toString());
        } else {
            voiceStatus.textContent = 'ไม่เข้าใจ กรุณาพูดหมายเลข 1 ถึง 5';
            setTimeout(() => {
                voiceStatus.textContent = '';
            }, 3000);
        }
    }
    
    // Calculate scores and show results
    function calculateAndShowResults() {
        // Check if all questions are answered
        const unansweredCount = allQuestions.length - Object.keys(userResponses).length;
        if (unansweredCount > 0) {
            alert(`ยังมีคำถามที่ยังไม่ได้ตอบ ${unansweredCount} ข้อ กรุณาตอบให้ครบทุกข้อ`);
            return;
        }
        
        // Process responses and calculate scores
        const scores = calculateScores();
        
        // Update results screen with scores
        updateResultsScreen(scores);
        
        // Show results screen
        showScreen(resultsScreen);
    }
    
    // Calculate scores based on user responses
    function calculateScores() {
        // Create a copy of responses for processing
        const responses = {...userResponses};
        
        // Reverse scoring for positive questions
        questionnaireData.scoringSystem.reverseScoring.forEach(id => {
            if (responses[id]) {
                responses[id] = 6 - responses[id]; // Reverse the score (1->5, 2->4, etc.)
            }
        });
        
        // Calculate average scores for each section
        const emotionalSum = questionnaireData.sections.emotional.questions.reduce((sum, q) => {
            return sum + (responses[q.id] || 0);
        }, 0);
        const emotionalAvg = emotionalSum / questionnaireData.sections.emotional.questions.length;
        
        const functionalSum = questionnaireData.sections.functional.questions.reduce((sum, q) => {
            return sum + (responses[q.id] || 0);
        }, 0);
        const functionalAvg = functionalSum / questionnaireData.sections.functional.questions.length;
        
        const physicalSum = questionnaireData.sections.physical.questions.reduce((sum, q) => {
            return sum + (responses[q.id] || 0);
        }, 0);
        const physicalAvg = physicalSum / questionnaireData.sections.physical.questions.length;
        
        const globalScore = responses['G'] || 0;
        
        // Calculate composite score
        const allQuestionsSum = emotionalSum + functionalSum + physicalSum;
        const compositeAvg = allQuestionsSum / (questionnaireData.sections.emotional.questions.length + 
                                               questionnaireData.sections.functional.questions.length + 
                                               questionnaireData.sections.physical.questions.length);
        
        // Convert to standardized scores (20-100)
        const emotionalStd = emotionalAvg * 20;
        const functionalStd = functionalAvg * 20;
        const physicalStd = physicalAvg * 20;
        const globalStd = globalScore * 20;
        const compositeStd = compositeAvg * 20;
        
        return {
            emotional: {
                average: emotionalAvg,
                standardized: emotionalStd,
                interpretation: getInterpretation(emotionalStd)
            },
            functional: {
                average: functionalAvg,
                standardized: functionalStd,
                interpretation: getInterpretation(functionalStd)
            },
            physical: {
                average: physicalAvg,
                standardized: physicalStd,
                interpretation: getInterpretation(physicalStd)
            },
            global: {
                score: globalScore,
                standardized: globalStd,
                interpretation: getInterpretation(globalStd)
            },
            composite: {
                average: compositeAvg,
                standardized: compositeStd,
                interpretation: getInterpretation(compositeStd)
            }
        };
    }
    
    // Get interpretation based on score range
    function getInterpretation(score) {
        for (const range of questionnaireData.scorin
(Content truncated due to size limit. Use line ranges to read in chunks)