// エリア紐付けデータ（和菓子屋）
const castleRegionMap = {
    // 北海道 (1-3)
    "1": "北海道", "2": "北海道", "3": "北海道",
    // 東北 (4-8)
    "4": "東北", "5": "東北", "6": "東北", "7": "東北", "8": "東北",
    // 東京 (9-13)
    "9": "東京", "10": "東京", "11": "東京", "12": "東京", "13": "東京",
    // 関東 (14-17) ※東京以外
    "14": "関東", "15": "関東", "16": "関東", "17": "関東",
    // 信越・北陸 (18-23)
    "18": "信越・北陸", "19": "信越・北陸", "20": "信越・北陸", "21": "信越・北陸", "22": "信越・北陸", "23": "信越・北陸",
    // 中部 (24-35)
    "24": "中部", "25": "中部", "26": "中部", "27": "中部", "28": "中部", "29": "中部", "30": "中部", "31": "中部", "32": "中部", "33": "中部", "34": "中部", "35": "中部",
    // 京都 (36-41)
    "36": "京都", "37": "京都", "38": "京都", "39": "京都", "40": "京都", "41": "京都",
    // 近畿 (42-45) ※京都以外
    "42": "近畿", "43": "近畿", "44": "近畿", "45": "近畿",
    // 中国 (46-48)
    "46": "中国", "47": "中国", "48": "中国",
    // 四国 (49-50)
    "49": "四国", "50": "四国",
    // 九州 (51-59)
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

document.getElementById("region").addEventListener("change", function () {
    const selectedRegion = this.value; // 選択されたエリア名
    const castleSelect = document.getElementById("catsle");
    castleSelect.innerHTML = '<option value="">未選択</option>'; // 初期化

    // 保存済みデータを取得（IDの配列にする）
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];
    const visitedIds = storedData.map(data => String(data.castleId));

    // 100名城をループして条件に合うものを抽出
    Object.keys(castleMasterList).forEach(id => {
        const castleName = castleMasterList[id];
        const region = castleRegionMap[id];

        let shouldAdd = false;

        // A. 通常エリア判定
        if (selectedRegion === region) {
            shouldAdd = true;
        }

        // C. すでに保存されている城（visitedIdsに含まれる）は除外
        if (shouldAdd && !visitedIds.includes(id)) {
            const option = document.createElement("option");
            option.value = castleName;
            option.textContent = castleName;
            castleSelect.appendChild(option);
        }
    });

    // 選択肢がない場合のメッセージ
    if (castleSelect.options.length === 1 && selectedRegion !== "未選択") {
        const option = document.createElement("option");
        option.textContent = "このエリアは全制覇！🎉";
        option.disabled = true;
        castleSelect.appendChild(option);
    }
});


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

    displayStoredData();

    // もし最初から「未訪問リスト」を表示させたいなら、ボタンの文字も変える
    const nameListDiv = document.getElementById("nameList");
    const unvisitedBtn = document.getElementById("btn-toggle-unvisited");
    if (nameListDiv && unvisitedBtn && nameListDiv.innerHTML !== "") {
        unvisitedBtn.textContent = "未訪問のお城を隠す";
    }
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
        btn.textContent = "未訪問のお城を隠す";
        btn.classList.add("active"); // 必要ならスタイル変更用
    } else {
        kakusu(); // 既存の非表示関数を呼び出す
        btn.textContent = "未訪問のお城を表示";
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


let selectedDate;
let selectedCastleId;
// ページが読み込まれたときに保存されたデータを表示
displayStoredData();


/**
 * 訪問履歴から月別グラフを描画する
 * @param {Array} storedData - LocalStorageから取得したデータの配列
 */
function createVisitChart(storedData) {
    const ctx = document.getElementById('visitChart');
    if (!ctx) return;

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
    if (window.myChart) {
        window.myChart.destroy();
    }

    // 4. Chart.js インスタンスの作成
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
                legend: { display: false } // 凡例は不要なら隠す
            }
        }
    });
}

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
    let storedData = JSON.parse(localStorage.getItem("storedData7")) || [];

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
    localStorage.setItem("storedData7", JSON.stringify(storedData));

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
    document.getElementById("region").dispatchEvent(new Event('change'));

    alert("データが保存されました");
    console.log("データが保存されました:", storedData);
    displayRecords();
    createVisitChart(storedData);
}

