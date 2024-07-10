# 餐廳清單專案
- 餐廳清單專案是一個收集不同餐廳的網站, 使用者經過註冊後, 可以透過此應用程式查看、蒐集、編輯、刪除餐廳。

- 本專案旨在練習 Sequelize 資料庫的基本操作（Create、Read、Update、Delete）, 以及實作使用者登入與驗證機制。本專案以MVC架構的模式整理程式碼, 將路由包裝進routes資料夾, 並由每條路由呼叫對應的controller。

## 專案描述
餐廳清單專案是基於之前的專案規格, 重新建立的專案; 之前採用的資料庫是mongoDB; 這次改用SQL。既有規格包括: 
- 使用者可以新增一家餐廳
- 使用者可以瀏覽一家餐廳的詳細資訊
- 使用者可以瀏覽全部所有餐廳
- 使用者可以修改一家餐廳的資訊
- 使用者可以刪除一家餐廳

此專案包含以下功能：
- 使用者可以註冊帳號，註冊的資料包括：名字、email、密碼、確認密碼
- 使用者可以透過 Facebook Login 直接登入
- 使用者還可以透過 Google Login 直接登入
- 使用者的密碼要使用 bcrypt 來處理
- 使用者必須登入才能使用餐廳清單
- 使用者登出、註冊失敗、或登入失敗時，使用者都會在畫面上看到正確而清楚的系統訊息

其他功能：
- 新增頁籤，可以提示使用者所在畫面
- 點擊擁有餐廳之頁籤, 可以直接帶出使用者所擁有的店家; 若沒擁有店家也會有提示字句
- 在個人頁面, 亦可顯示指定用戶所擁有的店家
- 若要觀看其他用戶的個人頁面, 可以直接從網址列輸入指定用戶 id
- 已區別登入使用者 id, 與其他使用者 id, 只能編輯自己的資料
- 可以上傳圖片, 新增頭像, 移除頭像

## 種子資料
在這支 restaurant.jsonLinks to an external site. 裡有一份餐廳清單，請運用這份清單建立種子資料。另外請你新增兩名使用者，並且設定使用者與餐廳的關係：

### 第一位使用者:
- email: user1@example.com
- password: 12345678
- 擁有 #1, #2, #3 號餐廳

### 第二位使用者:
- email: user2@example.com
- password: 12345678
- 擁有 #4, #5, #6 號餐廳

### root 使用者:
- email: root@example.com
- password: 12345678
- 並未擁有餐廳



## 安裝
### 環境需求
- Node.js ^14.x: 查看版本, 安裝對應版本後並切換到指定版本
  ```bash
  node -v
  nvm list available
  nvm install 14.16.0
  nvm use 14.16.0
  ```

- MySQL: 例如 MySQL Workbench 8.0


### 安裝步驟
1. 確保已安裝 Node.js（版本 ^14.x）。
- FORK 此專案到本地端：
   ```bash
   git clone https://github.com/your-username/sp-eating-list-final-070724.git
   ```

- 開啟專案目錄並安裝相依套件：
   ```bash
   cd sp-eating-list-final-070724
   npm install
   ```

- 設置環境變數：在專案根目錄建立 .env 文件, 並設置必要的環境變數, 例如：
  - SESSION_SECRET=啟用 session 功能的密鑰(可自訂)
  - USER_PASSWORD=使用者種子資料的密碼(可自訂, 例: 12345678)

  - 以下環境變數有與第三方平台登入有關, Client 的 id、secret、callback url可由下方連結取得和設定
    - FACEBOOK_CLIENT_ID=應用程式編號, 由個人 FB 開發者平台取得
    - FACEBOOK_CLIENT_SECRET=應用程式密鑰, 由個人 FB 開發者平台取得
    - FACEBOOK_CALLBACK_URL=伺服器網域/oauth2/redirect/facebook (處理驗證後路由)
    - GOOGLE_CLIENT_ID=用戶端編號 (由個人 Google Cloud Platform 憑證取得)
    - GOOGLE_CLIENT_SECRET=用戶端密鑰 (由個人 Google Cloud Platform 憑證取得)
    - GOOGLE_CALLBACK_URL=伺服器網域/auth/google/callback (處理驗證後路由)

- 打開 SQL 資料庫操作介面 (EX: My SQL Workbench 8.0)
    建立專案資料庫所使用的 Schema
    ```bash
    CREATE SCHEMA `eating-list` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
    ```

    若 Schema 名稱想自己決定時, 可前往 config/config.json 修改 "development" : { "database": "自訂 Schema 名稱" }


## 啟動專案
1. 啟動伺服器
    ```bash
    npm run start
    ```
    或使用 nodemon 進行開發
    ```bash
    npm run dev
    ```

- 建立資料庫
    使用 Sequelize CLI 進行資料庫遷移
    ```bash
    npx sequelize db:migrate
    ```

- 建立種子資料
    使用 Sequelize CLI 建立種子資料
    ```bash
    npx sequelize db:seed:all
    ```


## 主要技術
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Facebook OAuth 2.0](https://developers.facebook.com/)
- [Google OAuth 2.0](https://developers.google.com/?hl=zh-tw)


## 專案結構
```markdown
.
├── app.js
├── config
├── controllers
├── models
├── public
├── routes
├── seeders
├── views
└── README.md
```