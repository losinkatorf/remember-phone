const data = {
    getPhones: () => {
        return JSON.parse(localStorage.getItem('phones') || '[]');
    },
    savePhones: (phones) => {
        localStorage.setItem('phones', JSON.stringify(phones));
    },
    addPhone: (phone) => {
        const phones = data.getPhones();
        phones.push({ id: Date.now(), ...phone });
        data.savePhones(phones);
    },
    updatePhone: (updatedPhone) => {
        let phones = data.getPhones();
        phones = phones.map(phone => phone.id === updatedPhone.id ? updatedPhone : phone);
        data.savePhones(phones);
    },
    deletePhone: (id) => {
        let phones = data.getPhones();
        phones = phones.filter(phone => phone.id !== id);
        data.savePhones(phones);
    },
    getStats: () => {
        return JSON.parse(localStorage.getItem('stats') || '[]');
    },
    saveStats: (stats) => {
        localStorage.setItem('stats', JSON.stringify(stats));
    },
    addStat: (correctCount, totalCount, percentage) => {
        const stats = data.getStats();
        stats.push({ date: new Date().toISOString(), correctCount, totalCount, percentage });
        data.saveStats(stats);
    },
    exportData: () => {
        const exportData = {
            phones: data.getPhones(),
            stats: data.getStats(),
        };
        return JSON.stringify(exportData, null, 2);
    },
    importData: (json) => {
        try {
            const importedData = JSON.parse(json);
            if (importedData.phones) {
                data.savePhones(importedData.phones);
            }
            if (importedData.stats) {
                data.saveStats(importedData.stats);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },
};