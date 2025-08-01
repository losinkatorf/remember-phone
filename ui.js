const ui = {
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
            });

            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this number?')) {
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
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${new Date(stat.date).toLocaleString()}: ${stat.correctCount} / ${stat.totalCount} correct (${stat.percentage.toFixed(2)}%)`;
            statsList.appendChild(li);
        });
    },
    showTestResult: (result) => {
        const resultDiv = document.getElementById('test-status');
        resultDiv.innerHTML = `
            <p>Result: ${result.resultHtml}</p>
            <p>Correctness: ${result.correctPercentage.toFixed(2)}%</p>
        `;
    },
    showFinalTestResults: (correct, total, percentage) => {
        const resultDiv = document.getElementById('test-status');
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