const citiesByRegion = {
    "未    選択": ["未選択"],
    "北海道・東北地方": [
        "志苔館",
        "上ノ国勝山館",
        "浪岡城",
        "九戸城",
        "白石城",
        "脇本城",
        "秋田城",
        "鶴ヶ岡城",
        "米沢城",
        "三春城",
        "向羽黒山城"
    ],
    "関東・甲信越地方": [
        "笠間城",
        "土浦城",
        "唐沢山城",
        "名胡桃城",
        "沼田城",
        "岩櫃城",
        "忍城",
        "杉山城",
        "菅谷館",
        "本佐倉城",
        "大多喜城",
        "滝山城",
        "品川台場",
        "小机城",
        "石垣山城",
        "新府城",
        "要害山城",
        "龍岡城",
        "高島城",
        "村上城",
        "高田城",
        "鮫ケ尾城"
    ],
    "北陸・東海地方": [
        "富山城",
        "増山城",
        "鳥越城",
        "福井城",
        "越前大野城",
        "佐柿国吉城",
        "玄蕃尾城",
        "郡上八幡城",
        "苗木城",
        "美濃金山城",
        "大垣城",
        "興国寺城",
        "諏訪原城",
        "高天神城",
        "浜松城",
        "小牧山城",
        "古宮城",
        "吉田城",
        "津城",
        "多気北畠氏城館",
        "田丸城",
        "赤木城"
    ],
    "近畿地方": [
        "鎌刃城",
        "八幡山城",
        "福知山城",
        "芥川山城",
        "飯盛城",
        "岸和田城",
        "出石城・有子山城",
        "黒井城",
        "洲本城",
        "大和郡山城",
        "宇陀松山城",
        "新宮城"
    ],
    "中国・四国地方": [
        "若桜鬼ケ城",
        "米子城",
        "浜田城",
        "備中高松城",
        "三原城",
        "新高山城",
        "大内氏館・高嶺城",
        "勝瑞城",
        "一宮城",
        "引田城",
        "能島城",
        "河後森城",
        "岡豊城"
    ],
    "九州・沖縄地方": [
        "小倉城",
        "水城",
        "久留米城",
        "基肄城",
        "唐津城",
        "金田城",
        "福江城",
        "原城",
        "鞠智城",
        "八代城",
        "中津城",
        "角牟礼城",
        "臼杵城",
        "佐伯城",
        "延岡城",
        "佐土原城",
        "志布志城",
        "知覧城",
        "座喜味城",
        "勝連城"
    ]
};

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const sidebar = document.getElementById("sidebar");
    const mapzone = document.getElementById("mapzone");
    const content = document.getElementById("content");

    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("hidden");
        mapzone.classList.toggle("active");
        content.classList.toggle("expanded");

        // ボタンのテキストを切り替え
        if (sidebar.classList.contains("hidden")) {
            toggleButton.textContent = "＞";  // メニューが隠れているときは右向きの矢印
        } else {
            toggleButton.textContent = "＜";  // メニューが表示されているときは左向きの矢印
        }
    });
});

const castleMap = new Map();
const idMap = new Map();

// 101 ～ 200までのIDを付与する
let currentId = 99;

// 各地方の城名にIDを付与して整理する
for (const region in citiesByRegion) {
    citiesByRegion[region].forEach((castle, index) => {
        currentId++;
        // citiesByRegion[region][index] = `${castle}(${currentId})`;
        castleMap.set(castle, currentId)
        idMap.set(currentId, castle)
    });
}
// console.log(castleMap);
// console.log(idMap);

let selectedDate;
let selectedCastleId;
// ページが読み込まれたときに保存されたデータを表示
displayStoredData();

// 都道府県が変更されたときの処理
document.getElementById("region").addEventListener("change", function () {
    const selectedregion = this.value;
    const citySelect = document.getElementById("catsle");

    // 市町村リストをクリア
    citySelect.innerHTML = "";

    // 選択された都道府県に対応する市町村リストをセレクトメニューに追加
    citiesByRegion[selectedregion].forEach(function (city) {
        const option = document.createElement("option");
        option.textContent = city;
        option.value = city;
        citySelect.appendChild(option);
    });
});


