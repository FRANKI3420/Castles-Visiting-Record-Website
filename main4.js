
document.addEventListener("DOMContentLoaded", function () {
    // 1. UI制御の初期化
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

    // 2. イベントの設定
    const regionSelect = document.getElementById("region");
    if (regionSelect) {
        regionSelect.addEventListener("change", updateCastlePicker);
    }

    // 3. 初期データの読み込みと表示
    loadCSV(); // これにより allNumbers 等がセットされる
    displayStoredData();
    displayRecords();
});

function updateCastlePicker() {
    const regionSelect = document.getElementById("region");
    const citySelect = document.getElementById("catsle");
    const selectedcsv = "data/" + regionSelect.value;

    // 1. 保存済みデータを取得（除外用）
    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];
    const visitedNames = storedData.map(data => data.castleName.trim());

    citySelect.innerHTML = '<option value="">読み込み中...</option>';

    fetch(selectedcsv)
        .then(response => response.text())
        .then(csvData => {
            const castleLocations2 = parseCSV2(csvData); // CSV解析（※注：この関数内でoption追加をしないよう修正が必要）

            citySelect.innerHTML = '<option value="">未選択</option>';

            let count = 0;
            castleLocations2.forEach(castle => {
                const cName = castle.name.trim();

                // 💡 訪問済みリストに含まれていない場合のみ追加
                if (!visitedNames.includes(cName)) {
                    const option = document.createElement("option");
                    option.textContent = castle.name;
                    option.value = castle.name;
                    citySelect.appendChild(option);
                    count++;
                }
            });

            // 全て訪問済みだった場合
            if (count === 0 && castleLocations2.length > 0) {
                const option = document.createElement("option");
                option.textContent = "すべて訪問済みです！🎉";
                option.disabled = true;
                citySelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('読み込みエラー:', error);
            citySelect.innerHTML = '<option value="">エラー発生</option>';
        });
}

// --- イベントの設定 ---

document.addEventListener("DOMContentLoaded", function () {
    const regionSelect = document.getElementById("region");

    // 💡 変更イベントに紐付け
    regionSelect.addEventListener("change", updateCastlePicker);

    // 💡 初期表示時にも実行（これで最初から除外される）
    updateCastlePicker();

    // 他の初期化処理
    if (typeof displayStoredData === "function") displayStoredData();
});

/**
 * 未訪問リストの表示/非表示を切り替える
 */
function toggleUnvisitedList() {
    const nameListDiv = document.getElementById("nameList");
    const btn = document.getElementById("btn-toggle-unvisited");

    // 中身が空（非表示状態）なら表示する
    if (nameListDiv.innerHTML === "") {
        getAllCastleIds(); // 既存の表示関数を呼び出す
        btn.textContent = "未取得のお城カードを隠す";
        btn.classList.add("active"); // 必要ならスタイル変更用
    } else {
        kakusu(); // 既存の非表示関数を呼び出す
        btn.textContent = "未取得のお城カードを表示";
        btn.classList.remove("active");
    }
}

/**
 * 削除リストの表示/非表示を切り替える
 */
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

const castleMap = new Map();
const idMap = new Map();


let selectedDate;
let selectedCastleId;
// ページが読み込まれたときに保存されたデータを表示
displayStoredData();

