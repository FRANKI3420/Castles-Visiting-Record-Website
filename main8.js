// --- 1. 設定定数 ---
const STORAGE_KEY = "storedData8"; // タワーメダル専用キー
const CSV_FILE_NAME = 'data/tower.csv';
const OUTPUT_FILENAME = 'tower_medal.csv';

// 22個の全国タワーマスタデータ
const towerMasterList = {
    "1": "JRタワー", "2": "さっぽろテレビ塔", "3": "五稜郭タワー", "4": "マリオス", "5": "銚子ポートタワー",
    "6": "千葉ポートタワー", "7": "東京タワー", "8": "東京スカイツリー", "9": "クロスランドタワー", "10": "東尋坊タワー",
    "11": "東山スカイタワー", "12": "中部電力 MIRAI TOWER", "13": "京都タワー", "14": "あべのハルカス", "15": "通天閣",
    "16": "コスモタワー", "17": "夢みなとタワー", "18": "ゴールドタワー", "19": "海峡ゆめタワー", "20": "福岡タワー",
    "21": "別府タワー", "22": "古宇利オーシャンタワー"
};

// --- グローバル変数 ---
let towerLocations = [];
let markers = [];
const towerMap = new Map();
const idMap = new Map();
const map = L.map('map').setView([38.0, 137.0], 5); // 日本全体が見える初期位置

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

    loadCSV();
    displayStoredData();
    displayRecords();
});

function displayRecords() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const recordList = document.getElementById("recordList");
    if (!recordList) return;
    recordList.innerHTML = "";

    storedData.forEach(record => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = record.towerName;
        recordList.appendChild(checkbox);

        const label = document.createElement("label");
        label.textContent = record.towerName;
        recordList.appendChild(label);
        recordList.appendChild(document.createElement("br"));
    });
}

// --- 3. コアロジック（データ管理） ---

function updateTowerPicker() {
    const citySelect = document.getElementById("tower");
    if (!citySelect) return;

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const visitedNames = storedData.map(data => data.towerName.trim());

    citySelect.innerHTML = '<option value="">未選択</option>';

    Object.keys(towerMasterList).forEach(id => {
        const name = towerMasterList[id];
        if (!visitedNames.includes(name)) {
            const option = document.createElement("option");
            option.textContent = name;
            option.value = name;
            citySelect.appendChild(option);
        }
    });
}

function refreshTowerList() {
    updateTowerPicker();
}

function saveData() {
    const selectedTower = document.getElementById("tower").value;
    if (selectedTower.trim() === '') {
        alert('タワー名が選択されていません。');
        return;
    }

    // IDを逆引き
    const id = Object.keys(towerMasterList).find(key => towerMasterList[key] === selectedTower);

    let storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const existingIndex = storedData.findIndex(data => data.towerId === id);

    if (existingIndex !== -1) {
        if (!confirm("このタワーはすでに保存されています。上書きしますか？")) return;
        storedData.splice(existingIndex, 1);
    }

    storedData.push({ towerId: id, towerName: selectedTower });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));

    const target = towerLocations.find(t => t.name === selectedTower);
    if (target) {
        map.setView(target.location, 9);
        markerChangeColor(selectedTower);
    }

    refreshTowerList();
    displayStoredData();
    displayRecords();
    alert("保存しました！");
}

// --- 4. 地図関連 ---

function loadCSV() {
    fetch(CSV_FILE_NAME)
        .then(response => response.text())
        .then(csvData => {
            towerLocations = parseCSV(csvData);
            initMap(towerLocations);
            updateTowerPicker();
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
            towerMap.set(name, id);
            idMap.set(id, name);
        }
    }
    return data;
}

