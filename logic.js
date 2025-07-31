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
            data.addStat({ description, correct: result.correctPercentage === 100 });
            ui.renderStats();
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

const logic = {
    startTest: () => {
        const phones = data.getPhones();
        if (phones.length > 0) {
            const randomPhone = phones[Math.floor(Math.random() * phones.length)];
            document.getElementById('test-description').textContent = randomPhone.description;
            document.getElementById('test-input').value = '';
            document.getElementById('test-result').innerHTML = '';
        }
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
};