document.getElementById("region").addEventListener("change", function () {
    const selectedcsv = "data/" + this.value;
    const citySelect = document.getElementById("catsle");

    // 1. まずプルダウンをクリアして「読み込み中」にする
    citySelect.innerHTML = "<option>読み込み中...</option>";

    fetch(selectedcsv)
        .then(response => response.text())
        .then(csvData => {
            const castleLocations2 = parseCSV2(csvData); // CSV解析

            // 2. 地図の更新
            hideMarkers();
            initMap(castleLocations2);

            // 3. 保存済みデータを取得（除外用）
            const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];
            const visitedNames = storedData.map(data => data.castleName); // 名前で比較する場合

            // 4. プルダウンの生成
            citySelect.innerHTML = '<option value="">未選択</option>'; // 初期化

            castleLocations2.forEach(function (castle) {
                // 💡 すでに訪問済みリスト（visitedNames）に入っていない城だけを追加
                if (!visitedNames.includes(castle.name)) {
                    const option = document.createElement("option");
                    option.textContent = castle.name;
                    option.value = castle.name;
                    citySelect.appendChild(option);
                }
            });

            // 全部訪問済みだった場合の処理
            if (citySelect.options.length === 1) {
                const option = document.createElement("option");
                option.textContent = "この弾はすべて訪問済みです！🎉";
                option.disabled = true;
                citySelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('ファイルの読み込みエラー:', error);
            citySelect.innerHTML = "<option>エラーが発生しました</option>";
        });
});

function hideMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker); // マーカーを地図から削除
    });
    markers = [];
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            const name = parts[1];
            const latitude = parseFloat(parts[2]);
            const longitude = parseFloat(parts[3]);
            data.push({ name, location: [latitude, longitude] });

            castleMap.set(name, parts[0]);
            idMap.set(parts[0], name);
        }
    }
    return data;
}

function parseCSV2(csv) {
    const lines = csv.split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            const name = parts[1].trim();
            const latitude = parseFloat(parts[2]);
            const longitude = parseFloat(parts[3]);
            data.push({ name, location: [latitude, longitude] });

            // castleMapへの登録が必要な場合はここで行う
            castleMap.set(name, parts[0]);
        }
    }
    return data;
}


function saveData() {
    const selectedCastle = document.getElementById("catsle").value;

    if (selectedCastle.trim() === '') {
        alert('城名が入力されていません。');
        return;
    }

    const id = castleMap.get(selectedCastle);

    // ローカルストレージから既存のデータを取得
    let storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

    // 重複チェック
    const existingIndex = storedData.findIndex(data => data.castleId === id);
    if (existingIndex !== -1) {
        const confirmOverwrite = confirm("この城名はすでに保存されています。上書きしますか？");
        if (!confirmOverwrite) return;
        storedData.splice(existingIndex, 1);
    }

    storedData.push({
        castleId: id,
        castleName: selectedCastle,
        date: selectedDate || new Date().toISOString().split('T')[0]
    });

    // 地図の移動と色変更
    const castle = castleLocations.find(c => c.name === selectedCastle);
    if (castle) {
        map.setView(castle.location, 9);
        markerChangeColor(selectedCastle);
    }

    // ローカルストレージに保存
    localStorage.setItem("storedData4", JSON.stringify(storedData));

    updateCastlePicker(); // プルダウンから今保存した城を消す
    displayStoredData();  // 取得済みリスト（🏯 取得率など）を更新
    displayRecords();     // 削除用リストなどを更新

    console.log("データが保存されました:", storedData);
}
async function displayStoredData() {
    // 1. ローカルストレージから取得済みデータを取得 (storedData4)
    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];
    storedData.sort((a, b) => a.castleId - b.castleId);
    const cardCount = storedData.length;

    // 2. CSVファイルから全件数を取得
    let totalCount = 0;
    try {
        const response = await fetch('data/catsle_card.csv');
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        // ヘッダー行を除いた行数が全件数
        totalCount = lines.length - 1;
    } catch (error) {
        console.error("CSV読み込みエラー:", error);
        totalCount = 100; // エラー時のフォールバック
    }

    // 3. 取得率の計算
    const completionRate = totalCount > 0 ? Math.round((cardCount / totalCount) * 100) : 0;

    // 4. HTMLの構築
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    const statsHtml = `
    <div class="card-stats-wrapper">
        <div class="card-badge">
            <div class="badge-icon">🏯</div>
            <div class="badge-text">
                <span class="badge-label">CARD COLLECTION</span>
                <span class="badge-number"><strong>${cardCount}</strong> / ${totalCount} <small>枚</small></span>
            </div>
        </div>
        <div class="card-status-msg">
            現在の取得率: <strong>${completionRate}%</strong>
            ${completionRate === 100 ? '<span style="color: #d32f2f; font-weight: bold;"> 🎉 コンプリート！</span>' : ''}
        </div>
    </div>
    `;

    savedDataDiv.innerHTML = statsHtml;

    // 5. 取得済みリストの表示
    storedData.forEach(function (data) {
        savedDataDiv.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.castleId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.castleName}</a>
            </div>
        </div>`;
    });

    // castle-link クラスを持つすべての要素にイベントリスナーを追加する
    const castleLinks = document.querySelectorAll('.castle-link');
    castleLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            // クリックされた城の名前を取得する
            event.preventDefault();

            const castleName = this.textContent;
            console.log('クリックされた城名:', castleName);
            moveToCastleLocation(castleName, 10);
            // スムーズスクロール
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

function displaystoredData4() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

    // 日付でソート
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    storedData.forEach(function (data) {
        savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: <a href="#"  class="castle-link">${data.castleName}</a>, 日付: ${data.date}</p>`;
    });
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
    csvArray.push(['城ID', '城名']);
    // データを追加
    dataArray.forEach(function (data) {
        csvArray.push([data.castleId, data.castleName]);
    });
    // CSV形式の文字列に変換して返す
    return csvArray.map(row => row.join(',')).join('\n');
}

