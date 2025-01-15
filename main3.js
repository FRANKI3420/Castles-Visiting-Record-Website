const citiesByRegion = {
    "未選択": ["未選択"],
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


document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleButton");
    const sidebar = document.getElementById("sidebar");
    const mapzone = document.getElementById("mapzone");
    const content = document.getElementById("content");

    toggleButton.addEventListener("click", function() {
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


let selectedDate;
let selectedCastleId;
// ページが読み込まれたときに保存されたデータを表示
displayStoredData();

document.getElementById("region").addEventListener("change", function () {
    selectedcsv = this.value;//csvfile_name
    // console.log(selectedcsv);
    selectedcsv = "data/" + selectedcsv;
    castleLocations2 = []

    fetch(selectedcsv) // 指定したファイル名でファイルを取得
        .then(response => response.text()) // テキストデータとして取得
        .then(csvData => {
            castleLocations2 = parseCSV2(csvData); // CSVデータを解析して配列に変換
            console.log(castleLocations2); // データが正しく変換されていることを確認
            hideMarkers();
            initMap(castleLocations2); // 地図を初期化する関数を呼び出す
        })
        .catch(error => console.error('ファイルの読み込みエラー:', error));

    const citySelect = document.getElementById("catsle");
    // 市町村リストをクリア
    citySelect.innerHTML = "";

    // 選択された都道府県に対応する市町村リストをセレクトメニューに追加
    castleLocations2.forEach(function (castle) {
        const option = document.createElement("option");
        option.textContent = castle.name;
        option.value = castle.name;
        citySelect.appendChild(option);
    });
});

function hideMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker); // マーカーを地図から削除
    });
    markers = [];
}


// CSV形式のデータを配列に変換する関数
function parseCSV2(csv) {
    const lines = csv.split('\n'); // 改行で分割して各行を取得
    const data = []; // データを格納する配列
    const castleMap2 = new Map();

    // 各行を処理してデータを取得
    for (let i = 1; i < lines.length; i++) { // 最初の行はヘッダーなのでスキップする
        const line = lines[i].trim(); // 前後の空白を削除
        if (line) { // 空行でない場合のみ処理する
            const parts = line.split(','); // カンマで区切って各要素を取得
            const name = parts[1]; // 名称を取得
            const latitude = parseFloat(parts[2]); // 北緯を数値に変換
            const longitude = parseFloat(parts[3]); // 東経を数値に変換
            data.push({ name, location: [latitude, longitude] }); // データを配列に追加
            castleMap2.set(name, parts[0]);
            // idMap.set(parts[0], name);
        }
    }

    const catsleSelect = document.getElementById("catsle");

    // castleMapの全ての名前をセレクトメニューに追加する
    console.log(castleMap);
    castleMap2.forEach((key, value) => {
        const option = document.createElement("option");
        option.textContent = value;
        option.value = value;
        console.log(key);
        console.log(value);
        catsleSelect.appendChild(option);
    });


    return data;
}


function saveData() {
    const selectedCastle = document.getElementById("catsle").value;
    // const selectedDate = document.getElementById("selectedDate").value;
    // 入力されているかをチェック
    // if (selectedCastle.trim() === '' || selectedDate.trim() === '') {
    if (selectedCastle.trim() === '') {
        // どちらかの入力が空の場合はエラーメッセージを表示するなどの処理を行う
        alert('城名が入力されていません。');
        return;
    }

    const id = castleMap.get(selectedCastle);

    console.log("id:", id);
    console.log("name:", selectedCastle);
    console.log("date:", selectedDate);


    // ローカルストレージから既存のデータを取得
    let storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

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
    localStorage.setItem("storedData3", JSON.stringify(storedData));

    displayStoredData();

    console.log("データが保存されました:", storedData);
    displayRecords();

}

