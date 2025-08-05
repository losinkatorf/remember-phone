const ui = {
    currentLanguage: 'en', // Default language

    setLanguage: (lang) => {
        ui.currentLanguage = lang;
        document.documentElement.lang = lang;
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        document.title = translations[lang].rememberTheNumber + ' - ' + translations[lang].appDescription.split('.')[0];
        document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].appDescription);
        document.querySelector('meta[name="keywords"]').setAttribute('content', translations[lang].keywords || '');
        document.querySelector('meta[property="og:title"]').setAttribute('content', translations[lang].rememberTheNumber + ' - ' + translations[lang].appDescription.split('.')[0]);
        document.querySelector('meta[property="og:description"]').setAttribute('content', translations[lang].appDescription);
        document.querySelector('meta[property="twitter:title"]').setAttribute('content', translations[lang].rememberTheNumber + ' - ' + translations[lang].appDescription.split('.')[0]);
        document.querySelector('meta[property="twitter:description"]').setAttribute('content', translations[lang].appDescription);

        // Update specific elements that are not easily handled by data-translate
        document.getElementById('phone-number').placeholder = translations[lang].phoneNumber;
        document.getElementById('phone-description').placeholder = translations[lang].description;
        document.getElementById('phone-form').querySelector('button[type="submit"]').textContent = translations[lang].addUpdate;
        document.querySelector('#phone-list').previousElementSibling.querySelector('th:nth-child(1)').textContent = translations[lang].number;
        document.querySelector('#phone-list').previousElementSibling.querySelector('th:nth-child(2)').textContent = translations[lang].description;
        document.getElementById('enter-phone-number-for').textContent = translations[lang].enterPhoneNumberFor;
        document.getElementById('check-button').textContent = translations[lang].check;
        document.querySelector('#stats-screen h2').childNodes[1].nodeValue = translations[lang].statistics;
        document.querySelector('#stats-list').previousElementSibling.querySelector('th:nth-child(1)').textContent = translations[lang].date;
        document.querySelector('#stats-list').previousElementSibling.querySelector('th:nth-child(2)').textContent = translations[lang].correct;
        document.querySelector('#stats-list').previousElementSibling.querySelector('th:nth-child(3)').textContent = translations[lang].percentage;
        document.querySelector('footer p').textContent = translations[lang].appDescription;

        // Update button texts

        // Update test results based on current language
        if (document.getElementById('test-status').innerHTML !== '') {
            // Re-render test results if visible to apply new language
            // This part needs to be handled by re-calling the display functions in logic.js
        }
    },
    renderPhones: () => {
        const phoneList = document.getElementById('phone-list');
        phoneList.innerHTML = '';
        const phones = data.getPhones();
        phones.forEach(phone => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${phone.number}</td>
                <td>${phone.description}</td>
                <td>
                    <button class="btn btn-sm me-2 edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button class="btn btn-sm delete-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </td>
            `;

            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('phone-id').value = phone.id;
                document.getElementById('phone-number').value = phone.number;
                document.getElementById('phone-description').value = phone.description;

                const phoneForm = document.getElementById('phone-form');
                phoneForm.classList.add('flash-animation');
                document.getElementById('phone-number').focus();

                setTimeout(() => {
                    phoneForm.classList.remove('flash-animation');
                }, 500);
            });

            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(translations[ui.currentLanguage].areYouSureDelete)) {
                    data.deletePhone(phone.id);
                    ui.renderPhones();
                }
            });

            phoneList.appendChild(tr);
        });
    },
    renderStats: () => {
        const statsList = document.getElementById('stats-list');
        statsList.innerHTML = '';
        const stats = data.getStats().filter(stat => stat.percentage !== undefined).sort((a, b) => new Date(b.date) - new Date(a.date));
        stats.forEach(stat => {
            const tr = document.createElement('tr');
            const percentage = stat.percentage;
            const colorClass = ui.getPercentageColorClass(percentage);
            tr.innerHTML = `
                <td>${new Date(stat.date).toLocaleString()}</td>
                <td>${stat.correctCount} / ${stat.totalCount}</td>
                <td><span class="${colorClass}">${percentage.toFixed(2)}%</span></td>
            `;
            statsList.appendChild(tr);
        });
    },
    showTestResult: (result) => {
        const resultDiv = document.getElementById('test-status');
        const percentage = result.correctPercentage;
        const colorClass = ui.getPercentageColorClass(percentage);
        resultDiv.innerHTML = `
            <p>${translations[ui.currentLanguage].result}: ${result.resultHtml}</p>
            <p>${translations[ui.currentLanguage].correctness}: <span class="${colorClass}">${percentage.toFixed(2)}%</span></p>
        `;
    },
    showFinalTestResults: (correct, total, percentage) => {
        const resultDiv = document.getElementById('test-status');
        const colorClass = ui.getPercentageColorClass(percentage);
        resultDiv.innerHTML = `
            <h3 class="test-description">${translations[ui.currentLanguage].testComplete}</h3>
            <p>${translations[ui.currentLanguage].youGot} <span class="test-description">${correct}</span> ${translations[ui.currentLanguage].outOf} <span class="test-description">${total}</span> ${translations[ui.currentLanguage].correctLabel}</p>
            <p>${translations[ui.currentLanguage].overallCorrectness}: <span class="${colorClass}">${percentage.toFixed(2)}%</span></p>
        `;
    },
    getPercentageColorClass: (percentage) => {
        if (percentage <= 30) {
            return 'wrong-digit';
        }
        if (percentage <= 70) {
            return 'test-description';
        }
        return 'correct-digit';
    },
    showScreen: (screenId) => {
        const screens = ['main-screen', 'test-screen', 'stats-screen'];
        const currentScreen = screens.find(id => !document.getElementById(id).classList.contains('d-none'));

        const focusElement = () => {
            if (screenId === 'main-screen') {
                document.getElementById('phone-number').focus();
            } else if (screenId === 'test-screen') {
                document.getElementById('test-input').focus();
            }
        };

        if (currentScreen && currentScreen !== screenId) {
            const currentScreenElement = document.getElementById(currentScreen);
            currentScreenElement.classList.add('fade-out');

            setTimeout(() => {
                currentScreenElement.classList.add('d-none');
                currentScreenElement.classList.remove('fade-out');

                const newScreenElement = document.getElementById(screenId);
                newScreenElement.classList.remove('d-none');
                newScreenElement.classList.add('fade-in');

                focusElement();

                setTimeout(() => {
                    newScreenElement.classList.remove('fade-in');
                }, 300);
            }, 300);
        } else {
            focusElement();
        }

        ['show-main-screen', 'show-test-screen', 'show-stats-screen'].forEach(id => {
            document.getElementById(id).classList.remove('btn-primary');
            document.getElementById(id).classList.add('btn-info');
        });

        document.getElementById(`show-${screenId}`).classList.remove('btn-info');
        document.getElementById(`show-${screenId}`).classList.add('btn-primary');

        if (screenId !== 'test-screen') {
            document.getElementById('test-status').innerHTML = '';
        }
    },
};