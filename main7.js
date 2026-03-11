/**
 * main7.js (御菓印バージョン)
 */

// --- 1. 設定定数 ---
const STORAGE_KEY = "storedData7"; // 御菓印専用キー
const CSV_FILE_NAME = 'data/gokain.csv';
const OUTPUT_FILENAME = 'gokain.csv';

// エリアとIDのマップ
const castleRegionMap = {
    "1": "北海道", "2": "北海道", "3": "北海道",
    "4": "東北", "5": "東北", "6": "東北", "7": "東北", "8": "東北",
    "9": "東京", "10": "東京", "11": "東京", "12": "東京", "13": "東京",
    "14": "関東", "15": "関東", "16": "関東", "17": "関東",
    "18": "信越・北陸", "19": "信越・北陸", "20": "信越・北陸", "21": "信越・北陸", "22": "信越・北陸", "23": "信越・北陸",
    "24": "中部", "25": "中部", "26": "中部", "27": "中部", "28": "中部", "29": "中部", "30": "中部", "31": "中部", "32": "中部", "33": "中部", "34": "中部", "35": "中部",
    "36": "京都", "37": "京都", "38": "京都", "39": "京都", "40": "京都", "41": "京都",
    "42": "近畿", "43": "近畿", "44": "近畿", "45": "近畿",
    "46": "中国", "47": "中国", "48": "中国",
    "49": "四国", "50": "四国",
    "51": "九州", "52": "九州", "53": "九州", "54": "九州", "55": "九州", "56": "九州", "57": "九州", "58": "九州", "59": "九州"
};

const castleMasterList = {
    "1": "わかさいも本舗", "2": "三八菓舗", "3": "五勝手屋本舗", "4": "回進堂", "5": "乃し梅本舗佐藤屋",
    "6": "白松がモナカ本舗", "7": "九重本舗玉澤", "8": "柏屋", "9": "榮太樓總本鋪", "10": "清月堂本店",
    "11": "赤坂とらや", "12": "うさぎや", "13": "銀座 菊廼舎", "14": "龜屋", "15": "なごみの米屋",
    "16": "豊島屋", "17": "菓子舗間瀬", "18": "羽二重餅總本舗松岡軒", "19": "小布施堂", "20": "越乃雪本舗大和屋",
    "21": "大阪屋", "22": "柴舟小出", "23": "山中石川屋", "24": "きよめ餅総本家", "25": "両口屋是清",
    "26": "青柳総本家", "27": "備前屋", "28": "有限会社野田屋菓子舗", "29": "御菓子つちや", "30": "田中屋せんべい総本家",
    "31": "玉井屋本舗", "32": "赤福", "33": "平治煎餅本店", "34": "深川屋陸奥大掾", "35": "柳屋奉善",
    "36": "聖護院八ッ橋総本店", "37": "豆政", "38": "総本家河道屋", "39": "京都とらや", "40": "井筒八ッ橋本舗",
    "41": "京菓匠 鶴屋𠮷信", "42": "本家菊屋", "43": "白玉屋榮壽", "44": "鶴屋八幡", "45": "伊勢屋本店",
    "46": "廣榮堂", "47": "彩雲堂", "48": "風流堂", "49": "一六本舗", "50": "三友堂",
    "51": "湖月堂", "52": "石村萬盛堂", "53": "村岡総本舗", "54": "丸芳露本舗北島", "55": "大原老舗",
    "56": "カステラ本家 福砂屋", "57": "かるかん元祖明石屋", "58": "お菓子の香梅", "59": "金城堂"
};

// --- グローバル変数 ---
let castleLocations = [];
let allNumbers = [];
let markers = [];
const castleMap = new Map();
const idMap = new Map();
const map = L.map('map').setView([35.6895, 139.6917], 7);