function displayStoredData() {
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];
    storedData.sort((a, b) => a.castleId - b.castleId);

    // HTMLに表示
    const savedDataDiv = document.getElementById("savedData");
    // 表示エリアをクリア
    savedDataDiv.innerHTML = "";

    const totalCastles = Object.keys(castleMasterList).length;
    const visitedCount = storedData.length;
    const percentage = Math.floor((visitedCount / totalCastles) * 100);

    // 統計エリアのHTMLを作成
    const statsHtml = `
    <div class="stats-container">
    <div class="stats-header">
    <span class="stats-label">現在の取得状況</span>
    <span class="stats-count"><strong>${visitedCount}</strong> / ${totalCastles} 枚</span>
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

    createVisitChart(storedData);
    // displayStoredData と displayStoredData2 両方のループ内を修正
    storedData.forEach(function (data) {
        savedDataDiv.innerHTML += `
    <div class="castle-item">
        <span class="id-badge">${data.castleId}</span>
        <div class="castle-info">
            <a href="#" class="castle-link2">${data.castleName}</a>
            <span class="visit-date">${data.date}</span>
        </div>
    </div>`;
    });

    // 💡 重要：HTMLを書き換えた直後に、イベントリスナーを再設定する必要があります
    rebindCastleLinks();
    getAllCastleIds();
}


function displayStoredData2() {
    // ローカルストレージからデータを取得
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];

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


    // displayStoredData と displayStoredData2 両方のループ内を修正
    storedData.forEach(function (data) {
        savedDataDiv.innerHTML += `
    <div class="castle-item">
        <span class="id-badge">${data.castleId}</span>
        <div class="castle-info">
            <a href="#" class="castle-link2">${data.castleName}</a>
            <span class="visit-date">${data.date}</span>
        </div>
    </div>`;
    });

    // 💡 重要：HTMLを書き換えた直後に、イベントリスナーを再設定する必要があります
    rebindCastleLinks();
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
        const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];

        // データをCSV形式に変換
        const csvData = convertToCSV(storedData);

        // CSVデータをUTF-8形式で保存
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'gokain.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getAllCastleIds() {
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];
    const castleIds = storedData.map(data => String(data.castleId));
    const allNumbers = Object.keys(castleMasterList);
    const unregisteredNumbers = allNumbers.filter(id => !castleIds.includes(id));
    const nameListDiv = document.getElementById("nameList");

    // ヘッダー部分（残り件数など）
    let html = `
        <div class="list-header">
            <h3>訪れていないお店一覧</h3>
            <p class="remaining-count">残り <span>${unregisteredNumbers.length}</span> 店</p>
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

/**
 * リスト内の castle-link2 に対してイベントリスナーを貼り直す関数
 */
function rebindCastleLinks() {
    const castleLinks = document.querySelectorAll('.castle-link2');
    castleLinks.forEach(link => {
        // 二重登録を防ぐため、一度削除してから追加するか、
        // 既存のロジックをそのまま実行
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const castleName = this.textContent;

            // 既存の関数を呼び出し
            moveToCastleLocation(castleName, 10);

            // 地図までスムーズにスクロール
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth' });
            }

            // スマホならサイドバーを閉じる（追加すると便利です）
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById("sidebar");
                if (sidebar) {
                    sidebar.classList.add("hidden");
                    document.getElementById("toggleButton").textContent = "∨";
                }
            }
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
function getRcordList(storageKey = "storedData7", title = "日本100名城") {
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
        localStorage.removeItem("storedData7"); // 特定のキーに関連付けられたデータを削除
        alert('データがリセットされました。'); // リセット完了のメッセージを表示
    }
    markers = [];
    loadCSV();
    kakusu();
    displayStoredData();
    displayRecords();

}


// 指定したCSVファイル名
const csvFileName = 'data/gokain.csv';
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

    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];

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
    localStorage.setItem("storedData7", JSON.stringify(storedData));

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
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];
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
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];
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
        const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];

        // チェックボックスで選択された城名を取得
        const selectedValues = checkboxes.map(checkbox => checkbox.value);

        // 選択された城名を除外して新しいデータを作成
        const updatedData = storedData.filter(record => !selectedValues.includes(record.castleName));

        // ローカルストレージを更新
        localStorage.setItem("storedData7", JSON.stringify(updatedData));

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

        // 💡 ここでも実行！
        document.getElementById("region").dispatchEvent(new Event('change'));

        // UIを更新
        displayRecords();
        displayStoredData();
        getRcordList();

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
    const storedData = JSON.parse(localStorage.getItem("storedData7")) || [];

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