function outputCSV() {
    const confirmation = confirm('csv形式でデータを出力しますか');
    if (confirmation) {


        // ローカルストレージからデータを取得
        const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

        // データをCSV形式に変換
        const csvData = convertToCSV(storedData);

        // CSVデータをUTF-8形式で保存
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'catsle_card.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getAllNumber(csvFileName) {
    const lines = csvFileName.split('\n'); // 改行で分割して各行を取得
    const allNumbers = []; // データを格納する配列

    // 各行を処理してデータを取得
    for (let i = 1; i < lines.length; i++) { // 最初の行はヘッダーなのでスキップする
        const line = lines[i].trim(); // 前後の空白を削除
        // console.log(line);
        if (line) { // 空行でない場合のみ処理する
            const parts = line.split(','); // カンマで区切って各要素を取得
            // allNumbers.push(parseInt(parts[0], 10));
            allNumbers.push(parts[0]);
        }
    }
    return allNumbers;
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
        // console.log(cells);
        return {
            id: cells[0], // 城ID
            name: cells[1] // 城名
        };
    });
}

function displayData(data) {
    const output = document.getElementById('output');
    output.textContent = "読み込んだデータ\n"
    // カスタムフォーマットで出力
    const formattedData = data.map(item => `${item.id}, 城名: ${item.name}`).join('\n');
    output.textContent += formattedData;
}

function addData() {
    // 追加データを表示する処理
    alert(parsedData.map(item => `${item.id}, 城名: ${item.name}`).join('\n'));
    alert("データが追加されました。");

    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

    // 新しいデータを追加（重複しないデータのみ）
    parsedData.forEach(item => {
        // IDがすでにstoredDataに存在しない場合のみ追加
        if (!storedData.some(existingItem => existingItem.castleName === item.name)) {
            console.log("追加するデータ");
            console.log(item.id);
            console.log(item.name);
            // storedData.push(item);
            storedData.push({ castleId: item.id, castleName: item.name });

        }
    });

    // 新しいデータを再びローカルストレージに保存
    localStorage.setItem("storedData4", JSON.stringify(storedData));

    displayRecords(); // 更新後の記録を再表示
    displayStoredData();
    getAllCastleIds();
    // ページをリロードする
    location.reload();

}