function displayStoredData() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

    // IDでソート
    storedData.sort((a, b) => a.castleId - b.castleId);


    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    storedData.forEach(function (data) {
        // savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: <a>${data.castleName}<\a>, 日付: ${data.date}</p>`;
        // savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: <a href="#"  class="castle-link">${data.castleName}</a>, 日付: ${data.da}</p>`;
        savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: <a href="#"  class="castle-link">${data.castleName}</p>`;
    });
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

function displaystoredData3() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

    // 日付でソート
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    storedData.forEach(function (data) {
        // savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: <a>${data.castleName}<\a>, 日付: ${data.date}</p>`;
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
        const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

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

function getAllNumber(csvFileName){
    const lines = csvFileName.split('\n'); // 改行で分割して各行を取得
    const allNumbers = []; // データを格納する配列
    
    // 各行を処理してデータを取得
    for (let i = 1; i < lines.length; i++) { // 最初の行はヘッダーなのでスキップする
        const line = lines[i].trim(); // 前後の空白を削除
        console.log(line);
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
        console.log(cells);
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

    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

    // 新しいデータを追加（重複しないデータのみ）
    parsedData.forEach(item => {
        // IDがすでにstoredDataに存在しない場合のみ追加
        if (!storedData.some(existingItem => existingItem.castleName === item.name)) {
            console.log("追加するデータ");
            console.log(item.id);
            console.log(item.name);
            // storedData.push(item);
            storedData.push({ castleId: item.id, castleName: item.name});

        }
    });

    // 新しいデータを再びローカルストレージに保存
    localStorage.setItem("storedData3", JSON.stringify(storedData));

    displayRecords(); // 更新後の記録を再表示
    displayStoredData();
    // ページをリロードする
    location.reload();

}


function getAllCastleIds() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

    // 登録されているすべての城IDを取得
    const castleIds = storedData.map(data => data.castleId);
    console.log("castleIds");
    console.log(castleIds);
    
    // const allNumbers = getAllNumber(csvFileName);
    console.log("allNumbers");
    console.log(allNumbers);
    

    // 登録されていない数字を取得
    const unregisteredNumbers = allNumbers.filter(number => !castleIds.includes(number));
    console.log("unregisteredNumbers");
    console.log(unregisteredNumbers);

    const nameList = [];
    for (const number of unregisteredNumbers) {
        const stringNumber = String(number);
        nameList.push(getCatsleName(stringNumber));
        // nameList.push(idMap.get(number));
    }
    console.log(nameList);

    const nameListDiv = document.getElementById("nameList");
    nameListDiv.innerHTML = "<ul>";
    nameListDiv.innerHTML += "未取得のお城カード一覧\n";
    nameListDiv.innerHTML += "残り" + nameList.length + "枚";
    nameList.forEach(function (name) {
        nameListDiv.innerHTML += `<li><a href="#" class='castle-link2'>${name}</a></li>`;
    });
    nameListDiv.innerHTML += "</ul>";
    // castle-link クラスを持つすべての要素にイベントリスナーを追加する
    const castleLinks2 = document.querySelectorAll('.castle-link2');

    castleLinks2.forEach(link => {
        link.addEventListener('click', function (event) {
            // クリックされた城の名前を取得する
            event.preventDefault();

            // 地図コンテナを取得
            const mapContainer = document.getElementById('map');

            const castleName = this.textContent;
            console.log('クリックされた城名:', castleName);
            moveToCastleLocation(castleName, 10);
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
    nameListDiv.innerHTML = null;
}


function reset() {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem("storedData3"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    kakusu();
    displayStoredData();
    displayRecords();
}

// 指定したCSVファイル名
const csvFileName = 'data/catsle_card.csv';
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
            castleMap.set(name, parts[0]);
            idMap.set(parts[0], name);
        }
    }

    const catsleSelect = document.getElementById("catsle");

    // castleMapの全ての名前をセレクトメニューに追加する
    console.log(castleMap);
    castleMap.forEach((key, value) => {
        const option = document.createElement("option");
        option.textContent = value;
        option.value = value;
        console.log(key);
        console.log(value);
        catsleSelect.appendChild(option);
    });


    return data;
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
    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];

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
    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];
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

function getRcordList(){
    const nameListDiv = document.getElementById("recordList");
    nameListDiv.innerHTML = null;
    const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];
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

// 選択した記録を削除する関数
function remove() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    if (checkboxes.length === 0) {
        alert("削除する記録を選択してください。");
        return;
    }

    const confirmation = confirm('選択された記録を削除しますか？');
    if (confirmation) {
        localStorage.removeItem("storedData3"); // 特定のキーに関連付けられたデータを削除

        const storedData = JSON.parse(localStorage.getItem("storedData3")) || [];
        const updatedData = storedData.filter(record => !checkboxes.some(checkbox => checkbox.value === record.castleId));
        localStorage.setItem("storedData3", JSON.stringify(updatedData));

        // 選択されているチェックボックスの値を格納する配列
        const selectedValues = [];

        // 選択されたチェックボックスの要素を反復処理して、値を取得する
        checkboxes.forEach(checkbox => {
            selectedValues.push(checkbox.value);
        });

        // 選択されたチェックボックスの値を表示する
        console.log("選択されたチェックボックスの値:", selectedValues);

        const catsleIcon = L.icon({
            iconUrl: 'img/siro.png', // 赤いアイコンのURL
            iconSize: [25, 41], // アイコンのサイズ
            iconAnchor: [12, 41], // アイコンのアンカーポイント
            popupAnchor: [1, -34] // ポップアップのアンカーポイント
        });

        // 選択された城名と一致するマーカーの色を変更
        markers.forEach(marker => {
            // マーカーに関連付けられた城名を取得
            const markerCastleName = marker.getPopup().getContent();
            // 選択された城名の中にマーカーの城名が含まれているか確認
            if (selectedValues.includes(markerCastleName)) {
                marker.setIcon(catsleIcon);
            }
        });

        displayRecords(); // 更新後の記録を再表示
        displayStoredData();
        alert("選択した記録が削除されました。");
    }
}

function getCatsleName(castleID) {
    switch (castleID) {
        case "1": return "根室チャシ跡群";
        case "2": return "五稜郭";
        case "3": return "松前城";
        case "4": return "弘前城";
        case "5": return "根城";
        case "6": return "盛岡城";
        case "7": return "多賀城";
        case "8": return "仙台城";
        case "9": return "久保田城";
        case "10": return "山形城";
        case "11": return "二本松城";
        case "12": return "会津若松城";
        case "13": return "白河小峰城";
        case "14": return "水戸城";
        case "15": return "足利氏館(鑁阿寺)";
        case "16": return "箕輪城";
        case "17": return "金山城";
        case "18": return "鉢形城";
        case "19": return "川越城";
        case "20": return "佐倉城";
        case "21": return "江戸城";
        case "22": return "八王子城";
        case "23": return "小田原城";
        case "24": return "武田氏館(武田神社)";
        case "25": return "甲府城";
        case "26": return "松代城";
        case "27": return "上田城";
        case "28": return "小諸城";
        case "29": return "松本城";
        case "30": return "高遠城";
        case "31": return "新発田城";
        case "32": return "春日山城";
        case "33": return "高岡城";
        case "34": return "七尾城";
        case "35": return "金沢城";
        case "36": return "丸岡城";
        case "37": return "一乗谷城";
        case "38": return "岩村城";
        case "39": return "岐阜城";
        case "40": return "山中城";
        case "41": return "駿府城";
        case "42": return "掛川城";
        case "43": return "犬山城";
        case "44": return "名古屋城";
        case "45": return "岡崎城";
        case "46": return "長篠城";
        case "47": return "伊賀上野城";
        case "48": return "松阪城";
        case "49": return "小谷城";
        case "50": return "彦根城";
        case "51": return "安土城";
        case "52": return "観音寺城";
        case "53": return "二条城";
        case "54": return "大阪城";
        case "55": return "千早城";
        case "56": return "竹田城";
        case "57": return "篠山城";
        case "58": return "明石城";
        case "59": return "姫路城";
        case "60": return "赤穂城";
        case "61": return "高取城";
        case "62": return "和歌山城";
        case "63": return "鳥取城";
        case "64": return "松江城";
        case "65": return "月山富田城";
        case "66": return "津和野城";
        case "67": return "津山城";
        case "68": return "備中松山城";
        case "69": return "鬼ノ城";
        case "70": return "岡山城";
        case "71": return "福山城";
        case "72": return "郡山城";
        case "73": return "広島城";
        case "74": return "岩国城";
        case "75": return "萩城";
        case "76": return "徳島城";
        case "77": return "高松城";
        case "78": return "丸亀城";
        case "79": return "今治城";
        case "80": return "湯築城";
        case "81": return "松山城";
        case "82": return "大洲城";
        case "83": return "宇和島城";
        case "84": return "高知城";
        case "85": return "福岡城";
        case "86": return "大野城";
        case "87": return "名護屋城";
        case "88": return "吉野ヶ里";
        case "89": return "佐賀城";
        case "90": return "平戸城";
        case "91": return "島原城";
        case "92": return "熊本城";
        case "93": return "人吉城";
        case "94": return "大分府内城";
        case "95": return "岡城";
        case "96": return "飫肥城";
        case "97": return "鹿児島城";
        case "98": return "今帰仁城";
        case "99": return "中城城";
        case "100": return "首里城";
        case "71_1": return "福山城（伏見櫓）";
        case "77_1": return "高松城(北之丸月見櫓)";
        case "92_1": return "熊本城（宇土櫓）";
        case "23_1": return "小田原城（天守）";
        case "71_2": return "福山城（天守）";
        case "77_2": return "高松城（旧東の丸艮櫓）";
        case "92_2": return "熊本城（天守）";
        case "23_2": return "小田原城(小峯御鐘ノ台大堀切東堀)";
        case "28":
        return "小諸城";
        case "37":
            return "一乗谷城";
        case "65":
            return "月山富田城";
        case "86_1":
            return "大野城(太宰府市)";
        case "86_2":
            return "大野城(大野城市)";
        case "86_3":
            return "大野城(宇美町)";
        case "89":
            return "佐賀城";
        case "97":
            return "鹿児島城";
        case "99":
            return "中城城";
        default: return "不明な城";
    }
}


function getCastleID(selectedCastleValue) {
    switch (selectedCastleValue) {
        case "根室チャシ跡群": return "1";
        case "五稜郭": return "2";
        case "松前城": return "3";
        case "弘前城": return "4";
        case "根城": return "5";
        case "盛岡城": return "6";
        case "多賀城": return "7";
        case "仙台城": return "8";
        case "久保田城": return "9";
        case "山形城": return "10";
        case "二本松城": return "11";
        case "会津若松城": return "12";
        case "白河小峰城": return "13";
        case "水戸城": return "14";
        case "足利氏館(鑁阿寺)": return "15";
        case "箕輪城": return "16";
        case "金山城": return "17";
        case "鉢形城": return "18";
        case "川越城": return "19";
        case "佐倉城": return "20";
        case "江戸城": return "21";
        case "八王子城": return "22";
        case "小田原城": return "23";
        case "小田原城(小峯御鐘ノ台大堀切東堀)": return "23";
        case "小田原城（天守）": return "23";
        case "武田氏館(武田神社)": return "24";
        case "甲府城": return "25";
        case "松代城": return "26";
        case "上田城": return "27";
        case "小諸城": return "28";
        case "松本城": return "29";
        case "高遠城": return "30";
        case "新発田城": return "31";
        case "春日山城": return "32";
        case "高岡城": return "33";
        case "七尾城": return "34";
        case "金沢城": return "35";
        case "丸岡城": return "36";
        case "一乗谷城": return "37";
        case "岩村城": return "38";
        case "岐阜城": return "39";
        case "山中城": return "40";
        case "駿府城": return "41";
        case "掛川城": return "42";
        case "犬山城": return "43";
        case "名古屋城": return "44";
        case "岡崎城": return "45";
        case "長篠城": return "46";
        case "伊賀上野城": return "47";
        case "松阪城": return "48";
        case "小谷城": return "49";
        case "彦根城": return "50";
        case "安土城": return "51";
        case "観音寺城": return "52";
        case "二条城": return "53";
        case "大阪城": return "54";
        case "千早城": return "55";
        case "竹田城": return "56";
        case "篠山城": return "57";
        case "明石城": return "58";
        case "姫路城": return "59";
        case "赤穂城": return "60";
        case "高取城": return "61";
        case "和歌山城": return "62";
        case "鳥取城": return "63";
        case "松江城": return "64";
        case "月山富田城": return "65";
        case "津和野城": return "66";
        case "津山城": return "67";
        case "備中松山城": return "68";
        case "鬼ノ城": return "69";
        case "岡山城": return "70";
        case "福山城": return "71";
        case "福山城（伏見櫓）": return "71";
        case "福山城（天守）": return "71";
        case "郡山城": return "72";
        case "広島城": return "73";
        case "岩国城": return "74";
        case "萩城": return "75";
        case "徳島城": return "76";
        case "高松城": return "77";
        case "高松城(北之丸月見櫓)": return "77";
        case "高松城（旧東の丸艮櫓）": return "77";
        case "丸亀城": return "78";
        case "今治城": return "79";
        case "湯築城": return "80";
        case "松山城": return "81";
        case "大洲城": return "82";
        case "宇和島城": return "83";
        case "高知城": return "84";
        case "福岡城": return "85";
        case "大野城": return "86";
        case "名護屋城": return "87";
        case "吉野ヶ里": return "88";
        case "佐賀城": return "89";
        case "平戸城": return "90";
        case "島原城": return "91";
        case "熊本城（宇土櫓）": return "92";
        case "熊本城（天守）": return "92";
        case "人吉城": return "93";
        case "大分府内城": return "94";
        case "岡城": return "95";
        case "飫肥城": return "96";
        case "鹿児島城": return "97";
        case "今帰仁城": return "98";
        case "中城城": return "99";
        case "首里城": return "100";
        case "福山城（伏見櫓）": return "71_1";
        case "高松城(北之丸月見櫓)": return "77_1";
        case "熊本城（宇土櫓）": return "92_1";
        case "小田原城（天守）": return "23_1";
        case "福山城（天守）": return "71_2";
        case "高松城（旧東の丸艮櫓）": return "77_2";
        case "熊本城（天守）": return "92_2";
        case "小田原城(小峯御鐘ノ台大堀切東堀)": return "23_2";
        case "大野城(太宰府市)": return "86_1";
        case "大野城(大野城市)": return "86_2";
        case "大野城(宇美町)": return "86_3";
        default: return "不明な城";
    }
}