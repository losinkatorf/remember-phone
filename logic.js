document.addEventListener('DOMContentLoaded', () => {
    ui.renderPhones();
    ui.renderStats();

    document.getElementById('phone-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('phone-id').value;
        const number = document.getElementById('phone-number').value;
        const description = document.getElementById('phone-description').value;

        if (id) {
            data.updatePhone({ id: parseInt(id), number, description });
        } else {
            data.addPhone({ number, description });
        }

        ui.renderPhones();
        document.getElementById('phone-form').reset();
    });

    document.getElementById('check-button').addEventListener('click', () => {
        const description = document.getElementById('test-description').textContent;
        const phones = data.getPhones();
        const phone = phones.find(p => p.description === description);
        const userInput = document.getElementById('test-input').value;

        if (phone) {
            const result = logic.checkAnswer(userInput, phone.number);
            ui.showTestResult(result);
        }
    });

    document.getElementById('export-button').addEventListener('click', () => {
        const json = data.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'phone-remember-data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('import-button').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (data.importData(event.target.result)) {
                    ui.renderPhones();
                    ui.renderStats();
                    alert('Data imported successfully!');
                } else {
                    alert('Invalid data format!');
                }
            };
            reader.readAsText(file);
        }
    });

    const themeSwitch = document.getElementById('theme-switch');

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme', themeSwitch.checked);
        localStorage.setItem('theme', themeSwitch.checked ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        themeSwitch.checked = savedTheme === 'dark';
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeSwitch.checked = true;
        document.body.classList.add('dark-theme');
    }
    
    document.getElementById('show-main-screen').addEventListener('click', () => ui.showScreen('main-screen'));
    document.getElementById('show-test-screen').addEventListener('click', () => {
        ui.showScreen('test-screen');
        logic.startTest();
    });
    document.getElementById('show-stats-screen').addEventListener('click', () => ui.showScreen('stats-screen'));
});

let testSession = {
    phones: [],
    currentIndex: 0,
    correctAnswers: 0,
};

const logic = {
    startTest: () => {
        const phones = data.getPhones();
        if (phones.length === 0) {
            document.getElementById('test-description').textContent = 'No phone numbers to test.';
            document.getElementById('test-input').value = '';
            document.getElementById('test-result').innerHTML = '';
            document.getElementById('check-button').disabled = true;
            return;
        }

        testSession.phones = [...phones].sort(() => Math.random() - 0.5); // Shuffle phones
        testSession.currentIndex = 0;
        testSession.correctAnswers = 0;
        document.getElementById('check-button').disabled = false;
        logic.displayCurrentTest();
    },

    displayCurrentTest: () => {
        if (testSession.currentIndex < testSession.phones.length) {
            const currentPhone = testSession.phones[testSession.currentIndex];
            document.getElementById('test-description').textContent = currentPhone.description;
            document.getElementById('test-input').value = '';
            document.getElementById('test-result').innerHTML = '';
            document.getElementById('check-button').textContent = 'Check';
            document.getElementById('check-button').onclick = () => logic.checkCurrentAnswer();
        } else {
            logic.endTest();
        }
    },

    checkCurrentAnswer: () => {
        const currentPhone = testSession.phones[testSession.currentIndex];
        const userInput = document.getElementById('test-input').value;
        const result = logic.checkAnswer(userInput, currentPhone.number);

        ui.showTestResult(result);

        if (result.correctPercentage === 100) {
            testSession.correctAnswers++;
        }

        document.getElementById('check-button').textContent = 'Next';
        document.getElementById('check-button').onclick = () => {
            testSession.currentIndex++;
            logic.displayCurrentTest();
        };
    },

    checkAnswer: (userInput, correctNumber) => {
        const cleanInput = userInput.replace(/\D/g, '');
        const cleanCorrectNumber = correctNumber.replace(/\D/g, '');
        let resultHtml = '';
        let correctCount = 0;

        for (let i = 0; i < cleanCorrectNumber.length; i++) {
            if (i < cleanInput.length && cleanInput[i] === cleanCorrectNumber[i]) {
                resultHtml += `<span class="correct-digit">${cleanCorrectNumber[i]}</span>`;
                correctCount++;
            } else {
                resultHtml += `<span class="wrong-digit">${cleanCorrectNumber[i]}</span>`;
            }
        }

        return {
            resultHtml,
            correctPercentage: (correctCount / cleanCorrectNumber.length) * 100,
        };
    },

    endTest: () => {
        const totalPhones = testSession.phones.length;
        const percentage = (testSession.correctAnswers / totalPhones) * 100;
        data.addStat(testSession.correctAnswers, totalPhones, percentage);
        ui.renderStats();
        ui.showFinalTestResults(testSession.correctAnswers, totalPhones, percentage);
        document.getElementById('check-button').disabled = true;
    },
};