function getAllCastleIds() {
    // ローカルストレージからデータを取得（城カード用 storedData4）
    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];
    const castleIds = storedData.map(data => data.castleId);

    // 全IDリスト（allNumbers）から未登録分を抽出
    const unregisteredNumbers = allNumbers.filter(number => !castleIds.includes(number));

    const nameListDiv = document.getElementById("nameList");

    // HTML組み立て開始
    let html = `
        <div class="list-header card-header">
            <h3>未取得の城カード一覧</h3>
            <div class="progress-info">
                <p>全 ${allNumbers.length} 枚中</p>
                <p class="remaining-count">残り <span>${unregisteredNumbers.length}</span> 枚</p>
            </div>
        </div>
        <div class="castle-grid">`; // 共通のグリッドクラスを使用

    unregisteredNumbers.forEach(number => {
        const name = getCatsleName(String(number));
        if (name) {
            html += `
                <div class="castle-item unvisited card-item">
                    <span class="id-badge">${number}</span>
                    <a href="#" class="castle-link2">${name}</a>
                </div>`;
        }
    });

    html += `</div>`;
    nameListDiv.innerHTML = html;

    // イベントリスナーの追加
    const castleLinks2 = document.querySelectorAll('.castle-link2');
    castleLinks2.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const castleName = this.textContent;

            // 地図の移動
            moveToCastleLocation(castleName, 10);

            // スムーズスクロール
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


