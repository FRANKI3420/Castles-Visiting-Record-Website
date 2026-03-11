// Google Drive APIの設定
const CLIENT_ID = '391072316314-pk817l25cfhrk55g0t1u5ust1puv528v.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive';

let tokenClient;
let accessToken = null;

// 初期化
window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGapi;
    document.body.appendChild(script);
});

function initializeGapi() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                document.getElementById('authBtn').style.display = 'none';
                document.getElementById('backupStatus').textContent = "認証済み：バックアップ中...";
                uploadToDrive();
            }
        },
    });
}

function handleAuthClick() {
    tokenClient.requestAccessToken();
}

/**
 * 各データを分かりやすいファイル名で個別にアップロードする
 */
async function uploadToDrive() {
    const FOLDER_ID = '1eVt4M2e_Ji67cGjUZdsbR9YP5lmQxxO0';
    const statusEl = document.getElementById('backupStatus');

    // データキーとファイル名の対応表
    const fileMapping = {
        "storedData1": "100名城訪問記録.json",
        "storedData2": "続100名城訪問記録.json",
        "storedData3": "城カード_100名城.json",
        "storedData4": "城カード_続100名城.json",
        "storedData5": "城メダル取得記録.json",
        "storedData6": "御翔印取得記録.json",
        "storedData7": "御菓印取得記録.json"
    };

    let successCount = 0;

    try {
        for (const [key, fileName] of Object.entries(fileMapping)) {
            const data = localStorage.getItem(key);

            // データが存在しない、または空の場合はスキップ
            if (!data || data === "[]" || data === "{}") continue;

            // 1. 指定フォルダ内の同名ファイルを検索
            const searchRes = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${FOLDER_ID}' in parents and trashed=false`,
                { headers: { 'Authorization': 'Bearer ' + accessToken } }
            );
            const searchResult = await searchRes.json();
            const existingFile = searchResult.files && searchResult.files.length > 0 ? searchResult.files[0] : null;

            let response;
            if (existingFile) {
                // 2. 既存ファイルがある場合は上書き (PATCH)
                response = await fetch(
                    `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json'
                        },
                        body: data
                    }
                );
            } else {
                // 3. ファイルがない場合は新規作成 (POST)
                const metadata = {
                    name: fileName,
                    mimeType: 'application/json',
                    parents: [FOLDER_ID]
                };

                const formData = new FormData();
                formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                formData.append('file', new Blob([data], { type: 'application/json' }));

                response = await fetch(
                    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
                    {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        body: formData
                    }
                );
            }

            if (response.ok) {
                successCount++;
            }
        }

        if (statusEl) {
            statusEl.innerHTML = `<span style="color: #4caf50;">✅ ${successCount}件の記録を同期しました<br>(${new Date().toLocaleTimeString()})</span>`;
        }

    } catch (err) {
        console.error('Backup Error:', err);
        if (statusEl) statusEl.innerHTML = `<span style="color: #ff5252;">❌ 同期失敗: ${err.message}</span>`;
    }
}