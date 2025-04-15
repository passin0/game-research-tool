const selectedFilters = {};

function loadData() {
    window.itemsData = window.itemsData || [];
    renderGrid();
}
const labelTranslations = {
    category1: {
        A: "未央公司",
        B: "木星工業",
        C: "諾瑪運輸",
        D: "安東尼奧斯"
    },
    category2: {
        A: "火力出眾",
        B: "持續作戰",
        C: "戰略與支援",
        D: "戰機與護航艇"
    },
    category3: {
        A: "投射武器",
        B: "直射武器"
    }
};
function labelTitle(key) {
    switch (key) {
        case 'category1': return '設計公司';
        case 'category2': return '戰略性能';
        case 'category3': return '戰術性能';
        default: return key;
    }
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
    
        // ✅ 加上點擊顯示標籤資訊
        div.addEventListener('click', () => {
            const existing = div.querySelector('.item-detail');
            if (existing) {
                existing.remove(); // 如果已經展開，點一下就收起來
                return;
            }
    
            const detail = document.createElement('div');
            detail.className = 'item-detail';
    
            let info = '';
            ['category1', 'category2', 'category3'].forEach(cat => {
                if (item[cat]) {
                    const tags = Array.isArray(item[cat]) ? item[cat] : [item[cat]];
                    const translated = tags.map(tag => labelTranslations[cat]?.[tag] || tag);
                    info += `<div><strong>${labelTitle(cat)}：</strong>${translated.join('、')}</div>`;
                }
            });
    
            detail.innerHTML = info;
            div.appendChild(detail);
        });
    
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
