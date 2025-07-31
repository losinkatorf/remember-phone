const ui = {
    renderPhones: () => {
        const phoneList = document.getElementById('phone-list');
        phoneList.innerHTML = '';
        const phones = data.getPhones();
        phones.forEach(phone => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${phone.number} - ${phone.description}</span>
                <div>
                    <button class="btn btn-sm btn-primary me-2">Edit</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </div>
            `;

            li.querySelector('.btn-primary').addEventListener('click', () => {
                document.getElementById('phone-id').value = phone.id;
                document.getElementById('phone-number').value = phone.number;
                document.getElementById('phone-description').value = phone.description;
            });

            li.querySelector('.btn-danger').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this number?')) {
                    data.deletePhone(phone.id);
                    ui.renderPhones();
                }
            });

            phoneList.appendChild(li);
        });
    },
    renderStats: () => {
        const statsList = document.getElementById('stats-list');
        statsList.innerHTML = '';
        const stats = data.getStats().filter(stat => stat.percentage !== undefined).sort((a, b) => new Date(b.date) - new Date(a.date));
        stats.forEach(stat => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${new Date(stat.date).toLocaleString()}: ${stat.correctCount} / ${stat.totalCount} correct (${stat.percentage.toFixed(2)}%)`;
            statsList.appendChild(li);
        });
    },
    showTestResult: (result) => {
        const resultDiv = document.getElementById('test-result');
        resultDiv.innerHTML = `
            <p>Result: ${result.resultHtml}</p>
            <p>Correctness: ${result.correctPercentage.toFixed(2)}%</p>
        `;
    },
    showFinalTestResults: (correct, total, percentage) => {
        const resultDiv = document.getElementById('test-result');
        resultDiv.innerHTML = `
            <h3>Test Complete!</h3>
            <p>You got ${correct} out of ${total} correct.</p>
            <p>Overall Correctness: ${percentage.toFixed(2)}%</p>
        `;
    },
    showScreen: (screenId) => {
        ['main-screen', 'test-screen', 'stats-screen'].forEach(id => {
            document.getElementById(id).classList.add('d-none');
        });
        document.getElementById(screenId).classList.remove('d-none');
    },
};