let currentViewDate = new Date(); // 現在表示している月

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("calendarTitle");
    grid.innerHTML = "";

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    title.innerText = `${year}年 ${month + 1}月`;

    // 曜日ヘッダー
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    days.forEach(d => {
        grid.innerHTML += `<div class="calendar-day-head">${d}</div>`;
    });

    // 月の最初の日と最後の日
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // データを取得
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

    // 空白埋め（前月分）
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day"></div>`;
    }

    // 日付を埋める
    for (let date = 1; date <= lastDate; date++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

        // その日に行ったお城を探す
        const events = storedData.filter(item => item.visitDate === dateStr);
        let eventHtml = "";
        events.forEach(e => {
            eventHtml += `<div class="calendar-event" title="${e.castleName}">${e.castleName}</div>`;
        });

        grid.innerHTML += `
            <div class="calendar-day">
                <span class="calendar-day-num">${date}</span>
                ${eventHtml}
            </div>
        `;
    }
}

function changeMonth(diff) {
    currentViewDate.setMonth(currentViewDate.getMonth() + diff);
    renderCalendar();
}

// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", renderCalendar);


function saveData() {
    const selectedCastle = document.getElementById("catsle").value;
    const selectedDate = document.getElementById("selectedDate").value;
    // 入力されているかをチェック
    if (selectedCastle.trim() === '' || selectedDate.trim() === '') {
        // どちらかの入力が空の場合はエラーメッセージを表示するなどの処理を行う
        alert('城名または日付が入力されていません。');
        return;
    }

    // const id = getCatsleID(selectedCastle)
    const id = castleMap.get(selectedCastle);

    console.log("id:", id);
    console.log("name:", selectedCastle);
    console.log("date:", selectedDate);


    // ローカルストレージから既存のデータを取得
    let storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

    // すでに同じ城IDが存在するか確認
    const existingIndex = storedData.findIndex(data => data.castleId === id);

    if (existingIndex !== -1) {
        // すでに存在する場合は確認メッセージを表示
        const confirmOverwrite = confirm("この城名はすでに保存されています。上書きしますか？");

        if (!confirmOverwrite) {
            return; // 上書きしない場合は処理を中止
        }

        // 上書きする場合は既存のデータを削除
        storedData.splice(existingIndex, 1);
    }

    storedData.push({ castleId: id, castleName: selectedCastle, date: selectedDate });

    const selectedCastleLocation = castleLocations.find(castle => castle.name === selectedCastle)?.location;
    if (selectedCastleLocation) {
        // 地図の中心を選択された城の位置に設定
        map.setView(selectedCastleLocation, 9); // 10はズームレベルの例です。適宜調整してください。
    }
    // マーカーの色を赤色に変更
    markerChangeColor(selectedCastle);

    // ローカルストレージに保存
    localStorage.setItem("storedData2", JSON.stringify(storedData));

    displayStoredData();

    console.log("データが保存されました:", storedData);
    displayRecords();

}

