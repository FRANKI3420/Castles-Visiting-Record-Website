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


let selectedDate;
let selectedCastleId;
// ページが読み込まれたときに保存されたデータを表示
displayStoredData();

// document.getElementById("region").addEventListener("change", function () {
//     selectedcsv = this.value;//csvfile_name
//     // console.log(selectedcsv);
//     selectedcsv = "data/" + selectedcsv;
//     castleLocations2 = []

//     fetch(selectedcsv) // 指定したファイル名でファイルを取得
//         .then(response => response.text()) // テキストデータとして取得
//         .then(csvData => {
//             castleLocations2 = parseCSV2(csvData); // CSVデータを解析して配列に変換
//             console.log(castleLocations2); // データが正しく変換されていることを確認
//             hideMarkers();
//             initMap(castleLocations2); // 地図を初期化する関数を呼び出す
//         })
//         .catch(error => console.error('ファイルの読み込みエラー:', error));

//     const citySelect = document.getElementById("catsle");
//     // 市町村リストをクリア
//     citySelect.innerHTML = "";

//     // 選択された都道府県に対応する市町村リストをセレクトメニューに追加
//     castleLocations2.forEach(function (castle) {
//         const option = document.createElement("option");
//         option.textContent = castle.name;
//         option.value = castle.name;
//         citySelect.appendChild(option);
//     });
// });
document.addEventListener("DOMContentLoaded", function () {
    // 初期化処理
    const selectedcsv = "data/goshoin.csv"; // ここでデフォルトのCSVファイルを指定
    let castleLocations2 = [];

    fetch(selectedcsv) // 指定したファイル名でファイルを取得
        .then(response => response.text()) // テキストデータとして取得
        .then(csvData => {
            castleLocations2 = parseCSV2(csvData); // CSVデータを解析して配列に変換
            console.log(castleLocations2); // データが正しく変換されていることを確認
            hideMarkers();
            initMap(castleLocations2); // 地図を初期化する関数を呼び出す

            // セレクトメニューにデータを追加
            const citySelect = document.getElementById("catsle");
            castleLocations2.forEach(function (castle) {
                const option = document.createElement("option");
                option.textContent = castle.name;
                option.value = castle.name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error('ファイルの読み込みエラー:', error));
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

    // // castleMapの全ての名前をセレクトメニューに追加する
    // console.log(castleMap);
    // castleMap2.forEach((key, value) => {
    //     const option = document.createElement("option");
    //     option.textContent = value;
    //     option.value = value;
    //     console.log(key);
    //     console.log(value);
    //     catsleSelect.appendChild(option);
    // });


    return data;
}


function saveData() {
    const selectedCastle = document.getElementById("catsle").value;
    // const selectedDate = document.getElementById("selectedDate").value;
    // 入力されているかをチェック
    // if (selectedCastle.trim() === '' || selectedDate.trim() === '') {
    if (selectedCastle.trim() === '') {
        // どちらかの入力が空の場合はエラーメッセージを表示するなどの処理を行う
        alert('空港が入力されていません。');
        return;
    }

    const id = castleMap.get(selectedCastle);

    console.log("id:", id);
    console.log("name:", selectedCastle);
    console.log("date:", selectedDate);


    // ローカルストレージから既存のデータを取得
    let storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

    // すでに同じ城IDが存在するか確認
    const existingIndex = storedData.findIndex(data => data.castleId === id);

    if (existingIndex !== -1) {
        // すでに存在する場合は確認メッセージを表示
        const confirmOverwrite = confirm("この空港はすでに保存されています。上書きしますか？");

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
    localStorage.setItem("storedData5", JSON.stringify(storedData));

    displayStoredData();

    console.log("データが保存されました:", storedData);
    displayRecords();

}

function displayStoredData() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

    // IDでソート
    storedData.sort((a, b) => a.castleId - b.castleId);


    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";
    savedDataDiv.innerHTML += "\n取得枚数:" + storedData.length + "枚\n";


    storedData.forEach(function (data) {
        // savedDataDiv.innerHTML += `<p>${data.castleId}, 空港: <a>${data.castleName}<\a>, 日付: ${data.date}</p>`;
        // savedDataDiv.innerHTML += `<p>${data.castleId}, 空港: <a href="#"  class="castle-link">${data.castleName}</a>, 日付: ${data.da}</p>`;
        savedDataDiv.innerHTML += `<p>${data.castleId}, 空港: <a href="#"  class="castle-link">${data.castleName}</p>`;
    });
    // getAllCastleIds();
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
        console.log('クリックされた空港:', castleName);
        moveToCastleLocation(castleName, 10);
        // ここにクリックされた空港を使用した任意の処理を追加する
    });
});

function displaystoredData5() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

    // 日付でソート
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    storedData.forEach(function (data) {
        // savedDataDiv.innerHTML += `<p>${data.castleId}, 空港: <a>${data.castleName}<\a>, 日付: ${data.date}</p>`;
        savedDataDiv.innerHTML += `<p>${data.castleId}, 空港: <a href="#"  class="castle-link">${data.castleName}</a>, 日付: ${data.date}</p>`;
    });
}

