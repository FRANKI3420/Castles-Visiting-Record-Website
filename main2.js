const castleRegionMap = {
    // 北海道・東北地方 (101-111)
    "101": "北海道・東北地方", "102": "北海道・東北地方", "103": "北海道・東北地方", "104": "北海道・東北地方", "105": "北海道・東北地方",
    "106": "北海道・東北地方", "107": "北海道・東北地方", "108": "北海道・東北地方", "109": "北海道・東北地方", "110": "北海道・東北地方",
    "111": "北海道・東北地方",

    // 関東・甲信越地方 (112-133)
    "112": "関東・甲信越地方", "113": "関東・甲信越地方", "114": "関東・甲信越地方", "115": "関東・甲信越地方", "116": "関東・甲信越地方",
    "117": "関東・甲信越地方", "118": "関東・甲信越地方", "119": "関東・甲信越地方", "120": "関東・甲信越地方", "121": "関東・甲信越地方",
    "122": "関東・甲信越地方", "123": "関東・甲信越地方", "124": "関東・甲信越地方", "125": "関東・甲信越地方", "126": "関東・甲信越地方",
    "127": "関東・甲信越地方", "128": "関東・甲信越地方", "129": "関東・甲信越地方", "130": "関東・甲信越地方", "131": "関東・甲信越地方",
    "132": "関東・甲信越地方", "133": "関東・甲信越地方",

    // 北陸・東海地方 (134-155)
    "134": "北陸・東海地方", "135": "北陸・東海地方", "136": "北陸・東海地方", "137": "北陸・東海地方", "138": "北陸・東海地方",
    "139": "北陸・東海地方", "140": "北陸・東海地方", "141": "北陸・東海地方", "142": "北陸・東海地方", "143": "北陸・東海地方",
    "144": "北陸・東海地方", "145": "北陸・東海地方", "146": "北陸・東海地方", "147": "北陸・東海地方", "148": "北陸・東海地方",
    "149": "北陸・東海地方", "150": "北陸・東海地方", "151": "北陸・東海地方", "152": "北陸・東海地方", "153": "北陸・東海地方",
    "154": "北陸・東海地方", "155": "北陸・東海地方",

    // 近畿地方 (156-167)
    "156": "近畿地方", "157": "近畿地方", "158": "近畿地方", "159": "近畿地方", "160": "近畿地方",
    "161": "近畿地方", "162": "近畿地方", "163": "近畿地方", "164": "近畿地方", "165": "近畿地方",
    "166": "近畿地方", "167": "近畿地方",

    // 中国・四国地方 (168-180)
    "168": "中国・四国地方", "169": "中国・四国地方", "170": "中国・四国地方", "171": "中国・四国地方", "172": "中国・四国地方",
    "173": "中国・四国地方", "174": "中国・四国地方", "175": "中国・四国地方", "176": "中国・四国地方", "177": "中国・四国地方",
    "178": "中国・四国地方", "179": "中国・四国地方", "180": "中国・四国地方",

    // 九州・沖縄地方 (181-200)
    "181": "九州・沖縄地方", "182": "九州・沖縄地方", "183": "九州・沖縄地方", "184": "九州・沖縄地方", "185": "九州・沖縄地方",
    "186": "九州・沖縄地方", "187": "九州・沖縄地方", "188": "九州・沖縄地方", "189": "九州・沖縄地方", "190": "九州・沖縄地方",
    "191": "九州・沖縄地方", "192": "九州・沖縄地方", "193": "九州・沖縄地方", "194": "九州・沖縄地方", "195": "九州・沖縄地方",
    "196": "九州・沖縄地方", "197": "九州・沖縄地方", "198": "九州・沖縄地方", "199": "九州・沖縄地方", "200": "九州・沖縄地方"
};

const castleMasterList = {
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
    "196": "佐土原城", "197": "志布志城", "198": "知覧城", "199": "座喜味城", "200": "勝連城"
};
document.getElementById("region").addEventListener("change", function () {
    const selectedRegion = this.value; // 選択されたエリア名
    const castleSelect = document.getElementById("catsle");
    castleSelect.innerHTML = '<option value="">未選択</option>'; // 初期化

    // 保存済みデータを取得（IDの配列にする）
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];
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

    // ローカルストレージに保存
    localStorage.setItem("storedData2", JSON.stringify(storedData));

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
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];
    storedData.sort((a, b) => a.castleId - b.castleId);

    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = "";

    // 1. 統計エリアとグラフ用キャンバスを準備
    const totalCastles = 100;
    const visitedCount = storedData.length;
    const percentage = Math.floor((visitedCount / totalCastles) * 100);

    savedDataDiv.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">登城状況: ${visitedCount}/${totalCastles}</div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${percentage}%"></div></div>
        </div>
        <div class="chart-container" style="position: relative; height:200px; width:100%; margin: 20px 0;">
            <canvas id="visitChart"></canvas>
        </div>
        <div id="listArea"></div>
    `;

    createVisitChart(storedData);


    // 3. リスト表示
    const listArea = document.getElementById("listArea");
    storedData.forEach(data => {
        listArea.innerHTML += `
        <div class="castle-item">
            <span class="id-badge">${data.castleId}</span>
            <div class="castle-info">
                <a href="#" class="castle-link">${data.castleName}</a>
                <span class="visit-date">${data.date}</span>
            </div>
        </div>`;
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
        link.setAttribute('download', '100catsle.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getAllCastleIds() {
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];
    const castleIds = storedData.map(data => data.castleId);
    const allNumbers = Array.from({ length: 100 }, (_, index) => index + 101);
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
function getRcordList(storageKey = "storedData2", title = "日本100名城") {
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

        // 💡 ここでも実行！
        document.getElementById("region").dispatchEvent(new Event('change'));

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
    const storedData = JSON.parse(localStorage.getItem("storedData2")) || [];

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