function displayStoredData() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

    // IDでソート
    storedData.sort((a, b) => a.castleId - b.castleId);


    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    // 表示エリアをクリア
    savedDataDiv.innerHTML = "";

    // 達成率の計算（100名城の場合）
    const totalCastles = 100;
    const visitedCount = storedData.length;
    const percentage = Math.floor((visitedCount / totalCastles) * 100);

    // 統計エリアのHTMLを作成
    const statsHtml = `
    <div class="stats-container">
        <div class="stats-header">
            <span class="stats-label">現在の登城状況</span>
            <span class="stats-count"><strong>${visitedCount}</strong> / ${totalCastles} 城</span>
        </div>
        <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="stats-footer">
            達成率: ${percentage}% ${percentage === 100 ? '🎉 全制覇！' : ''}
        </div>
    </div>
`;

    savedDataDiv.innerHTML = statsHtml;
    storedData.forEach(function (data) {
        // pタグをdivに変え、class="castle-item" を付与します
        savedDataDiv.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.castleId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.castleName}</a>
                <span class="visit-date">${data.date}</span>
            </div>
        </div>`;
    });
    getAllCastleIds();

}

// castle-link クラスを持つすべての要素にイベントリスナーを追加する
const castleLinks = document.querySelectorAll('.castle-link');
castleLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        // クリックされた城の名前を取得する
        event.preventDefault();

        // 地図コンテナを取得
        const mapContainer = document.getElementById('map');

        // 地図コンテナの位置を取得
        const containerTop = mapContainer.getBoundingClientRect().top;

        // 画面をスクロールして地図コンテナが画面の中央に来るようにする
        // window.scrollTo({
        //     top: containerTop,
        //     behavior: 'smooth' // スムーズなスクロールを有効にする
        // });
        // mapContainer.scrollIntoView({ behavior: "smooth" });

        const castleName = this.textContent;
        console.log('クリックされた城名:', castleName);
        moveToCastleLocation(castleName, 10);
        // ここにクリックされた城名を使用した任意の処理を追加する
    });
});

function displayStoredData2() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

    // 日付でソート
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    // 表示エリアをクリア
    savedDataDiv.innerHTML = "";

    // 達成率の計算（100名城の場合）
    const totalCastles = 100;
    const visitedCount = storedData.length;
    const percentage = Math.floor((visitedCount / totalCastles) * 100);

    // 統計エリアのHTMLを作成
    const statsHtml = `
    <div class="stats-container">
        <div class="stats-header">
            <span class="stats-label">現在の登城状況</span>
            <span class="stats-count"><strong>${visitedCount}</strong> / ${totalCastles} 城</span>
        </div>
        <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="stats-footer">
            達成率: ${percentage}% ${percentage === 100 ? '🎉 全制覇！' : ''}
        </div>
    </div>
`;

    savedDataDiv.innerHTML = statsHtml;


    storedData.forEach(function (data) {
        // pタグをdivに変え、class="castle-item" を付与します
        savedDataDiv.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.castleId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.castleName}</a>
                <span class="visit-date">${data.date}</span>
            </div>
        </div>`;
    });
    getAllCastleIds();
}

// クリックされた城名の位置に地図を移動する関数
function moveToCastleLocation(clickedCastleName) {
    // castleLocationsから対応する城の位置情報を取得
    console.log(clickedCastleName);
    const castle = castleLocations.find(castle => castle.name === clickedCastleName);
    if (castle) {

        map.setView(castle.location); // 地図の中心をクリックされた城の位置に移動
        // マーカーを作成して地図に追加し、ポップアップをバインド
        const marker = L.marker(castle.location).addTo(map).bindPopup(castle.name);
        marker.openPopup();

        // 3秒後にポップアップを閉じる
        setTimeout(() => {
            marker.closePopup();
            map.removeLayer(marker);

        }, 3000);
    } else {
        alert(`${clickedCastleName} の位置情報が見つかりませんでした。`);
    }
}

// CSV形式に変換する関数
function convertToCSV(dataArray) {
    const csvArray = [];
    // ヘッダーを追加
    csvArray.push(['城ID', '城名', '日付']);
    // データを追加
    dataArray.forEach(function (data) {
        csvArray.push([data.castleId, data.castleName, data.date]);
    });
    // CSV形式の文字列に変換して返す
    return csvArray.map(row => row.join(',')).join('\n');
}