// --- 2. 初期化・イベント設定 ---

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const sidebar = document.getElementById("sidebar");
    const mapzone = document.getElementById("mapzone");
    const content = document.getElementById("content");

    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            sidebar.classList.toggle("hidden");
            mapzone.classList.toggle("active");
            content.classList.toggle("expanded");
            toggleButton.textContent = sidebar.classList.contains("hidden") ? "＞" : "＜";
        });
    }

    const regionSelect = document.getElementById("region");
    if (regionSelect) {
        regionSelect.addEventListener("change", updateCastlePicker);
    }

    loadCSV();
    displayStoredData();
    displayRecords();
});

function displayRecords() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const recordList = document.getElementById("recordList");
    recordList.innerHTML = ""; // リストを初期化

    storedData.forEach(record => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = record.castleName; // お城のIDなどをvalueとして設定
        recordList.appendChild(checkbox);

        const label = document.createElement("label");
        label.textContent = record.castleName;
        recordList.appendChild(label);

        recordList.appendChild(document.createElement("br"));
    });
}

// --- 3. コアロジック（データ管理） ---

function updateCastlePicker() {
    const regionSelect = document.getElementById("region");
    const citySelect = document.getElementById("catsle");
    if (!regionSelect || !citySelect) return;

    const selectedRegion = regionSelect.value;
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const visitedNames = storedData.map(data => data.castleName.trim());

    citySelect.innerHTML = '<option value="">未選択</option>';

    // castleMasterList から該当エリアかつ未訪問のものを抽出
    Object.keys(castleMasterList).forEach(id => {
        const name = castleMasterList[id];
        if (castleRegionMap[id] === selectedRegion && !visitedNames.includes(name)) {
            const option = document.createElement("option");
            option.textContent = name;
            option.value = name;
            citySelect.appendChild(option);
        }
    });
}

function refreshCastleList() {
    updateCastlePicker();
}

function saveData() {
    const selectedCastle = document.getElementById("catsle").value;
    const selectedDate = document.getElementById("selectedDate")?.value || new Date().toISOString().split('T')[0];

    if (selectedCastle.trim() === '') {
        alert('お店が選択されていません。');
        return;
    }

    // IDを逆引き
    const id = Object.keys(castleMasterList).find(key => castleMasterList[key] === selectedCastle);

    let storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const existingIndex = storedData.findIndex(data => data.castleId === id);

    if (existingIndex !== -1) {
        if (!confirm("このお店はすでに保存されています。上書きしますか？")) return;
        storedData.splice(existingIndex, 1);
    }

    storedData.push({ castleId: id, castleName: selectedCastle, date: selectedDate });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));

    // 地図移動とアイコン変更
    const target = castleLocations.find(c => c.name === selectedCastle);
    if (target) {
        map.setView(target.location, 9);
        markerChangeColor(selectedCastle);
    }

    refreshCastleList();
    displayStoredData();
    displayRecords();
    alert("保存しました！");
}

// --- 4. 地図関連 ---

function loadCSV() {
    fetch(CSV_FILE_NAME)
        .then(response => response.text())
        .then(csvData => {
            castleLocations = parseCSV(csvData);
            allNumbers = Object.keys(castleMasterList);
            initMap(castleLocations);
        })
        .catch(error => console.error('CSV読み込みエラー:', error));
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            const id = parts[0];
            const name = parts[1];
            const lat = parseFloat(parts[2]);
            const lng = parseFloat(parts[3]);
            data.push({ id, name, location: [lat, lng] });
            castleMap.set(name, id);
            idMap.set(id, name);
        }
    }
    return data;
}

function initMap(locs) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const defIcon = L.icon({ iconUrl: 'img/wagashi.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
    const visIcon = L.icon({ iconUrl: 'img/hono.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    locs.forEach(c => {
        const isVisited = storedData.some(d => d.castleName === c.name);
        const marker = L.marker(c.location, { icon: isVisited ? visIcon : defIcon })
            .addTo(map)
            .bindPopup(c.name);
        markers.push(marker);
    });
}

function markerChangeColor(name) {
    const visIcon = L.icon({ iconUrl: 'img/hono.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
    markers.forEach(m => {
        if (m.getPopup().getContent() === name) m.setIcon(visIcon);
    });
}

function moveToCastleLocation(name) {
    const target = castleLocations.find(c => c.name === name);
    if (target) {
        map.setView(target.location, 11);
        const tempMarker = L.marker(target.location).addTo(map).bindPopup(target.name).openPopup();
        setTimeout(() => map.removeLayer(tempMarker), 3000);
    }
}

function setCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 8);
            L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map).bindPopup("現在地").openPopup();
        });
    }
}

