/**
 * 共通関数ライブラリ
 * 各ページで使用される共通機能を提供
 */

/**
 * 未訪問リストの表示/非表示を切り替える
 * @param {Function} getAllCastleIdsFunc - 未訪問リストを表示する関数
 * @param {Function} kakusuFunc - 非表示にする関数
 * @param {string} hideText - 非表示ボタンのテキスト
 * @param {string} showText - 表示ボタンのテキスト
 */
function toggleUnvisitedList(getAllCastleIdsFunc, kakusuFunc, hideText = "未訪問のお城を隠す", showText = "未訪問のお城を表示") {
    const nameListDiv = document.getElementById("nameList");
    const btn = document.getElementById("btn-toggle-unvisited");

    if (nameListDiv.innerHTML === "") {
        if (getAllCastleIdsFunc) getAllCastleIdsFunc();
        btn.textContent = hideText;
        btn.classList.add("active");
    } else {
        if (kakusuFunc) kakusuFunc();
        btn.textContent = showText;
        btn.classList.remove("active");
    }
}

/**
 * 削除リストの表示/非表示を切り替える
 * @param {Function} getRcordListFunc - 削除リストを表示する関数
 * @param {Function} kakusu3Func - 非表示にする関数
 */
function toggleDeleteList(getRcordListFunc, kakusu3Func) {
    const recordListDiv = document.getElementById("recordList");
    const btn = document.getElementById("btn-toggle-delete");

    if (recordListDiv.style.display === 'none') {
        if (getRcordListFunc) getRcordListFunc();
        btn.textContent = "削除リストを閉じる";
    } else {
        if (kakusu3Func) kakusu3Func();
        btn.textContent = "削除リストを表示";
    }
}

/**
 * 非表示関数群
 */
function kakusu() {
    const nameListDiv = document.getElementById("nameList");
    if (nameListDiv) nameListDiv.innerHTML = null;
}

function kakusu2() {
    const nameListDiv = document.getElementById("savedData");
    if (nameListDiv) nameListDiv.innerHTML = null;
}

function kakusu3() {
    const nameListDiv = document.getElementById("recordList");
    if (nameListDiv) {
        nameListDiv.style.display = 'none';
        nameListDiv.innerHTML = null;
    }
}

/**
 * 訪問履歴から月別グラフを描画する
 * @param {Array} storedData - LocalStorageから取得したデータの配列
 */
