const selectedFilters = {};

function loadData() {
    window.itemsData = window.itemsData || [];
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    // 過濾並標記
    const filteredItems = window.itemsData.map(item => {
        let match = true;
        for (const key in selectedFilters) {
            if (selectedFilters[key] && (!item[key] || !item[key].includes(selectedFilters[key]))) {
                match = false;
                break;
            }
        }
        return { ...item, match };
    });

    // 排序：有符合的排前面
    filteredItems.sort((a, b) => (b.match ? 1 : 0) - (a.match ? 1 : 0));

    // 計算符合條件物件的總權重
    const totalWeight = filteredItems
        .filter(item => item.match)
        .reduce((sum, item) => sum + (item.weight || 0), 0);

    // 生成畫面
    filteredItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item' + (item.match ? '' : ' dimmed');

        let content = '';

        if (item.image) {
            content += `<img src="${item.image}" alt="${item.name}">`;
        } else {
            content += `<div class="placeholder"></div>`;
        }

        content += `<div class="name">${item.name}</div>`;

        if (item.match && totalWeight > 0) {
            const probability = ((item.weight / totalWeight) * 100).toFixed(2);
            content += `<div class="probability">機率: ${probability}%</div>`;
        }

        div.innerHTML = content;
        grid.appendChild(div);
    });
}

document.querySelectorAll('button[data-category]').forEach(button => {
    button.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        const value = this.getAttribute('data-value');

        // 切換按鈕狀態
        document.querySelectorAll(`button[data-category="${category}"]`).forEach(btn => {
            btn.classList.remove('active');
        });

        if (selectedFilters[category] === value) {
            delete selectedFilters[category];
        } else {
            this.classList.add('active');
            selectedFilters[category] = value;
        }

        renderGrid();
    });
});

loadData();