// --- 5. UI表示関連 ---

async function displayStoredData() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedData.sort((a, b) => Number(a.castleId) - Number(b.castleId));

    const totalCount = Object.keys(castleMasterList).length;
    const cardCount = storedData.length;
    const rate = totalCount > 0 ? Math.round((cardCount / totalCount) * 100) : 0;

    const savedDataDiv = document.getElementById("savedData");
    if (!savedDataDiv) return;

    savedDataDiv.innerHTML = `
    <div class="card-stats-wrapper">
        <div class="card-badge">
            <div class="badge-icon">🍡</div>
            <div class="badge-text">
                <span class="badge-label">御菓印 COLLECTION</span>
                <span class="badge-number"><strong>${cardCount}</strong> / ${totalCount} <small>枚</small></span>
            </div>
        </div>
        <div class="card-status-msg">取得率: <strong>${rate}%</strong></div>
    </div>`;

    storedData.forEach(data => {
        savedDataDiv.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.castleId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.castleName}</a>
                <small style="display:block; color:#666;">${data.date || ''}</small>
            </div>
        </div>`;
    });

    document.querySelectorAll('.castle-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            moveToCastleLocation(e.target.textContent);
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    createVisitChart(storedData);
}
async function displayStoredData2() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalCount = Object.keys(castleMasterList).length;
    const cardCount = storedData.length;
    const rate = totalCount > 0 ? Math.round((cardCount / totalCount) * 100) : 0;

    const savedDataDiv = document.getElementById("savedData");
    if (!savedDataDiv) return;

    savedDataDiv.innerHTML = `
    <div class="card-stats-wrapper">
        <div class="card-badge">
            <div class="badge-icon">🍡</div>
            <div class="badge-text">
                <span class="badge-label">御菓印 COLLECTION</span>
                <span class="badge-number"><strong>${cardCount}</strong> / ${totalCount} <small>枚</small></span>
            </div>
        </div>
        <div class="card-status-msg">取得率: <strong>${rate}%</strong></div>
    </div>`;

    storedData.forEach(data => {
        savedDataDiv.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.castleId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.castleName}</a>
                <small style="display:block; color:#666;">${data.date || ''}</small>
            </div>
        </div>`;
    });

    document.querySelectorAll('.castle-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            moveToCastleLocation(e.target.textContent);
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    createVisitChart(storedData);
}

/**
 * 未取得リストの表示/非表示を切り替える本体
 */
function toggleUnvisitedList() {
    const nameListDiv = document.getElementById("nameList");
    const btn = document.getElementById("btn-toggle-unvisited") || document.querySelector("button[onclick*='toggleUnvisitedListWrapper']");

    // 中身が空（非表示状態）なら表示する
    if (nameListDiv.innerHTML === "") {
        getAllCastleIds(); // 未取得リストを生成する関数
        if (btn) btn.textContent = "未取得の御菓印を隠す";
    } else {
        nameListDiv.innerHTML = ""; // 非表示にする
        if (btn) btn.textContent = "未取得の御菓印を表示";
    }
}

function toggleDeleteList() {
    const recordListDiv = document.getElementById("recordList");
    const btn = document.getElementById("btn-toggle-delete");

    // ディスプレイ設定が none なら表示する
    if (recordListDiv.style.display === 'none') {
        getRcordList(); // 既存の表示関数を呼び出す
        // getRcordList内でstyle.display='block'されるのでここではテキスト変更のみ
        btn.textContent = "削除リストを閉じる";
    } else {
        kakusu3(); // 既存の非表示（style.display='none'）関数を呼び出す
        btn.textContent = "削除リストを表示";
    }
}

/**
 * 御菓印の取得記録を月別グラフ（Chart.js）で表示
 */