function createVisitChart(storedData) {
    const ctx = document.getElementById('visitChart');
    if (!ctx) return;

    const visitCounts = {};
    storedData.forEach(data => {
        if (data.date) {
            const month = data.date.substring(0, 7);
            visitCounts[month] = (visitCounts[month] || 0) + 1;
        }
    });

    const sortedMonths = Object.keys(visitCounts).sort();
    const counts = sortedMonths.map(m => visitCounts[m]);

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedMonths,
            datasets: [{
                label: '訪問数',
                data: counts,
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: '#4caf50',
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

/**
 * CSV形式に変換する関数
 * @param {Array} dataArray - データ配列
 * @param {Array} headers - CSVヘッダー（デフォルト: ['城ID', '城名', '日付']）
 */
function convertToCSV(dataArray, headers = ['城ID', '城名', '日付']) {
    const csvArray = [];
    csvArray.push(headers);
    dataArray.forEach(function (data) {
        const row = [];
        if (headers.includes('城ID')) row.push(data.castleId);
        if (headers.includes('城名')) row.push(data.castleName);
        if (headers.includes('日付')) row.push(data.date || '');
        csvArray.push(row);
    });
    return csvArray.map(row => row.join(',')).join('\n');
}

/**
 * CSV出力関数
 * @param {string} storageKey - localStorageのキー
 * @param {string} filename - 出力ファイル名
 * @param {Array} headers - CSVヘッダー
 */
function outputCSV(storageKey, filename, headers = ['城ID', '城名', '日付']) {
    const confirmation = confirm('csv形式でデータを出力しますか');
    if (confirmation) {
        const storedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        const csvData = convertToCSV(storedData, headers);
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * CSV入力関数
 * @param {Function} parseInputCSVFunc - CSV解析関数
 * @param {Function} displayDataFunc - データ表示関数
 */
function inputCSV(parseInputCSVFunc, displayDataFunc) {
    const fileInput = document.getElementById('csvInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('CSVファイルを選択してください。');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const csvContent = event.target.result;
        window.parsedData = parseInputCSVFunc(csvContent);
        if (displayDataFunc) displayDataFunc(window.parsedData);
    };
    reader.onerror = function () {
        alert('ファイルを読み込む際にエラーが発生しました。');
    };
    reader.readAsText(file, 'UTF-8');
    const loadButton = document.getElementById('loadButton');
    if (loadButton) loadButton.style.display = 'inline';
}

/**
 * CSV入力データの解析（汎用版）
 * @param {string} data - CSV文字列
 * @param {boolean} hasDate - 日付フィールドがあるか
 */
function parseInputCSV(data, hasDate = true) {
    const rows = data.split('\n');
    return rows.slice(1).map(row => {
        const cells = row.split(',').map(cell => cell.trim());
        if (cells.length < 2 || cells.every(cell => cell === "")) {
            return null;
        }
        const result = {
            id: cells[0],
            name: cells[1]
        };
        if (hasDate && cells[2]) {
            result.date = cells[2];
        }
        return result;
    }).filter(item => item !== null);
}

/**
 * データ表示関数
 * @param {Array} data - 表示するデータ
 * @param {string} label - ラベル（デフォルト: '城名'）
 */
function displayData(data, label = '城名') {
    const output = document.getElementById('output');
    if (!output) return;
    output.textContent = "読み込んだデータ\n";
    const formattedData = data.map(item => {
        if (item.date) {
            return `${item.id}, ${label}: ${item.name}, 日付: ${item.date}`;
        }
        return `${item.id}, ${label}: ${item.name}`;
    }).join('\n');
    output.textContent += formattedData;
}

/**
 * データ追加関数
 * @param {string} storageKey - localStorageのキー
 * @param {Function} displayRecordsFunc - 記録表示関数
 * @param {Function} displayStoredDataFunc - 保存データ表示関数
 * @param {boolean} hasDate - 日付フィールドがあるか
 */
function addData(storageKey, displayRecordsFunc, displayStoredDataFunc, hasDate = true) {
    if (!window.parsedData) {
        alert('データが読み込まれていません。');
        return;
    }

    alert(window.parsedData.map(item => {
        if (hasDate && item.date) {
            return `${item.id}, 城名: ${item.name}, 日付: ${item.date}`;
        }
        return `${item.id}, 城名: ${item.name}`;
    }).join('\n'));
    alert("データが追加されました。");

    const storedData = JSON.parse(localStorage.getItem(storageKey)) || [];

    window.parsedData.forEach(item => {
        if (!storedData.some(existingItem => existingItem.castleName === item.name)) {
            const newItem = { castleId: item.id, castleName: item.name };
            if (hasDate && item.date) {
                newItem.date = item.date;
            }
            storedData.push(newItem);
        }
    });

    localStorage.setItem(storageKey, JSON.stringify(storedData));

    if (displayRecordsFunc) displayRecordsFunc();
    if (displayStoredDataFunc) displayStoredDataFunc();
    location.reload();
}

/**
 * リセット関数
 * @param {string} storageKey - localStorageのキー
 * @param {Function} loadCSVFunc - CSV読み込み関数
 * @param {Function} displayStoredDataFunc - 保存データ表示関数
 * @param {Function} displayRecordsFunc - 記録表示関数
 */
function reset(storageKey, loadCSVFunc, displayStoredDataFunc, displayRecordsFunc) {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem(storageKey);
        alert('データがリセットされました。');
    }
    if (window.markers) {
        window.markers = [];
    }
    if (loadCSVFunc) loadCSVFunc();
    kakusu();
    if (displayStoredDataFunc) displayStoredDataFunc();
    if (displayRecordsFunc) displayRecordsFunc();
}

/**
 * CSV形式のデータを配列に変換する関数
 * @param {string} csv - CSV文字列
 * @param {Function} onParse - 各行のパース後に呼ばれるコールバック（オプション）
 */
function parseCSV(csv, onParse = null) {
    const lines = csv.split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            const name = parts[1];
            const latitude = parseFloat(parts[2]);
            const longitude = parseFloat(parts[3]);
            const item = { name, location: [latitude, longitude] };
            if (onParse) {
                onParse(item, parts[0]);
            }
            data.push(item);
        }
    }

    return data;
}

/**
 * CSVファイル読み込み関数
 * @param {string} csvFileName - CSVファイル名
 * @param {Function} initMapFunc - 地図初期化関数
 * @param {Function} onLoad - 読み込み後のコールバック（オプション）
 */
function loadCSV(csvFileName, initMapFunc, onLoad = null) {
    fetch(csvFileName)
        .then(response => response.text())
        .then(csvData => {
            const castleLocations = parseCSV(csvData);
            if (initMapFunc) initMapFunc(castleLocations);
            if (onLoad) onLoad(csvData, castleLocations);
        })
        .catch(error => console.error('ファイルの読み込みエラー:', error));
}

/**
 * 地図初期化関数
 * @param {Array} castleLocations - 城の位置情報配列
 * @param {string} storageKey - localStorageのキー
 * @param {string} defaultIconUrl - デフォルトアイコンURL
 * @param {string} visitedIconUrl - 訪問済みアイコンURL
 */function initMap(castleLocations, storageKey, defaultIconUrl = 'img/siro.png', visitedIconUrl = 'img/hono.png') {
    // 1. 地図オブジェクトの初期化
    if (!window.map) {
        window.map = L.map('map').setView([35.6895, 139.6917], 7);
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);

    // 2. アイコンの定義（変数名を整理）
    const defaultIcon = L.icon({
        iconUrl: defaultIconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    const visitedIcon = L.icon({
        iconUrl: visitedIconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    const storedData = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (!window.markers) {
        window.markers = [];
    }

    // 3. マーカーの追加
    castleLocations.forEach(castle => {
        // 訪問済みかどうかでアイコンを切り替え
        const isVisited = storedData.some(data => data.castleName === castle.name);
        const iconToUse = isVisited ? visitedIcon : defaultIcon;

        // エラー箇所：正しく window.map に対して addTo する
        const marker = L.marker(castle.location, { icon: iconToUse })
            .addTo(window.map)
            .bindPopup(castle.name);

        window.markers.push(marker);
    });
}

/**
 * 現在地を取得して地図の中心に設定する関数
 */
function setCurrentLocation() {
    if (!window.map) return;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            window.map.setView([latitude, longitude], 8);
            const marker = L.marker([latitude, longitude]).addTo(window.map).bindPopup('');
        }, error => {
            console.error('現在地の取得に失敗しました:', error);
        });
    } else {
        console.error('Geolocation API がサポートされていません');
    }
}

/**
 * マーカーの色を変更する関数
 * @param {string} targetCastleName - 対象の城名
 * @param {string} visitedIconUrl - 訪問済みアイコンURL
 */
function markerChangeColor(targetCastleName, visitedIconUrl = 'img/hono.png') {
    if (!window.markers) return;
    const redMarkerIcon = L.icon({
        iconUrl: visitedIconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    window.markers.forEach(marker => {
        if (marker.getPopup().getContent() === targetCastleName) {
            marker.setIcon(redMarkerIcon);
        }
    });
}

/**
 * クリックされた城名の位置に地図を移動する関数
 * @param {string} clickedCastleName - クリックされた城名
 * @param {Array} castleLocations - 城の位置情報配列
 * @param {number} zoomLevel - ズームレベル
 */
function moveToCastleLocation(clickedCastleName, castleLocations, zoomLevel = 7) {
    if (!window.map) return;
    const castle = castleLocations.find(castle => castle.name === clickedCastleName);
    if (castle) {
        window.map.setView(castle.location, zoomLevel);
        const marker = L.marker(castle.location).addTo(window.map).bindPopup(castle.name);
        marker.openPopup();
        setTimeout(() => {
            marker.closePopup();
            window.map.removeLayer(marker);
        }, 3000);
    } else {
        alert(`${clickedCastleName} の位置情報が見つかりませんでした。`);
    }
}

/**
 * 記録表示関数
 * @param {string} storageKey - localStorageのキー
 */
function displayRecords(storageKey) {
    const storedData = JSON.parse(localStorage.getItem(storageKey)) || [];
    const recordList = document.getElementById("recordList");
    if (!recordList) return;
    recordList.innerHTML = "";

    storedData.forEach(record => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = record.castleName;
        recordList.appendChild(checkbox);

        const label = document.createElement("label");
        label.textContent = record.castleName;
        recordList.appendChild(label);

        recordList.appendChild(document.createElement("br"));
    });
}

/**
 * 削除関数
 * @param {string} storageKey - localStorageのキー
 * @param {Function} displayRecordsFunc - 記録表示関数
 * @param {Function} displayStoredDataFunc - 保存データ表示関数
 * @param {Function} getRcordListFunc - 削除リスト表示関数
 * @param {string} defaultIconUrl - デフォルトアイコンURL
 */
function remove(storageKey, displayRecordsFunc, displayStoredDataFunc, getRcordListFunc, defaultIconUrl = 'img/siro.png') {
    const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']:checked"));
    if (checkboxes.length === 0) {
        alert("削除する記録を選択してください。");
        return;
    }

    const confirmation = confirm('選択された記録を削除しますか？');
    if (confirmation) {
        const storedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        const selectedValues = checkboxes.map(checkbox => checkbox.value);
        const updatedData = storedData.filter(record => !selectedValues.includes(record.castleName));
        localStorage.setItem(storageKey, JSON.stringify(updatedData));

        if (window.markers) {
            const castleIcon = L.icon({
                iconUrl: defaultIconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });

            window.markers.forEach(marker => {
                const markerCastleName = marker.getPopup().getContent();
                if (selectedValues.includes(markerCastleName)) {
                    marker.setIcon(castleIcon);
                }
            });
        }

        if (displayRecordsFunc) displayRecordsFunc();
        if (displayStoredDataFunc) displayStoredDataFunc();
        if (getRcordListFunc) getRcordListFunc();

        alert("選択した記録が削除されました。");
    }
}

/**
 * 削除リストを表示する汎用関数
 * @param {string} storageKey - localStorageのキー名
 * @param {string} title - 表示するタイトル
 */
function getRcordList(storageKey, title = "記録") {
    const recordListDiv = document.getElementById("recordList");
    if (!recordListDiv) return;
    recordListDiv.style.display = 'block';
    recordListDiv.innerHTML = "";

    let storedData = JSON.parse(localStorage.getItem(storageKey)) || [];
    storedData.sort((a, b) => Number(a.castleId) - Number(b.castleId));

    let html = `
        <div class="list-header delete-header">
            <h3>削除する記録の選択 (${title})</h3>
            <p>削除したい項目にチェックを入れてください</p>
        </div>
        <div class="castle-grid">`;

    storedData.forEach(record => {
        const uniqueId = `check-${storageKey}-${record.castleId}`;
        html += `
            <div class="castle-item delete-item">
                <input type="checkbox" id="${uniqueId}" value="${record.castleName}" class="delete-checkbox">
                <label for="${uniqueId}" class="delete-label">
                    <span class="id-badge">${record.castleId}</span>
                    <span class="castle-name-text">${record.castleName}</span>
                </label>
            </div>`;
    });

    html += `</div>`;

    if (storedData.length > 0) {
        html += `
            <div class="delete-action-area">
                <button onclick="remove('${storageKey}')" class="btn-execute-delete">
                    選択した記録を削除する
                </button>
            </div>`;
    } else {
        html += `
            <div class="empty-message">
                <p>保存された記録がありません。</p>
            </div>`;
    }

    recordListDiv.innerHTML = html;
    recordListDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * リスト内の castle-link2 に対してイベントリスナーを貼り直す関数
 * @param {Array} castleLocations - 城の位置情報配列
 */
function rebindCastleLinks(castleLocations) {
    const castleLinks = document.querySelectorAll('.castle-link2');
    castleLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const castleName = this.textContent;
            moveToCastleLocation(castleName, castleLocations, 10);

            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth' });
            }

            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById("sidebar");
                if (sidebar) {
                    sidebar.classList.add("hidden");
                    const toggleButton = document.getElementById("toggleButton");
                    if (toggleButton) toggleButton.textContent = "∨";
                }
            }
        });
    });
}

/**
 * サイドバーのトグル機能
 */
function initSidebarToggle() {
    document.addEventListener("DOMContentLoaded", function () {
        const toggleButton = document.getElementById("toggleButton");
        const sidebar = document.getElementById("sidebar");
        const mapzone = document.getElementById("mapzone");
        const content = document.getElementById("content");

        if (toggleButton && sidebar && mapzone && content) {
            toggleButton.addEventListener("click", function () {
                sidebar.classList.toggle("hidden");
                mapzone.classList.toggle("active");
                content.classList.toggle("expanded");

                if (sidebar.classList.contains("hidden")) {
                    toggleButton.textContent = "＞";
                } else {
                    toggleButton.textContent = "＜";
                }
            });
        }
    });
}

// サイドバートグルを初期化
initSidebarToggle();
