const citiesByRegion = {
    "未選択": ["未選択"],
    "北海道・東北": ["根室チャシ跡群", "五稜郭", "松前城", "弘前城", "根城", "久保田城", "盛岡城", "多賀城", "仙台城", "山形城", "二本松城", "会津若松城", "白河小峰城"],
    "関東": ["足利氏館(鑁阿寺)", "水戸城", "金山城", "箕輪城", "川越城", "鉢形城", "佐倉城", "江戸城", "八王子城", "小田原城"],
    "甲信越・北陸": ["新発田城", "春日山城", "甲府城", "武田氏舘(武田神社)", "松代城", "高遠城", "上田城", "小諸城", "松本城", "高岡城", "七尾城", "金沢城", "丸岡城", "一乗谷城"],
    "東海・近畿": ["山中城", "駿府城", "掛川城", "岩村城", "岐阜城", "名古屋城", "長篠城", "犬山城", "岡崎城", "伊賀上野城", "松阪城", "安土城", "観音寺城", "小谷城", "彦根城", "二条城", "大阪城", "千早城", "明石城", "姫路城", "赤穂城", "竹田城", "篠山城", "高取城", "和歌山城"],
    "中国・四国": ["松江城", "月山富田城", "津和野城", "鳥取城", "津山城", "鬼ノ城", "岡山城", "備中松山城", "福山城", "郡山城", "広島城", "高松城", "丸亀城", "萩城", "岩国城", "徳島城", "今治城", "松山城", "宇和島城", "湯築城", "大洲城", "高知城"],
    "九州・沖縄": ["福岡城", "大野城", "吉野ヶ里", "佐賀城", "名護屋城", "平戸城", "島原城", "大分城", "岡城", "熊本城", "人吉城", "飫肥城", "鹿児島城", "首里城", "今帰仁城", "中城城"],

};

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

    // マーカーの色を赤色に変更
    markerChangeColor(selectedCastle);

    displayStoredData();

    console.log("データが保存されました:", storedData);
}