// クリックされた空港の位置に地図を移動する関数
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
    csvArray.push(['城ID', '空港']);
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
        const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

        // データをCSV形式に変換
        const csvData = convertToCSV(storedData);

        // CSVデータをUTF-8形式で保存
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'goshoin.csv');
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
            name: cells[1] // 空港
        };
    });
}

function displayData(data) {
    const output = document.getElementById('output');
    output.textContent = "読み込んだデータ\n"
    // カスタムフォーマットで出力
    const formattedData = data.map(item => `${item.id}, 空港: ${item.name}`).join('\n');
    output.textContent += formattedData;
}

function addData() {
    // 追加データを表示する処理
    alert(parsedData.map(item => `${item.id}, 空港: ${item.name}`).join('\n'));
    alert("データが追加されました。");

    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

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
    localStorage.setItem("storedData5", JSON.stringify(storedData));

    displayRecords(); // 更新後の記録を再表示
    displayStoredData();
    // ページをリロードする
    location.reload();

}


function getAllCastleIds() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

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
    nameListDiv.innerHTML += "未取得の御翔印一覧\n";
    nameListDiv.innerHTML += "全" + allNumbers.length + "枚中";
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
            console.log('クリックされた空港:', castleName);
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
    document.getElementById('recordList').style.display = 'none';
    nameListDiv.innerHTML = null;
}