function outputCSV() {
    const confirmation = confirm('csv形式でデータを出力しますか');
    if (confirmation) {


        // ローカルストレージからデータを取得
        const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

        // データをCSV形式に変換
        const csvData = convertToCSV(storedData);

        // CSVデータをUTF-8形式で保存
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'zoku100catsle.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getAllCastleIds() {
    // ローカルストレージからデータを取得（続100名城用のstoredData2）
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];
    const castleIds = storedData.map(data => Number(data.castleId));

    // 101から200までの数字を生成
    const allNumbers = Array.from({ length: 100 }, (_, index) => index + 101);

    // 未登録のIDを取得
    const unregisteredNumbers = allNumbers.filter(number => !castleIds.includes(number));

    const nameListDiv = document.getElementById("nameList");

    // HTMLの組み立て開始
    let html = `
        <div class="list-header">
            <h3>続・訪れていないお城一覧</h3>
            <p class="remaining-count">残り <span>${unregisteredNumbers.length}</span> 城</p>
        </div>
        <div class="castle-grid">`; // CSS Grid用のコンテナ

    unregisteredNumbers.forEach(number => {
        const name = idMap.get(number);
        if (name) {
            html += `
                <div class="castle-item unvisited">
                    <span class="id-badge">${number}</span>
                    <a href="#" class="castle-link2">${name}</a>
                </div>`;
        }
    });

    html += `</div>`;
    nameListDiv.innerHTML = html;

    // イベントリスナーの設定
    const castleLinks2 = document.querySelectorAll('.castle-link2');
    castleLinks2.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const castleName = this.textContent;
            console.log('クリックされた城名:', castleName);

            moveToCastleLocation(castleName, 10);

            // 地図までスムーズにスクロール（スマホ・PC共通で便利）
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

function kakusu() {
    const nameListDiv = document.getElementById("nameList");
    nameListDiv.innerHTML = null;
}

function kakusu2() {
    const nameListDiv = document.getElementById("savedData");
    nameListDiv.innerHTML = null;
}

function kakusu3() {
    const nameListDiv = document.getElementById("recordList");
    document.getElementById('recordList').style.display = 'none';
    nameListDiv.innerHTML = null;
}
function getRcordList() {
    const recordListDiv = document.getElementById("recordList");
    recordListDiv.style.display = 'block';
    recordListDiv.innerHTML = "";

    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

    let html = `
        <div class="list-header delete-header">
            <h3>削除する記録の選択</h3>
            <p>削除したいお城にチェックを入れてください</p>
        </div>
        <div class="castle-grid">`;

    storedData.forEach(record => {
        html += `
            <div class="castle-item delete-item">
                <input type="checkbox" id="check-zoku-${record.castleId}" value="${record.castleName}" class="delete-checkbox">
                <label for="check-zoku-${record.castleId}" class="delete-label">
                    <span class="id-badge">${record.castleId}</span>
                    ${record.castleName}
                </label>
            </div>`;
    });

    html += `</div>`;

    // --- ここで削除ボタンを動的に追加 ---
    if (storedData.length > 0) {
        html += `
            <div class="delete-action-area">
                <button onclick="remove()" class="btn-execute-delete">
                    選択した記録を削除する
                </button>
            </div>`;
    } else {
        html += `<p style="text-align:center; padding:20px;">記録がありません。</p>`;
    }

    recordListDiv.innerHTML = html;
}

function reset() {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem("storedData2"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    kakusu();
    displayStoredData();
    displayRecords();
}

// 指定したCSVファイル名
const csvFileName = 'data/zoku.csv';
castleLocations = [];

// ファイル読み込み処理を実行する関数
function loadCSV() {
    fetch(csvFileName) // 指定したファイル名でファイルを取得
        .then(response => response.text()) // テキストデータとして取得
        .then(csvData => {
            castleLocations = parseCSV(csvData); // CSVデータを解析して配列に変換
            // console.log(castleLocations); // データが正しく変換されていることを確認
            initMap(castleLocations); // 地図を初期化する関数を呼び出す

        })
        .catch(error => console.error('ファイルの読み込みエラー:', error));
}

// CSV形式のデータを配列に変換する関数
function parseCSV(csv) {
    const lines = csv.split('\n'); // 改行で分割して各行を取得
    const data = []; // データを格納する配列

    // 各行を処理してデータを取得
    for (let i = 1; i < lines.length; i++) { // 最初の行はヘッダーなのでスキップする
        const line = lines[i].trim(); // 前後の空白を削除
        if (line) { // 空行でない場合のみ処理する
            const parts = line.split(','); // カンマで区切って各要素を取得
            const name = parts[1]; // 名称を取得
            const latitude = parseFloat(parts[2]); // 北緯を数値に変換
            const longitude = parseFloat(parts[3]); // 東経を数値に変換
            data.push({ name, location: [latitude, longitude] }); // データを配列に追加
        }
    }

    return data;
}

parsedData = []

function inputCSV() {
    const fileInput = document.getElementById('csvInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('CSVファイルを選択してください。');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const csvContent = event.target.result;
        parsedData = parseInputCSV(csvContent);
        displayData(parsedData);
    };
    reader.onerror = function () {
        alert('ファイルを読み込む際にエラーが発生しました。');
    };
    reader.readAsText(file, 'UTF-8');
    // ファイルが選ばれた後にボタンを表示
    document.getElementById('loadButton').style.display = 'inline';
}

function parseInputCSV(data) {
    const rows = data.split('\n');
    // ヘッダーをスキップして、データ部分のみ処理
    return rows.slice(1).map(row => {
        const cells = row.split(',').map(cell => cell.trim());
        // 空行を除外
        if (cells.length < 2 || cells.every(cell => cell === "")) {
            return null; // 空行は無視
        }
        console.log(cells);
        return {
            id: cells[0], // 城ID
            name: cells[1], // 城名
            date: cells[2] // 日付
        };
    }).filter(item => item !== null); // 空行を除外した結果だけを残す
}


function displayData(data) {
    const output = document.getElementById('output');
    output.textContent = "読み込んだデータ\n"
    // カスタムフォーマットで出力
    const formattedData = data.map(item => `${item.id}, 城名: ${item.name}, 日付: ${item.date}`).join('\n');
    output.textContent += formattedData;
}

function addData() {
    // 追加データを表示する処理
    alert(parsedData.map(item => `${item.id}, 城名: ${item.name}, 日付: ${item.date}`).join('\n'));
    alert("データが追加されました。");

    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

    // 新しいデータを追加（重複しないデータのみ）
    parsedData.forEach(item => {
        // IDがすでにstoredDataに存在しない場合のみ追加
        if (!storedData.some(existingItem => existingItem.castleName === item.name)) {
            console.log("追加するデータ");
            console.log(item.id);
            console.log(item.name);
            console.log(item.date);
            // storedData.push(item);
            storedData.push({ castleId: item.id, castleName: item.name, date: item.date });

        }
    });

    // 新しいデータを再びローカルストレージに保存
    localStorage.setItem("storedData2", JSON.stringify(storedData));

    displayRecords(); // 更新後の記録を再表示
    displayStoredData();
    // ページをリロードする
    location.reload();

}


// ページ読み込み時にファイルを読み込む
window.onload = function () {
    loadCSV();
    displayRecords();
};


// マーカーを格納する配列
markers = [];

const map = L.map('map').setView([35.6895, 139.6917], 7); // 初期表示は東京を中心に設定

function initMap(castleLocations) {
    // 地図を表示するためのオプションを設定

    // 地図タイルレイヤーを追加(OpenStreetMapを使用)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const catsleIcon = L.icon({
        iconUrl: 'img/siro.png', // 赤いアイコンのURL
        iconSize: [25, 41], // アイコンのサイズ
        iconAnchor: [12, 41], // アイコンのアンカーポイント
        popupAnchor: [1, -34] // ポップアップのアンカーポイント
    });

    const redMarkerIcon = L.icon({
        iconUrl: 'img/hono.png', // 赤いアイコンのURL
        iconSize: [25, 41], // アイコンのサイズ
        iconAnchor: [12, 41], // アイコンのアンカーポイント
        popupAnchor: [1, -34] // ポップアップのアンカーポイント
    });

    // ローカルストレージから城名のリストを取得
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

    // 城のマーカーを地図上に表示
    castleLocations.forEach(castle => {
        // const marker = L.marker(castle.location).addTo(map).bindPopup(castle.name); // マーカーにポップアップを追加して城名を表示
        // marker.setIcon(catsleIcon);

        // 城名に応じて適切なアイコンを選択
        const castleIcon = storedData.some(data => data.castleName === castle.name) ? redMarkerIcon : catsleIcon;
        // マーカーを作成して地図に追加
        const marker = L.marker(castle.location, { icon: castleIcon }).addTo(map).bindPopup(castle.name);
        markers.push(marker);
    });
}