function reset() {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem("storedData4"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    kakusu();
    displayStoredData();
    displayRecords();
}

// 指定したCSVファイル名
const csvFileName = 'data/catsle_card_zoku.csv';
castleLocations = [];
allNumbers = [];

// ファイル読み込み処理を実行する関数
function loadCSV() {
    fetch(csvFileName) // 指定したファイル名でファイルを取得
        .then(response => response.text()) // テキストデータとして取得
        .then(csvData => {
            castleLocations = parseCSV(csvData); // CSVデータを解析して配列に変換
            allNumbers = getAllNumber(csvData);
            initMap(castleLocations); // 地図を初期化する関数を呼び出す

        })
        .catch(error => console.error('ファイルの読み込みエラー:', error));
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
    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

    // 城のマーカーを地図上に表示
    castleLocations.forEach(castle => {
        // すでに同じマーカーが登録されているかどうかを確認
        if (!markers.some(marker => marker.getLatLng().equals(castle.location))) {

            // 城名に応じて適切なアイコンを選択
            const castleIcon = storedData.some(data => data.castleName === castle.name) ? redMarkerIcon : catsleIcon;
            // マーカーを作成して地図に追加
            const marker = L.marker(castle.location, { icon: castleIcon }).addTo(map).bindPopup(castle.name);
            markers.push(marker);
        }
    });
}

function markerChangeColor(targetCastleName) {
    // 赤いマーカーアイコン
    const redMarkerIcon = L.icon({
        iconUrl: 'img/hono.png', // 赤いアイコンのURL
        iconSize: [25, 41], // アイコンのサイズ
        iconAnchor: [12, 41], // アイコンのアンカーポイントdd
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
            const marker = L.marker([latitude, longitude]).addTo(map).bindPopup();

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
    const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];
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
function getRcordList() {
    const recordListDiv = document.getElementById("recordList");
    recordListDiv.style.display = 'block';
    recordListDiv.innerHTML = ""; // 初期化

    // 城カード用データ（storedData4）を取得
    let storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

    // --- ID順（昇順）に並べ替え ---
    storedData.sort((a, b) => Number(a.castleId) - Number(b.castleId));

    // ヘッダーを追加（カード版用のクラス card-header を使用）
    let html = `
        <div class="list-header delete-header card-header">
            <h3>削除する城カードの選択</h3>
            <p>削除したいカードにチェックを入れてください</p>
        </div>
        <div class="castle-grid">`;

    storedData.forEach(record => {
        html += `
            <div class="castle-item delete-item card-item">
                <input type="checkbox" id="check-card-${record.castleId}" value="${record.castleName}" class="delete-checkbox">
                <label for="check-card-${record.castleId}" class="delete-label">
                    <span class="id-badge">${record.castleId}</span>
                    ${record.castleName}
                </label>
            </div>`;
    });

    html += `</div>`;

    // 削除ボタンの追加
    if (storedData.length > 0) {
        html += `
            <div class="delete-action-area">
                <button onclick="remove()" class="btn-execute-delete">
                    選択したカード記録を削除する
                </button>
            </div>`;
    } else {
        html += `<p style="text-align:center; padding:20px; color:#666;">取得済みのカードがありません。</p>`;
    }

    recordListDiv.innerHTML = html;
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
        const storedData = JSON.parse(localStorage.getItem("storedData4")) || [];

        // チェックボックスで選択された城名を取得
        const selectedValues = checkboxes.map(checkbox => checkbox.value);

        // 選択された城名を除外して新しいデータを作成
        const updatedData = storedData.filter(record => !selectedValues.includes(record.castleName));

        // ローカルストレージを更新
        localStorage.setItem("storedData4", JSON.stringify(updatedData));

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

const CASTLE_MASTER = {
    "101": "志苔館", "102": "上ノ国勝山館", "103": "浪岡城", "104": "九戸城", "105": "白石城",
    "106": "脇本城", "107": "秋田城", "108": "鶴ヶ岡城", "109": "米沢城", "110": "三春城",
    "111": "向羽黒山城", "112": "笠間城", "113": "土浦城", "114": "唐沢山城", "115": "名胡桃城",
    "116": "沼田城", "117": "岩櫃城", "118": "忍城", "119": "杉山城", "120": "菅谷館",
    "121": "本佐倉城", "122": "大多喜城", "123": "滝山城", "124": "品川台場", "125": "小机城",
    "126": "石垣山城", "127": "新府城", "128": "要害山城", "129": "龍岡城", "130": "高島城",
    "131": "村上城", "132": "高田城", "133": "鮫ケ尾城", "134": "富山城", "135": "増山城",
    "136": "鳥越城", "137": "福井城", "138": "越前大野城", "139": "佐柿国吉城", "140": "玄蕃尾城",
    "141": "郡上八幡城", "142": "苗木城", "143": "美濃金山城", "144": "大垣城", "145": "興国寺城",
    "146": "諏訪原城", "147": "高天神城", "148": "浜松城", "149": "小牧山城", "150": "古宮城",
    "151": "吉田城", "152": "津城", "153": "多気北畠氏城館", "154": "田丸城", "155": "赤木城",
    "156": "鎌刃城", "157": "八幡山城", "158": "福知山城", "159": "芥川山城", "160": "飯盛城",
    "161": "岸和田城", "162": "出石城・有子山城", "163": "黒井城", "164": "洲本城", "165": "大和郡山城",
    "166": "宇陀松山城", "167": "新宮城", "168": "若桜鬼ケ城", "169": "米子城", "170": "浜田城",
    "171": "備中高松城", "172": "三原城", "173": "新高山城", "174": "大内氏館・高嶺城", "175": "勝瑞城",
    "176": "一宮城", "177": "引田城", "178": "能島城", "179": "河後森城", "180": "岡豊城",
    "181": "小倉城", "182": "水城", "183": "久留米城", "184": "基肄城", "185": "唐津城",
    "186": "金田城", "187": "福江城", "188": "原城", "189": "鞠智城", "190": "八代城",
    "191": "中津城", "192": "角牟礼城", "193": "臼杵城", "194": "佐伯城", "195": "延岡城",
    "196": "佐土原城", "197": "志布志城", "198": "知覧城", "199": "座喜味城", "200": "勝連城",
    "182_1": "水城（太宰府市）", "182_2": "水城（大野城市）",
};

/**
 * IDから城名を取得
 */
function getCatsleName(castleID) {
    return CASTLE_MASTER[castleID] || "不明な城";
}

/**
 * 城名からIDを取得
 */
function getCastleID(selectedCastleValue) {
    // オブジェクトの「値」から「キー」を探す
    const entry = Object.entries(CASTLE_MASTER).find(([id, name]) => name === selectedCastleValue);
    return entry ? entry[0] : "不明な城";
}