function createVisitChart(storedData) {
    const canvas = document.getElementById('visitChart');
    if (!canvas) return; // HTMLに <canvas id="visitChart"></canvas> がない場合は何もしない

    const ctx = canvas.getContext('2d');

    // 1. データの集計 (月ごとにカウント)
    const visitCounts = {};
    storedData.forEach(data => {
        if (data.date) {
            const month = data.date.substring(0, 7); // "YYYY-MM" 形式
            visitCounts[month] = (visitCounts[month] || 0) + 1;
        }
    });

    // 2. グラフ用のラベル（月）とデータ（数）を整理
    const sortedMonths = Object.keys(visitCounts).sort();
    const counts = sortedMonths.map(m => visitCounts[m]);

    // 3. 既存のグラフがある場合は破棄（再描画時のバグ防止）
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // 4. Chart.js インスタンスの作成
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedMonths,
            datasets: [{
                label: '取得数',
                data: counts,
                backgroundColor: 'rgba(255, 152, 0, 0.6)', // 和菓子っぽいオレンジ系に変更
                borderColor: '#fb8c00',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, precision: 0 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function getAllCastleIds() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const visitedIds = storedData.map(d => String(d.castleId));
    const allIds = Object.keys(castleMasterList);
    const unvisitedIds = allIds.filter(id => !visitedIds.includes(id));

    const nameListDiv = document.getElementById("nameList");
    let html = `
        <div class="list-header goshouin-header">
            <h3>未取得の御菓印一覧</h3>
            <p class="remaining-count">残り <span>${unvisitedIds.length}</span> 枚</p>
        </div>
        <div class="castle-grid">`;

    unvisitedIds.forEach(id => {
        html += `
            <div class="castle-item unvisited goshouin-item">
                <span class="id-badge">${id}</span>
                <a href="#" class="castle-link2">${castleMasterList[id]}</a>
            </div>`;
    });

    html += `</div>`;
    nameListDiv.innerHTML = html;

    document.querySelectorAll('.castle-link2').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            moveToCastleLocation(e.target.textContent);
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

// --- 6. 削除・リセット ---

function getRcordList() {
    const recordListDiv = document.getElementById("recordList");
    recordListDiv.style.display = 'block';
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedData.sort((a, b) => Number(a.castleId) - Number(b.castleId));

    let html = `<div class="list-header delete-header"><h3>削除する御菓印の選択</h3></div><div class="castle-grid">`;
    storedData.forEach(record => {
        html += `
            <div class="castle-item delete-item">
                <input type="checkbox" id="del-${record.castleId}" value="${record.castleName}" class="delete-checkbox">
                <label for="del-${record.castleId}">
                    <span class="id-badge">${record.castleId}</span> ${record.castleName}
                </label>
            </div>`;
    });
    html += `</div><button onclick="remove()" class="btn-execute-delete">選択した項目を削除</button>`;
    recordListDiv.innerHTML = html;
}

function remove() {
    const selected = Array.from(document.querySelectorAll(".delete-checkbox:checked")).map(c => c.value);
    if (selected.length === 0) return alert("削除する項目を選んでください");

    if (confirm("選択した記録を削除しますか？")) {
        let storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const updated = storedData.filter(r => !selected.includes(r.castleName));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        initMap(castleLocations); // 地図アイコン再描画
        refreshCastleList();
        displayStoredData();
        getRcordList();
    }
}

function reset() {
    if (confirm('全ての御菓印データをリセットしますか？')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// --- ヘルパー ---
function toggleUnvisitedList() {
    const div = document.getElementById("nameList");
    const btn = document.getElementById("btn-toggle-unvisited");
    if (div.innerHTML === "") {
        getAllCastleIds();
        btn.textContent = "未取得を隠す";
    } else {
        div.innerHTML = "";
        btn.textContent = "未取得を表示";
    }
}

function kakusu() { document.getElementById("nameList").innerHTML = ""; }
function kakusu2() {
    const savedDataDiv = document.getElementById("savedData");
    if (savedDataDiv) {
        savedDataDiv.innerHTML = "";
    }
}
function kakusu3() { document.getElementById("recordList").style.display = 'none'; }