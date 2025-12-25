const citiesByRegion = {
    "未選択": ["未選択"],
    "北海道・東北": ["根室チャシ跡群", "五稜郭", "松前城", "弘前城", "根城", "久保田城", "盛岡城", "多賀城", "仙台城", "山形城", "二本松城", "会津若松城", "白河小峰城"],
    "関東": ["足利氏館(鑁阿寺)", "水戸城", "金山城", "箕輪城", "川越城", "鉢形城", "佐倉城", "江戸城", "八王子城", "小田原城"],
    "甲信越・北陸": ["新発田城", "春日山城", "甲府城", "武田氏館(武田神社)", "松代城", "高遠城", "上田城", "小諸城", "松本城", "高岡城", "七尾城", "金沢城", "丸岡城", "一乗谷城"],
    "東海・近畿": ["山中城", "駿府城", "掛川城", "岩村城", "岐阜城", "名古屋城", "長篠城", "犬山城", "岡崎城", "伊賀上野城", "松阪城", "安土城", "観音寺城", "小谷城", "彦根城", "二条城", "大阪城", "千早城", "明石城", "姫路城", "赤穂城", "竹田城", "篠山城", "高取城", "和歌山城"],
    "中国・四国": ["松江城", "月山富田城", "津和野城", "鳥取城", "津山城", "鬼ノ城", "岡山城", "備中松山城", "福山城", "郡山城", "広島城", "高松城", "丸亀城", "萩城", "岩国城", "徳島城", "今治城", "松山城", "宇和島城", "湯築城", "大洲城", "高知城"],
    "九州・沖縄": ["福岡城", "大野城", "吉野ヶ里", "佐賀城", "名護屋城", "平戸城", "島原城", "大分府内城", "岡城", "熊本城", "人吉城", "飫肥城", "鹿児島城", "首里城", "今帰仁城", "中城城"],
    "国宝5名城": ["松本城", "彦根城", "姫路城", "松江城", "犬山城"],
    "現存12天守": ["松本城", "彦根城", "姫路城", "松江城", "犬山城", "弘前城", "丸岡城", "丸亀城", "高知城", "松山城", "備中松山城", "宇和島城"],
};

const castleMasterList = {
    "1": "根室チャシ跡群", "2": "五稜郭", "3": "松前城", "4": "弘前城", "5": "根城",
    "6": "盛岡城", "7": "多賀城", "8": "仙台城", "9": "久保田城", "10": "山形城",
    "11": "二本松城", "12": "会津若松城", "13": "白河小峰城", "14": "水戸城", "15": "足利氏館(鑁阿寺)",
    "16": "箕輪城", "17": "金山城", "18": "鉢形城", "19": "川越城", "20": "佐倉城",
    "21": "江戸城", "22": "八王子城", "23": "小田原城", "24": "武田氏館(武田神社)", "25": "甲府城",
    "26": "松代城", "27": "上田城", "28": "小諸城", "29": "松本城", "30": "高遠城",
    "31": "新発田城", "32": "春日山城", "33": "高岡城", "34": "七尾城", "35": "金沢城",
    "36": "丸岡城", "37": "一乗谷城", "38": "岩村城", "39": "岐阜城", "40": "山中城",
    "41": "駿府城", "42": "掛川城", "43": "犬山城", "44": "名古屋城", "45": "岡崎城",
    "46": "長篠城", "47": "伊賀上野城", "48": "松阪城", "49": "小谷城", "50": "彦根城",
    "51": "安土城", "52": "観音寺城", "53": "二条城", "54": "大阪城", "55": "千早城",
    "56": "竹田城", "57": "篠山城", "58": "明石城", "59": "姫路城", "60": "赤穂城",
    "61": "高取城", "62": "和歌山城", "63": "鳥取城", "64": "松江城", "65": "月山富田城",
    "66": "津和野城", "67": "津山城", "68": "備中松山城", "69": "鬼ノ城", "70": "岡山城",
    "71": "福山城", "72": "郡山城", "73": "広島城", "74": "岩国城", "75": "萩城",
    "76": "徳島城", "77": "高松城", "78": "丸亀城", "79": "今治城", "80": "湯築城",
    "81": "松山城", "82": "大洲城", "83": "宇和島城", "84": "高知城", "85": "福岡城",
    "86": "大野城", "87": "名護屋城", "88": "吉野ヶ里", "89": "佐賀城", "90": "平戸城",
    "91": "島原城", "92": "熊本城", "93": "人吉城", "94": "大分府内城", "95": "岡城",
    "96": "飫肥城", "97": "鹿児島城", "98": "今帰仁城", "99": "中城城", "100": "首里城"
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

function saveData() {
    const selectedCastle = document.getElementById("catsle").value;
    const selectedDate = document.getElementById("selectedDate").value;
    // 入力されているかをチェック
    if (selectedCastle.trim() === '' || selectedDate.trim() === '') {
        // どちらかの入力が空の場合はエラーメッセージを表示するなどの処理を行う
        alert('城名または日付が入力されていません。');
        return;
    }

    const id = getCatsleID(selectedCastle)
    console.log("id:", id);
    console.log("name:", selectedCastle);
    console.log("date:", selectedDate);


    // ローカルストレージから既存のデータを取得
    let storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

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

    // ローカルストレージに保存
    localStorage.setItem("storedData1", JSON.stringify(storedData));

    // 選択された城名に対応する緯度経度を取得
    // const castleLocations = parseCSV(csvData);
    const selectedCastleLocation = castleLocations.find(castle => castle.name === selectedCastle)?.location;
    if (selectedCastleLocation) {
        // 地図の中心を選択された城の位置に設定
        map.setView(selectedCastleLocation, 9); // 10はズームレベルの例です。適宜調整してください。
    }

    // マーカーの色を赤色に変更
    markerChangeColor(selectedCastle);

    displayStoredData();

    alert("データが保存されました");
    console.log("データが保存されました:", storedData);
    displayRecords();
}

function displayStoredData() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

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
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

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
        const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

        // データをCSV形式に変換
        const csvData = convertToCSV(storedData);

        // CSVデータをUTF-8形式で保存
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '100catsle.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getAllCastleIds() {
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];
    const castleIds = storedData.map(data => data.castleId);
    const allNumbers = Array.from({ length: 100 }, (_, index) => index + 1);
    const unregisteredNumbers = allNumbers.filter(number => !castleIds.includes(number.toString()));

    const nameListDiv = document.getElementById("nameList");

    // ヘッダー部分（残り件数など）
    let html = `
        <div class="list-header">
            <h3>訪れていないお城一覧</h3>
            <p class="remaining-count">残り <span>${unregisteredNumbers.length}</span> 城</p>
        </div>
        <div class="castle-grid">`; // グリッド用のコンテナを開始

    unregisteredNumbers.forEach(number => {
        const name = getCatsleName(String(number));
        // カード形式で作成
        html += `
            <div class="castle-item unvisited">
                <span class="id-badge">${number}</span>
                <a href="#" class="castle-link2">${name}</a>
            </div>`;
    });

    html += `</div>`; // グリッド用のコンテナを閉じる
    nameListDiv.innerHTML = html;

    // イベントリスナーの部分（既存のロジックを維持）
    const castleLinks = document.querySelectorAll('.castle-link2');
    castleLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const castleName = this.textContent;
            moveToCastleLocation(castleName, 10);

            // 地図までスムーズにスクロールさせる（スマホで便利）
            document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// クリックされた城名の位置に地図を移動する関数