function reset() {
    const confirmation = confirm('ローカルストレージに保存されたデータをリセットします。よろしいですか？');
    if (confirmation) {
        localStorage.removeItem("storedData5"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    kakusu();
    displayStoredData();
    displayRecords();
}

// 指定したCSVファイル名
const csvFileName = 'data/goshoin.csv';
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
    // console.log(castleMap);
    // castleMap.forEach((key, value) => {
    //     const option = document.createElement("option");
    //     option.textContent = value;
    //     option.value = value;
    //     console.log(key);
    //     console.log(value);
    //     catsleSelect.appendChild(option);
    // });


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
        iconUrl: 'img/kuukou.png', // 赤いアイコンのURL
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

    // ローカルストレージから空港のリストを取得
    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

    // 城のマーカーを地図上に表示
    castleLocations.forEach(castle => {
        // すでに同じマーカーが登録されているかどうかを確認
        if (!markers.some(marker => marker.getLatLng().equals(castle.location))) {

            // 空港に応じて適切なアイコンを選択
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
    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];
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
    const nameListDiv = document.getElementById("recordList");
    document.getElementById('recordList').style.display = 'block';
    nameListDiv.innerHTML = null;
    const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];
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
        const storedData = JSON.parse(localStorage.getItem("storedData5")) || [];

        // チェックボックスで選択された空港を取得
        const selectedValues = checkboxes.map(checkbox => checkbox.value);

        // 選択された空港を除外して新しいデータを作成
        const updatedData = storedData.filter(record => !selectedValues.includes(record.castleName));

        // ローカルストレージを更新
        localStorage.setItem("storedData5", JSON.stringify(updatedData));

        // マーカーの色を更新
        const castleIcon = L.icon({
            iconUrl: 'img/kuukou.png', // 赤いアイコンのURL
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

function getCatsleName(castleID) {
    switch (castleID) {
        case "1": return "伊丹空港";
        case "2": return "羽田空港";
        case "3": return "那覇空港";
        case "4": return "新千歳空港";
        case "5": return "新潟空港";
        case "6": return "中部国際空港";
        case "7": return "福岡空港";
        case "8": return "松山空港";
        case "9": return "小松空港";
        case "10": return "出雲空港";
        case "11": return "青森空港";
        case "12": return "花巻空港";
        case "13": return "但馬空港";
        case "14": return "徳島空港";
        case "15": return "熊本空港";
        case "16": return "大分空港";
        case "17": return "長崎空港";
        case "18": return "鹿児島空港";
        case "19": return "函館空港";
        case "20": return "南紀白浜空港";
        case "21": return "関西国際空港";
        case "22": return "岡山空港";
        case "23": return "成田国際空港";
        case "24": return "宮崎空港";
        case "25": return "高知空港";
        case "26": return "高松空港";
        case "27": return "山口宇部空港";
        case "28": return "広島空港";
        case "29": return "秋田空港";
        case "30": return "釧路空港";
        case "31": return "仙台空港";
        case "32": return "札幌空港丘珠";
        case "33": return "女満別空港";
        case "34": return "北九州空港";
        case "35": return "三沢空港";
        case "36": return "山形空港";
        case "37": return "旭川空港";
        case "38": return "帯広空港";
        case "39": return "種子島空港";
        case "40": return "喜界空港";
        case "41": return "奄美空港";
        case "42": return "徳之島空港";
        case "43": return "与論空港";
        case "44": return "沖永良部空港";
        case "45": return "久米島空港";
        case "46": return "宮古空港";
        case "47": return "多良間空港";
        case "48": return "新石垣空港";
        case "49": return "与那国空港";
        case "50": return "隠岐空港";
        case "51": return "北大東空港";
        case "52": return "南大東空港";
        case "53": return "屋久島空港";
        case "54": return "奥尻空港";
        case "55": return "利尻空港";
    }
}


function getCastleID(selectedCastleValue) {
    switch (selectedCastleValue) {
        case "伊丹空港": return "1";
        case "羽田空港": return "2";
        case "那覇空港": return "3";
        case "新千歳空港": return "4";
        case "新潟空港": return "5";
        case "中部国際空港": return "6";
        case "福岡空港": return "7";
        case "松山空港": return "8";
        case "小松空港": return "9";
        case "出雲空港": return "10";
        case "青森空港": return "11";
        case "花巻空港": return "12";
        case "但馬空港": return "13";
        case "徳島空港": return "14";
        case "熊本空港": return "15";
        case "大分空港": return "16";
        case "長崎空港": return "17";
        case "鹿児島空港": return "18";
        case "函館空港": return "19";
        case "南紀白浜空港": return "20";
        case "関西国際空港": return "21";
        case "岡山空港": return "22";
        case "成田国際空港": return "23";
        case "宮崎空港": return "24";
        case "高知空港": return "25";
        case "高松空港": return "26";
        case "山口宇部空港": return "27";
        case "広島空港": return "28";
        case "秋田空港": return "29";
        case "釧路空港": return "30";
        case "仙台空港": return "31";
        case "札幌空港丘珠": return "32";
        case "女満別空港": return "33";
        case "北九州空港": return "34";
        case "三沢空港": return "35";
        case "山形空港": return "36";
        case "旭川空港": return "37";
        case "帯広空港": return "38";
        case "種子島空港": return "39";
        case "喜界空港": return "40";
        case "奄美空港": return "41";
        case "徳之島空港": return "42";
        case "与論空港": return "43";
        case "沖永良部空港": return "44";
        case "久米島空港": return "45";
        case "宮古空港": return "46";
        case "多良間空港": return "47";
        case "新石垣空港": return "48";
        case "与那国空港": return "49";
        case "隠岐空港": return "50";
        case "北大東空港": return "51";
        case "南大東空港": return "52";
        case "屋久島空港": return "53";
        case "奥尻空港": return "54";
        case "利尻空港": return "55";
    }
}