function displayStoredData() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

    // IDでソート
    storedData.sort((a, b) => a.castleId - b.castleId);


    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    storedData.forEach(function (data) {
        savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: ${data.castleName}, 日付: ${data.date}</p>`;
    });
}

function displayStoredData2() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

    // 日付でソート
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    storedData.forEach(function (data) {
        savedDataDiv.innerHTML += `<p>${data.castleId}, 城名: ${data.castleName}, 日付: ${data.date}</p>`;
    });
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
        link.setAttribute('download', 'saved_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getAllCastleIds() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData1")) || [];

    // 登録されているすべての城IDを取得
    const castleIds = storedData.map(data => data.castleId);

    // 1から100までの数字を生成
    const allNumbers = Array.from({ length: 100 }, (_, index) => index + 1);

    // 登録されていない数字を取得
    const unregisteredNumbers = allNumbers.filter(number => !castleIds.includes(number.toString()));
    console.log(unregisteredNumbers);

    const nameList = [];
    for (const number of unregisteredNumbers) {
        const stringNumber = String(number);

        nameList.push(getCatsleName(stringNumber));
    }
    console.log(nameList);
    const nameListDiv = document.getElementById("nameList");
    nameListDiv.innerHTML = "<ul>";
    nameListDiv.innerHTML += "訪れていないお城一覧\n";
    nameListDiv.innerHTML += "残り" + nameList.length + "城";
    nameList.forEach(function (name) {
        nameListDiv.innerHTML += `<li>${name}</li>`;
    });
    nameListDiv.innerHTML += "</ul>";
}

function kakusu() {
    const nameListDiv = document.getElementById("nameList");
    nameListDiv.innerHTML = null;
}

function reset() {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem("storedData1"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    displayStoredData();
}


// 指定したCSVファイル名
const csvFileName = 'siro.csv';

// ファイル読み込み処理を実行する関数
function loadCSV() {
    fetch(csvFileName) // 指定したファイル名でファイルを取得
        .then(response => response.text()) // テキストデータとして取得
        .then(csvData => {
            castleLocations = parseCSV(csvData); // CSVデータを解析して配列に変換
            console.log(castleLocations); // データが正しく変換されていることを確認
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

// ページ読み込み時にファイルを読み込む
window.onload = loadCSV;

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
        iconUrl: 'siro.png', // 赤いアイコンのURL
        iconSize: [25, 41], // アイコンのサイズ
        iconAnchor: [12, 41], // アイコンのアンカーポイント
        popupAnchor: [1, -34] // ポップアップのアンカーポイント
    });

    // 城のマーカーを地図上に表示
    castleLocations.forEach(castle => {
        const marker = L.marker(castle.location).addTo(map).bindPopup(castle.name); // マーカーにポップアップを追加して城名を表示
        marker.setIcon(catsleIcon);
        markers.push(marker);
    });
}

// 現在地を取得して地図の中心に設定する関数
function setCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 8); // 現在地を中心にしてズームレベルを15に設定
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
        iconUrl: 'hono.png', // 赤いアイコンのURL
        iconSize: [25, 41], // アイコンのサイズ
        iconAnchor: [12, 41], // アイコンのアンカーポイント
        popupAnchor: [1, -34] // ポップアップのアンカーポイント
    });
    console.log(targetCastleName);
    console.log(markers);
    markers.forEach(marker => {
        if (marker.getPopup().getContent() === targetCastleName) {
            marker.setIcon(redMarkerIcon);
        }
    });
}

// マーカーの色を変更する関数
function changeMarkerColor(color) {
    return L.icon({
        iconUrl: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-${color}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
}


function getCatsleName(castelID) {

    // 選択された城名に応じて城IDを更新
    if (castelID === "2") {
        return "五稜郭";
    } else if (castelID === "1") {
        return "根室チャシ跡群";
    } else if (castelID === "3") {
        return "松前城";
    } else if (castelID === "4") {
        return "弘前城";
    } else if (castelID === "5") {
        return "根城";
    } else if (castelID === "6") {
        return "久保田城";
    } else if (castelID === "7") {
        return "盛岡城";
    } else if (castelID === "8") {
        return "多賀城";
    } else if (castelID === "9") {
        return "仙台城";
    } else if (castelID === "10") {
        return "山形城";
    } else if (castelID === "11") {
        return "二本松城";
    } else if (castelID === "12") {
        return "会津若松城";
    } else if (castelID === "13") {
        return "白河小峰城";
    } else if (castelID === "14") {
        return "足利氏館(鑁阿寺)";
    } else if (castelID === "15") {
        return "水戸城";
    } else if (castelID === "16") {
        return "金山城";
    } else if (castelID === "17") {
        return "箕輪城";
    } else if (castelID === "18") {
        return "川越城";
    } else if (castelID === "19") {
        return "鉢形城";
    } else if (castelID === "20") {
        return "佐倉城";
    } else if (castelID === "21") {
        return "江戸城";
    } else if (castelID === "22") {
        return "八王子城";
    } else if (castelID === "23") {
        return "小田原城";
    } else if (castelID === "24") {
        return "新発田城";
    } else if (castelID === "25") {
        return "春日山城";
    } else if (castelID === "26") {
        return "甲府城";
    } else if (castelID === "27") {
        return "武田氏舘(武田神社)";
    } else if (castelID === "28") {
        return "松代城";
    } else if (castelID === "29") {
        return "高遠城";
    } else if (castelID === "30") {
        return "上田城";
    } else if (castelID === "31") {
        return "小諸城";
    } else if (castelID === "32") {
        return "松本城";
    } else if (castelID === "33") {
        return "高岡城";
    } else if (castelID === "34") {
        return "七尾城";
    } else if (castelID === "35") {
        return "金沢城";
    } else if (castelID === "36") {
        return "丸岡城";
    } else if (castelID === "37") {
        return "一乗谷城";
    } else if (castelID === "38") {
        return "山中城";
    } else if (castelID === "39") {
        return "駿府城";
    } else if (castelID === "40") {
        return "掛川城";
    } else if (castelID === "41") {
        return "岩村城";
    } else if (castelID === "42") {
        return "岐阜城";
    } else if (castelID === "43") {
        return "名古屋城";
    } else if (castelID === "44") {
        return "長篠城";
    } else if (castelID === "45") {
        return "犬山城";
    } else if (castelID === "46") {
        return "岡崎城";
    } else if (castelID === "47") {
        return "伊賀上野城";
    } else if (castelID === "48") {
        return "松阪城";
    } else if (castelID === "49") {
        return "安土城";
    } else if (castelID === "50") {
        return "観音寺城";
    } else if (castelID === "51") {
        return "小谷城";
    } else if (castelID === "52") {
        return "彦根城";
    } else if (castelID === "53") {
        return "二条城";
    } else if (castelID === "54") {
        return "大阪城";
    } else if (castelID === "55") {
        return "千早城";
    } else if (castelID === "56") {
        return "明石城";
    } else if (castelID === "57") {
        return "姫路城";
    } else if (castelID === "58") {
        return "赤穂城";
    } else if (castelID === "59") {
        return "竹田城";
    } else if (castelID === "60") {
        return "篠山城";
    } else if (castelID === "61") {
        return "高取城";
    } else if (castelID === "62") {
        return "和歌山城";
    } else if (castelID === "63") {
        return "松江城";
    } else if (castelID === "64") {
        return "月山富田城";
    } else if (castelID === "65") {
        return "津和野城";
    } else if (castelID === "66") {
        return "鳥取城";
    } else if (castelID === "67") {
        return "津山城";
    } else if (castelID === "68") {
        return "鬼ノ城";
    } else if (castelID === "69") {
        return "岡山城";
    } else if (castelID === "70") {
        return "備中松山城";
    } else if (castelID === "71") {
        return "福山城";
    } else if (castelID === "72") {
        return "郡山城";
    } else if (castelID === "73") {
        return "広島城";
    } else if (castelID === "74") {
        return "高松城";
    } else if (castelID === "75") {
        return "丸亀城";
    } else if (castelID === "76") {
        return "萩城";
    } else if (castelID === "77") {
        return "岩国城";
    } else if (castelID === "78") {
        return "徳島城";
    } else if (castelID === "79") {
        return "今治城";
    } else if (castelID === "80") {
        return "松山城";
    } else if (castelID === "81") {
        return "宇和島城";
    } else if (castelID === "82") {
        return "湯築城";
    } else if (castelID === "83") {
        return "大洲城";
    } else if (castelID === "84") {
        return "高知城";
    } else if (castelID === "85") {
        return "福岡城";
    } else if (castelID === "86") {
        return "大野城";
    } else if (castelID === "87") {
        return "吉野ヶ里";
    } else if (castelID === "88") {
        return "佐賀城";
    } else if (castelID === "89") {
        return "名護屋城";
    } else if (castelID === "90") {
        return "平戸城";
    } else if (castelID === "91") {
        return "島原城";
    } else if (castelID === "92") {
        return "大分城";
    } else if (castelID === "93") {
        return "岡城";
    } else if (castelID === "94") {
        return "熊本城";
    } else if (castelID === "95") {
        return "人吉城";
    } else if (castelID === "96") {
        return "飫肥城";
    } else if (castelID === "97") {
        return "鹿児島城";
    } else if (castelID === "98") {
        return "首里城";
    } else if (castelID === "99") {
        return "今帰仁城";
    } else if (castelID === "100") {
        return "中城城";
    }


}


function getCatsleID(selectedCastleValue) {

    // 選択された城名に応じて城IDを更新
    if (selectedCastleValue === "五稜郭") {
        return "2";
    } else if (selectedCastleValue === "根室チャシ跡群") {
        return "1";
    } else if (selectedCastleValue === "松前城") {
        return "3";
    } else if (selectedCastleValue === "弘前城") {
        return "4";
    } else if (selectedCastleValue === "根城") {
        return "5";
    } else if (selectedCastleValue === "久保田城") {
        return "6";
    } else if (selectedCastleValue === "盛岡城") {
        return "7";
    } else if (selectedCastleValue === "多賀城") {
        return "8";
    } else if (selectedCastleValue === "仙台城") {
        return "9";
    } else if (selectedCastleValue === "山形城") {
        return "10";
    } else if (selectedCastleValue === "二本松城") {
        return "11";
    } else if (selectedCastleValue === "会津若松城") {
        return "12";
    } else if (selectedCastleValue === "白河小峰城") {
        return "13";
    } else if (selectedCastleValue === "足利氏館(鑁阿寺)") {
        return "14";
    } else if (selectedCastleValue === "水戸城") {
        return "15";
    } else if (selectedCastleValue === "金山城") {
        return "16";
    } else if (selectedCastleValue === "箕輪城") {
        return "17";
    } else if (selectedCastleValue === "川越城") {
        return "18";
    } else if (selectedCastleValue === "鉢形城") {
        return "19";
    } else if (selectedCastleValue === "佐倉城") {
        return "20";
    } else if (selectedCastleValue === "江戸城") {
        return "21";
    } else if (selectedCastleValue === "八王子城") {
        return "22";
    } else if (selectedCastleValue === "小田原城") {
        return "23";
    } else if (selectedCastleValue === "新発田城") {
        return "24";
    } else if (selectedCastleValue === "春日山城") {
        return "25";
    } else if (selectedCastleValue === "甲府城") {
        return "26";
    } else if (selectedCastleValue === "武田氏舘(武田神社)") {
        return "27";
    } else if (selectedCastleValue === "松代城") {
        return "28";
    } else if (selectedCastleValue === "高遠城") {
        return "29";
    } else if (selectedCastleValue === "上田城") {
        return "30";
    } else if (selectedCastleValue === "小諸城") {
        return "31";
    } else if (selectedCastleValue === "松本城") {
        return "32";
    } else if (selectedCastleValue === "高岡城") {
        return "33";
    } else if (selectedCastleValue === "七尾城") {
        return "34";
    } else if (selectedCastleValue === "金沢城") {
        return "35";
    } else if (selectedCastleValue === "丸岡城") {
        return "36";
    } else if (selectedCastleValue === "一乗谷城") {
        return "37";
    } else if (selectedCastleValue === "山中城") {
        return "38";
    } else if (selectedCastleValue === "駿府城") {
        return "39";
    } else if (selectedCastleValue === "掛川城") {
        return "40";
    } else if (selectedCastleValue === "岩村城") {
        return "41";
    } else if (selectedCastleValue === "岐阜城") {
        return "42";
    } else if (selectedCastleValue === "名古屋城") {
        return "43";
    } else if (selectedCastleValue === "長篠城") {
        return "44";
    } else if (selectedCastleValue === "犬山城") {
        return "45";
    } else if (selectedCastleValue === "岡崎城") {
        return "46";
    } else if (selectedCastleValue === "伊賀上野城") {
        return "47";
    } else if (selectedCastleValue === "松阪城") {
        return "48";
    } else if (selectedCastleValue === "安土城") {
        return "49";
    } else if (selectedCastleValue === "観音寺城") {
        return "50";
    } else if (selectedCastleValue === "小谷城") {
        return "51";
    } else if (selectedCastleValue === "彦根城") {
        return "52";
    } else if (selectedCastleValue === "二条城") {
        return "53";
    } else if (selectedCastleValue === "大阪城") {
        return "54";
    } else if (selectedCastleValue === "千早城") {
        return "55";
    } else if (selectedCastleValue === "明石城") {
        return "56";
    } else if (selectedCastleValue === "姫路城") {
        return "57";
    } else if (selectedCastleValue === "赤穂城") {
        return "58";
    } else if (selectedCastleValue === "竹田城") {
        return "59";
    } else if (selectedCastleValue === "篠山城") {
        return "60";
    } else if (selectedCastleValue === "高取城") {
        return "61";
    } else if (selectedCastleValue === "和歌山城") {
        return "62";
    } else if (selectedCastleValue === "松江城") {
        return "63";
    } else if (selectedCastleValue === "月山富田城") {
        return "64";
    } else if (selectedCastleValue === "津和野城") {
        return "65";
    } else if (selectedCastleValue === "鳥取城") {
        return "66";
    } else if (selectedCastleValue === "津山城") {
        return "67";
    } else if (selectedCastleValue === "鬼ノ城") {
        return "68";
    } else if (selectedCastleValue === "岡山城") {
        return "69";
    } else if (selectedCastleValue === "備中松山城") {
        return "70";
    } else if (selectedCastleValue === "福山城") {
        return "71";
    } else if (selectedCastleValue === "郡山城") {
        return "72";
    } else if (selectedCastleValue === "広島城") {
        return "73";
    } else if (selectedCastleValue === "高松城") {
        return "74";
    } else if (selectedCastleValue === "丸亀城") {
        return "75";
    } else if (selectedCastleValue === "萩城") {
        return "76";
    } else if (selectedCastleValue === "岩国城") {
        return "77";
    } else if (selectedCastleValue === "徳島城") {
        return "78";
    } else if (selectedCastleValue === "今治城") {
        return "79";
    } else if (selectedCastleValue === "松山城") {
        return "80";
    } else if (selectedCastleValue === "宇和島城") {
        return "81";
    } else if (selectedCastleValue === "湯築城") {
        return "82";
    } else if (selectedCastleValue === "大洲城") {
        return "83";
    } else if (selectedCastleValue === "高知城") {
        return "84";
    } else if (selectedCastleValue === "福岡城") {
        return "85";
    } else if (selectedCastleValue === "大野城") {
        return "86";
    } else if (selectedCastleValue === "吉野ヶ里") {
        return "87";
    } else if (selectedCastleValue === "佐賀城") {
        return "88";
    } else if (selectedCastleValue === "名護屋城") {
        return "89";
    } else if (selectedCastleValue === "平戸城") {
        return "90";
    } else if (selectedCastleValue === "島原城") {
        return "91";
    } else if (selectedCastleValue === "大分城") {
        return "92";
    } else if (selectedCastleValue === "岡城") {
        return "93";
    } else if (selectedCastleValue === "熊本城") {
        return "94";
    } else if (selectedCastleValue === "人吉城") {
        return "95";
    } else if (selectedCastleValue === "飫肥城") {
        return "96";
    } else if (selectedCastleValue === "鹿児島城") {
        return "97";
    } else if (selectedCastleValue === "首里城") {
        return "98";
    } else if (selectedCastleValue === "今帰仁城") {
        return "99";
    } else if (selectedCastleValue === "中城城") {
        return "100";
    }

}