function moveToCastleLocation(clickedCastleName) {
    // castleLocationsから対応する城の位置情報を取得
    console.log(clickedCastleName);
    const castle = castleLocations.find(castle => castle.name === clickedCastleName);
    if (castle) {

        map.setView(castle.location, 7); // 地図の中心をクリックされた城の位置に移動
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

/**
 * 削除リストを表示する汎用関数
 * @param {string} storageKey - localStorageのキー名
 * @param {string} title - 表示するタイトルの接頭辞
 */
function getRcordList(storageKey = "storedData1", title = "日本100名城") {
    const recordListDiv = document.getElementById("recordList");
    recordListDiv.style.display = 'block';
    recordListDiv.innerHTML = "";

    // 指定されたストレージからデータを取得
    let storedData = JSON.parse(localStorage.getItem(storageKey)) || [];

    // --- ID順（昇順）に並べ替え ---
    storedData.sort((a, b) => Number(a.castleId) - Number(b.castleId));

    // ヘッダーの組み立て
    let html = `
        <div class="list-header delete-header">
            <h3>削除する記録の選択 (${title})</h3>
            <p>削除したい項目にチェックを入れてください</p>
        </div>
        <div class="castle-grid">`;

    storedData.forEach(record => {
        // IDの重複を避けるため storageKey を含めたユニークなIDを作成
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

    // 削除ボタンエリア
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

    // リストへスクロール（表示されたことがわかりやすい）
    recordListDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function reset() {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem("storedData1"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    kakusu();
    displayStoredData();
    displayRecords();

}


// 指定したCSVファイル名
const csvFileName = 'data/siro.csv';
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

    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

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
    localStorage.setItem("storedData1", JSON.stringify(storedData));

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
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];
    console.log(storedData);

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

// ローカルストレージから記録を取得し、チェックボックスリストを表示する関数
function displayRecords() {
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];
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
        const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

        // チェックボックスで選択された城名を取得
        const selectedValues = checkboxes.map(checkbox => checkbox.value);

        // 選択された城名を除外して新しいデータを作成
        const updatedData = storedData.filter(record => !selectedValues.includes(record.castleName));

        // ローカルストレージを更新
        localStorage.setItem("storedData1", JSON.stringify(updatedData));

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

function getCatsleName(castleID) {
    return castleMasterList[castleID] || "不明な城";
}

function getCatsleID(selectedCastleValue) {
    return Object.keys(castleMasterList).find(key => castleMasterList[key] === selectedCastleValue);
}