function initMap(locs) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const defIcon = L.icon({ iconUrl: 'img/medaru.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
    const visIcon = L.icon({ iconUrl: 'img/get.jpeg', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    locs.forEach(c => {
        const isVisited = storedData.some(d => d.towerName === c.name);
        const marker = L.marker(c.location, { icon: isVisited ? visIcon : defIcon })
            .addTo(map)
            .bindPopup(c.name);
        markers.push(marker);
    });
}

function markerChangeColor(name) {
    const visIcon = L.icon({ iconUrl: 'img/get.jpeg', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
    markers.forEach(m => {
        if (m.getPopup().getContent() === name) m.setIcon(visIcon);
    });
}

function moveToCastleLocation(name) {
    const target = towerLocations.find(t => t.name === name);
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

function displayStoredData() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedData.sort((a, b) => Number(a.towerId) - Number(b.towerId));

    const totalCount = Object.keys(towerMasterList).length;
    const cardCount = storedData.length;
    const rate = totalCount > 0 ? Math.round((cardCount / totalCount) * 100) : 0;

    const savedDataDiv = document.getElementById("savedData");
    if (!savedDataDiv) return;

    savedDataDiv.innerHTML = `
    <div class="card-stats-wrapper">
        <div class="card-badge">
            <div class="badge-icon">🪙</div>
            <div class="badge-text">
                <span class="badge-label">TOWER COLLECTION</span>
                <span class="badge-number"><strong>${cardCount}</strong> / ${totalCount} <small>枚</small></span>
            </div>
        </div>
        <div class="card-status-msg">取得率: <strong>${rate}%</strong></div>
    </div>`;

    storedData.forEach(data => {
        savedDataDiv.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.towerId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.towerName}</a>
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
}

/**
 * 御菓印のロジックを踏襲したグリッド型「未取得リスト」の生成
 */
function getAllTowerIds() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const visitedIds = storedData.map(d => String(d.towerId));
    const allIds = Object.keys(towerMasterList);
    const unvisitedIds = allIds.filter(id => !visitedIds.includes(id));

    const nameListDiv = document.getElementById("nameList");
    if (!nameListDiv) return;

    // 御菓印と同様に castle-grid クラスを使用して出力
    let html = `
        <div class="list-header goshouin-header">
            <h3>未取得のタワーメダル一覧</h3>
            <p class="remaining-count">残り <span>${unvisitedIds.length}</span> 枚</p>
        </div>
        <div class="castle-grid">`;

    unvisitedIds.forEach(id => {
        html += `
            <div class="castle-item unvisited goshouin-item">
                <span class="id-badge">${id}</span>
                <a href="#" class="castle-link2">${towerMasterList[id]}</a>
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

function toggleUnvisitedList() {
    const div = document.getElementById("nameList");
    const btn = document.getElementById("btn-toggle-unvisited");
    if (div.innerHTML === "") {
        getAllTowerIds();
        btn.textContent = "未取得のタワーメダルを隠す";
    } else {
        div.innerHTML = "";
        btn.textContent = "未取得のタワーメダルを表示";
    }
}

function toggleDeleteList() {
    const recordListDiv = document.getElementById("recordList");
    const btn = document.getElementById("btn-toggle-delete");

    if (recordListDiv.style.display === 'none') {
        getRcordList();
        btn.textContent = "削除リストを閉じる";
    } else {
        kakusu3();
        btn.textContent = "削除リストを表示";
    }
}

// --- 6. 削除・リセット ---

function getRcordList() {
    const recordListDiv = document.getElementById("recordList");
    if (!recordListDiv) return;
    recordListDiv.style.display = 'block';

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedData.sort((a, b) => Number(a.towerId) - Number(b.towerId));

    let html = `<div class="list-header delete-header"><h3>削除するタワーメダルの選択</h3></div><div class="castle-grid">`;
    storedData.forEach(record => {
        html += `
            <div class="castle-item delete-item">
                <input type="checkbox" id="del-${record.towerId}" value="${record.towerName}" class="delete-checkbox">
                <label for="del-${record.towerId}">
                    <span class="id-badge">${record.towerId}</span> ${record.towerName}
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
        const updated = storedData.filter(r => !selected.includes(r.towerName));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        initMap(towerLocations); // 地图再描画
        refreshTowerList();
        displayStoredData();
        getRcordList();
    }
}

function reset() {
    if (confirm('全てのタワーメダルデータをリセットしますか？')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// CSVエクスポート用関数
function convertToCSV(dataArray) {
    const csvArray = [];
    csvArray.push(['タワーID', 'タワー名']);
    dataArray.forEach(function (data) {
        csvArray.push([data.towerId, data.towerName]);
    });
    return csvArray.map(row => row.join(',')).join('\n');
}

function outputCSV() {
    if (confirm('csv形式でデータを出力しますか')) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const csvData = convertToCSV(storedData);
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', OUTPUT_FILENAME);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function inputCSV() {
    const fileInput = document.getElementById('csvInput');
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const rows = e.target.result.split('\n').slice(1);
        parsedData = rows.map(row => {
            const cells = row.split(',').map(c => c.trim());
            return { id: cells[0], name: cells[1] };
        }).filter(item => item.id && item.name);

        const output = document.getElementById('output');
        output.textContent = "読み込んだデータ:\n" + parsedData.map(item => `${item.id}: ${item.name}`).join('\n');
        document.getElementById('loadButton').style.display = 'inline-block';
    };
    reader.readAsText(file, 'UTF-8');
}

let parsedData = [];
function addData() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    parsedData.forEach(item => {
        if (!storedData.some(e => e.towerName === item.name)) {
            storedData.push({ towerId: item.id, towerName: item.name });
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
    alert("データが追加されました。");
    location.reload();
}

function kakusu2() {
    const savedDataDiv = document.getElementById("savedData");
    if (savedDataDiv) savedDataDiv.innerHTML = "";
}
function kakusu3() { document.getElementById("recordList").style.display = 'none'; }