function markerChangeColor(targetCastleName) {
    // 赤いマーカーアイコン
    const redMarkerIcon = L.icon({
        iconUrl: 'img/hono.png', // 赤いアイコンのURL
        iconSize: [25, 41], // アイコンのサイズ
        iconAnchor: [12, 41], // アイコンのアンカーポイント
        popupAnchor: [1, -34] // ポップアップのアンカーポイント
    });
    // console.log(targetCastleName);
    // console.log(markers);
    markers.forEach(marker => {
        if (marker.getPopup().getContent() === targetCastleName) {
            marker.setIcon(redMarkerIcon);
        }
    });
}


// 現在地を取得して地図の中心に設定する関数
function setCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 8); // 現在地を中心にしてズームレベルを15に設定
            const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(castle.name);

        }, error => {
            console.error('現在地の取得に失敗しました:', error);
        });
    } else {
        console.error('Geolocation API がサポートされていません');
    }
}
// ページ読み込み時に現在地を取得して地図の中心に設定
setCurrentLocation();


// ローカルストレージから記録を取得し、チェックボックスリストを表示する関数
function displayRecords() {
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];
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

function remove() {
    const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']:checked")); // 配列に変換
    if (checkboxes.length === 0) {
        alert("削除する記録を選択してください。");
        return;
    }

    const confirmation = confirm('選択された記録を削除しますか？');
    if (confirmation) {
        // ローカルストレージから既存データを取得
        const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

        // チェックボックスで選択された城名を取得
        const selectedValues = checkboxes.map(checkbox => checkbox.value);

        // 選択された城名を除外して新しいデータを作成
        const updatedData = storedData.filter(record => !selectedValues.includes(record.castleName));

        // ローカルストレージを更新
        localStorage.setItem("storedData2", JSON.stringify(updatedData));

        // マーカーの色を更新
        const castleIcon = L.icon({
            iconUrl: 'img/siro.png', // 赤いアイコンのURL
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        markers.forEach(marker => {
            const markerCastleName = marker.getPopup().getContent();
            if (selectedValues.includes(markerCastleName)) {
                marker.setIcon(castleIcon);
            }
        });

        // UIを更新
        displayRecords();
        displayStoredData();

        alert("選択した記録が削除されました。");
    }
}


function getCatsleName(castelID) {
    switch (castelID) {
        case "101": return "志苔館";
        case "102": return "上ノ国勝山館";
        case "103": return "浪岡城";
        case "104": return "九戸城";
        case "105": return "白石城";
        case "106": return "脇本城";
        case "107": return "秋田城";
        case "108": return "鶴ヶ岡城";
        case "109": return "米沢城";
        case "110": return "三春城";
        case "111": return "向羽黒山城";
        case "112": return "笠間城";
        case "113": return "土浦城";
        case "114": return "唐沢山城";
        case "115": return "名胡桃城";
        case "116": return "沼田城";
        case "117": return "岩櫃城";
        case "118": return "忍城";
        case "119": return "杉山城";
        case "120": return "菅谷館";
        case "121": return "本佐倉城";
        case "122": return "大多喜城";
        case "123": return "滝山城";
        case "124": return "品川台場";
        case "125": return "小机城";
        case "126": return "石垣山城";
        case "127": return "新府城";
        case "128": return "要害山城";
        case "129": return "龍岡城";
        case "130": return "高島城";
        case "131": return "村上城";
        case "132": return "高田城";
        case "133": return "鮫ケ尾城";
        case "134": return "富山城";
        case "135": return "増山城";
        case "136": return "鳥越城";
        case "137": return "福井城";
        case "138": return "越前大野城";
        case "139": return "佐柿国吉城";
        case "140": return "玄蕃尾城";
        case "141": return "郡上八幡城";
        case "142": return "苗木城";
        case "143": return "美濃金山城";
        case "144": return "大垣城";
        case "145": return "興国寺城";
        case "146": return "諏訪原城";
        case "147": return "高天神城";
        case "148": return "浜松城";
        case "149": return "小牧山城";
        case "150": return "古宮城";
        case "151": return "吉田城";
        case "152": return "津城";
        case "153": return "多気北畠氏城館";
        case "154": return "田丸城";
        case "155": return "赤木城";
        case "156": return "鎌刃城";
        case "157": return "八幡山城";
        case "158": return "福知山城";
        case "159": return "芥川山城";
        case "160": return "飯盛城";
        case "161": return "岸和田城";
        case "162": return "出石城・有子山城";
        case "163": return "黒井城";
        case "164": return "洲本城";
        case "165": return "大和郡山城";
        case "166": return "宇陀松山城";
        case "167": return "新宮城";
        case "168": return "若桜鬼ケ城";
        case "169": return "米子城";
        case "170": return "浜田城";
        case "171": return "備中高松城";
        case "172": return "三原城";
        case "173": return "新高山城";
        case "174": return "大内氏館・高嶺城";
        case "175": return "勝瑞城";
        case "176": return "一宮城";
        case "177": return "引田城";
        case "178": return "能島城";
        case "179": return "河後森城";
        case "180": return "岡豊城";
        case "181": return "小倉城";
        case "182": return "水城";
        case "183": return "久留米城";
        case "184": return "基肄城";
        case "185": return "唐津城";
        case "186": return "金田城";
        case "187": return "福江城";
        case "188": return "原城";
        case "189": return "鞠智城";
        case "190": return "八代城";
        case "191": return "中津城";
        case "192": return "角牟礼城";
        case "193": return "臼杵城";
        case "194": return "佐伯城";
        case "195": return "延岡城";
        case "196": return "佐土原城";
        case "197": return "志布志城";
        case "198": return "知覧城";
        case "199": return "座喜味城";
        case "200": return "勝連城";
        default: return "不明な城";
    }
}


function getCatsleID(selectedCastleValue) {
    switch (selectedCastleValue) {
        case "志苔館": return "101";
        case "上ノ国勝山館": return "102";
        case "浪岡城": return "103";
        case "九戸城": return "104";
        case "白石城": return "105";
        case "脇本城": return "106";
        case "秋田城": return "107";
        case "鶴ヶ岡城": return "108";
        case "米沢城": return "109";
        case "三春城": return "110";
        case "向羽黒山城": return "111";
        case "笠間城": return "112";
        case "土浦城": return "113";
        case "唐沢山城": return "114";
        case "名胡桃城": return "115";
        case "沼田城": return "116";
        case "岩櫃城": return "117";
        case "忍城": return "118";
        case "杉山城": return "119";
        case "菅谷館": return "120";
        case "本佐倉城": return "121";
        case "大多喜城": return "122";
        case "滝山城": return "123";
        case "品川台場": return "124";
        case "小机城": return "125";
        case "石垣山城": return "126";
        case "新府城": return "127";
        case "要害山城": return "128";
        case "龍岡城": return "129";
        case "高島城": return "130";
        case "村上城": return "131";
        case "高田城": return "132";
        case "鮫ケ尾城": return "133";
        case "富山城": return "134";
        case "増山城": return "135";
        case "鳥越城": return "136";
        case "福井城": return "137";
        case "越前大野城": return "138";
        case "佐柿国吉城": return "139";
        case "玄蕃尾城": return "140";
        case "郡上八幡城": return "141";
        case "苗木城": return "142";
        case "美濃金山城": return "143";
        case "大垣城": return "144";
        case "興国寺城": return "145";
        case "諏訪原城": return "146";
        case "高天神城": return "147";
        case "浜松城": return "148";
        case "小牧山城": return "149";
        case "古宮城": return "150";
        case "吉田城": return "151";
        case "津城": return "152";
        case "多気北畠氏城館": return "153";
        case "田丸城": return "154";
        case "赤木城": return "155";
        case "鎌刃城": return "156";
        case "八幡山城": return "157";
        case "福知山城": return "158";
        case "芥川山城": return "159";
        case "飯盛城": return "160";
        case "岸和田城": return "161";
        case "出石城・有子山城": return "162";
        case "黒井城": return "163";
        case "洲本城": return "164";
        case "大和郡山城": return "165";
        case "宇陀松山城": return "166";
        case "新宮城": return "167";
        case "若桜鬼ケ城": return "168";
        case "米子城": return "169";
        case "浜田城": return "170";
        case "備中高松城": return "171";
        case "三原城": return "172";
        case "新高山城": return "173";
        case "大内氏館・高嶺城": return "174";
        case "勝瑞城": return "175";
        case "一宮城": return "176";
        case "引田城": return "177";
        case "能島城": return "178";
        case "河後森城": return "179";
        case "岡豊城": return "180";
        case "小倉城": return "181";
        case "水城": return "182";
        case "久留米城": return "183";
        case "基肄城": return "184";
        case "唐津城": return "185";
        case "金田城": return "186";
        case "福江城": return "187";
        case "原城": return "188";
        case "鞠智城": return "189";
        case "八代城": return "190";
        case "中津城": return "191";
        case "角牟礼城": return "192";
        case "臼杵城": return "193";
        case "佐伯城": return "194";
        case "延岡城": return "195";
        case "佐土原城": return "196";
        case "志布志城": return "197";
        case "知覧城": return "198";
        case "座喜味城": return "199";
        case "勝連城": return "200";
        default: return "不明な城ID";
    }
}