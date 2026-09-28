# MDS 互動診斷儀（Interactive MDS Diagnostic Tool）

重現 Chen, C.-H. & Chen, J.-A. (2000), *Interactive Diagnostic Plots for Multidimensional Scaling with Applications in Psychosis Disorder Data Analysis*, Statistica Sinica 10(2), 665–691 一文所提出的多維標度（MDS）互動診斷方法，以單一自足的 HTML 網頁實作，瀏覽器端即可執行，資料不會上傳。

**線上使用**：<https://claude.ai/artifact/Hbmk6iM2JwAScmcHz9F84Q>

## 這是什麼

傳統 MDS 只看整體配適指標（STRESS、R² 等），容易忽略「整體 stress 很低，但個別物件仍配適不佳」的情況。本工具重現論文提出的四種互動診斷方法，讓使用者能夠：

- 點選任一物件，即時看到它與其他所有物件的 proximity（相似度／相異度）如何映射到組態圖上的顏色（色彩連動 / color linkage）。
- 用色暈塗抹（color-smearing）在組態空間中平滑估計、視覺化 proximity 的分布趨勢（2D 與 1D 兩種核迴歸估計模式）。
- 用分解應力比例圖（decomposed stress proportion plot）找出對整體 stress 貢獻最大的少數物件。
- 用殘差圖（residual plot）拖曳刷選任一區域，立即在組態圖上畫出對應物件間的連線，檢視距離被高估或低估的模式。

## 功能總覽

### 資料輸入
- **論文模擬資料**：一鍵載入論文 Section 5 的模擬研究設計（n=50，x1,x2~U(0,1)，x3 以 5% 機率取 0.5、否則 0，以三維歐氏距離作為 proximity），可重現論文描述的 stress contributor 現象（3 個離群物件）。
- **上傳 Proximity Matrix**（CSV／Tab 分隔，n×n）：可含表頭列/欄作為物件名稱；矩陣若不對稱會自動取對稱平均。
- **上傳原始資料矩陣**（CSV／Tab 分隔，列×欄）：可選擇「列為物件 → 算列間歐氏距離（相異度）」或「欄為物件 → 算欄間相關係數（相似度，如論文症狀變項）」兩種轉換方式，預設為「欄為物件」。上傳後會顯示**欄位設定**表格，此表格一律以檔案的**欄**為單位列出（不論目前是哪一種定向），顯示各欄的型態（連續／文字，依是否全部可辨識為數字自動判斷）與範例值，並可逐一指定角色，但角色的意義依定向而不同：
  - **列為物件**時，欄是候選的距離計算變數：「分析」納入歐氏距離計算（僅限連續型欄位可選）、「附加」不參與計算但會顯示在該列（物件）滑鼠懸停的提示文字中（例如國家名稱以外的死亡率、備註等中繼資料）、「忽略」完全不使用。
  - **欄為物件**時，欄本身就是候選的 MDS 物件（例如症狀變項）：「分析」代表該欄要成為一個物件，並以所有列的資料與其他「分析」欄計算相關係數；「忽略」則整欄排除，不使其成為物件；此定向下「附加」選項會隱藏（因為排除的欄沒有可附加的對象）。
  
  角色設定以欄的位置保存，切換定向時不會重置（但「附加」在欄為物件時會顯示為「忽略」，因為附加在該定向下沒有意義，切回列為物件時原本的「附加」設定會還原）。變更角色會立即重新計算，不需重新上傳檔案；若目前沒有任何欄位被設為「分析」會提示錯誤並保留原本的結果。
- 兩種上傳皆支援 `.csv`、`.tsv`、`.txt` 副檔名，分隔符號（逗號或 Tab）會自動偵測檔案第一行，不需另外指定格式。

### MDS 配適
- **配適演算法**：SMACOF 疊代（Guttman transform，論文預設）、Classical MDS（Torgerson，雙重置中特徵分解一步到位）、ALSCAL（SSTRESS 疊代；在歐氏距離下採論文原始 Takane–Young–de Leeuw (1977) 每點 Newton–Raphson 疊代法重建，詳見下）。
- **距離模型**：Euclidean 歐氏距離、City-block 城市街廓（Manhattan）、Minkowski（p 值可調，範圍 1–4）。ALSCAL＋歐氏距離的組態更新改採逐點 Newton–Raphson（解析梯度與 q×q Hessian，Gill–Murray 式正定化＋回溯線搜尋，重建自 Takane, Young, & de Leeuw, 1977, *Psychometrika* 42(1)），因 1977 年原始 FORTRAN 原始碼未公開，屬依論文演算法描述之忠實重建，非逐位元核對之精確複製；ALSCAL＋非歐氏（City-block／Minkowski）距離模型、以及 SMACOF＋非歐氏距離模型，因無對應封閉解析形式，仍採本工具自行實作的梯度下降＋回溯線搜尋法近似重現。歐氏距離＋SMACOF（預設組合）維持論文原始配適法不變。
- 支援非度量（Ordinal / Kruskal 單調迴歸，以 PAVA 實作）與區間（Metric / 線性迴歸）兩種 disparity 配適模式（Classical MDS 不套用此設定）。
- 配適品質指標：STRESS1、STRESS2、SSTRESS、R²，並顯示疊代次數與耗時。
- 物件數較少（n<12）且採非度量配適時會顯示提醒：小樣本下 ordinal 配適容易產生假性低 stress。

### 診斷圖
- **組態圖（Configuration Plot）**：2D 散佈圖，點選物件觸發色彩連動；支援 2D／1D 色暈塗抹（可調整平滑寬度 h）。當熱圖排序法選為最短/最長/平均距離法（階層式聚類）時，可按下「3D 樹狀圖」切換為 3D 檢視：物件仍位於原本 2D 組態座標（Z=0 的地面），該聚類樹（與熱圖的樹狀圖共用同一棵樹）則以其合併距離為高度、往上延伸浮於地面之上；可拖曳滑鼠旋轉視角、按「重置視角」恢復預設角度。3D 模式下，點選葉節點（物件）套用一般的色彩連動；點選內部（合併）節點則會高亮該節點以下的整個子群集（連線與物件加亮、其餘淡化），並於上方顯示子群集的物件數與合併距離，兩種選取彼此互斥。色暈塗抹（2D／1D）於 3D 模式下不再停用，而是將相同的核密度估計結果以貼圖形式投影在地面上，隨視角旋轉同步變形。樹狀圖的分支線改採「直角轉折」（水平＋垂直）畫法，與熱圖旁的 2D 樹狀圖同一慣例：每段分支先沿高度軸垂直上升到父節點的合併距離，再沿地面（X／Y）水平轉向父節點的位置，不再是直接貫穿三軸的斜線；由於整體視角可任意旋轉，這裡的「垂直」線在畫面上恆為真正的垂直線，但「水平」線因為是在傾斜地面上移動，經投影後在畫面上會呈現斜向（與地面格線本身傾斜的道理相同），並非本工具的繪製誤差。此為本工具自行以純 SVG 手刻的正交投影＋滑鼠拖曳旋轉＋地面貼圖仿射變換實作（無外部 3D／WebGL 函式庫依賴）。3D 視角另支援滑鼠滾輪縮放（zoom in／out）：往上滾（遠離自己）拉近、往下滾（靠近自己）拉遠，縮放倍率疊加在原本的自動置中比例之上並限制在 0.3～6 倍之間，與拖曳旋轉互不干擾，按「重置視角」會將縮放倍率一併還原為 1。
- **Proximity Matrix 熱圖（Heatmap）**：以顏色呈現完整 n×n proximity 矩陣，並提供排序（Seriation：原始順序、最短/最長/平均距離法、R2E、隨機）與翻轉（None、R2E 導向、Uncle*、GrandPa*）選單重新排列列/欄以凸顯區塊結構；可切換是否顯示列/欄名稱，點選格子、列名或欄名皆會觸發與組態圖相同的色彩連動。排序／翻轉選單參考 GAP3D（maokao.github.io/GAP3D）之設計，標示 `*` 的兩種翻轉法為本工具依其命名概念自行設計之近似重現。選擇最短/最長/平均距離法（階層式聚類）時，熱圖右側會同步畫出該排序所依據的樹狀圖（dendrogram），每一分支的合併距離即為該連結法下的群聚距離，懸停分支可查看數值；R2E／原始順序／隨機並非由聚類樹產生，不顯示樹狀圖。
- **分解應力比例圖**：依各物件對整體 stress 的貢獻度排序的長條圖，點長條可直接選取該物件。
- **三張配適診斷散佈圖**：Linear Fit（Disparity vs Distance）、Transformation（Proximity vs Disparity）、Nonlinear Fit（Proximity vs Distance）。
- **殘差圖（Residual Plot）**：可拖曳刷選任一區域，選中的點對會在組態圖上畫出連線（紅：距離被高估／藍：距離被低估）；按住 Shift 可多次刷選、疊加多個選取範圍。

### 色階設定（ColorBrewer）
- **相異度色階（Sequential）**：11 種 ColorBrewer 單色漸層（Blues、Greens、Oranges、Purples、Reds、Greys、YlOrRd、YlGnBu、BuPu、GnBu、PuBuGn，皆色盲安全）＋ GAP Rainbow 彩虹色譜（論文與 GAP3D 原始色階，非色盲安全）。
- **相似度色階（Diverging）**：8 種雙色發散色（RdBu、PRGn、PiYG、BrBG、PuOr、RdYlBu、RdYlGn、Spectral）＋ GAP Blue-Red 藍－白－紅（論文與 GAP3D 原始色階，色盲安全）；非色盲安全的選項會於下拉選單中標註提醒。
- 套用範圍涵蓋組態圖、2D/1D 色暈塗抹、Proximity Matrix 熱圖、三張診斷散佈圖與圖例；圖例說明文字會隨所選色階名稱同步更新。
- 深色模式下 ColorBrewer 色階會自動做 HSL 明度反轉，確保在深色背景上仍維持「鮮明＝近／強、融入底色＝遠／弱」的判讀邏輯；GAP 原始色階固定不隨主題翻轉，忠實重現論文原貌。
- 殘差圖的紅／藍固定作為「高估／低估」診斷慣例，不受此設定影響。

## 技術實作

單一自足的 HTML 檔案（無外部 JS 函式庫依賴，僅使用 Google Fonts CDN），所有運算皆在瀏覽器本機完成：

- **MDS 數學核心**：Jacobi 特徵值演算法（classical scaling 初始化、亦重用於 ALSCAL 逐點 Hessian 的正定化）、SMACOF majorization、PAVA（pool-adjacent-violators）等式回歸、ALSCAL 逐點 Newton–Raphson（歐氏距離）；非歐氏距離模型另以梯度下降＋回溯線搜尋近似求解。
- **Seriation 排序演算法**：Lance–Williams 階層式聚類（single／complete／average linkage）、R2E（classical MDS 投影＋角度排序）、以及本工具自行設計之 Uncle／GrandPa 翻轉法。
- **CSV／TSV 解析**：自動偵測表頭列/欄與分隔符號（逗號或 Tab，依檔案第一行判斷），支援 `.csv`、`.tsv`、`.txt`，涵蓋 proximity matrix 與原始資料矩陣兩種格式。
- **色階系統**：ColorBrewer 色階資料 + GAP3D／論文原始色階 + HSL 色彩空間明度反轉，達成亮／暗色模式自適應。
- **響應式版面**：支援桌面與手機寬度，並依 `prefers-color-scheme` 自動切換亮／暗主題。
- **SVG + Canvas 混合渲染**：組態圖與熱圖皆以 SVG 繪製互動元素（資料點、格線、標籤）、以 Canvas 繪製色暈塗抹／色塊底層，兼顧互動性與像素級平滑效果。
- **3D 樹狀圖組態圖**：自行實作之正交投影（orthographic projection，yaw／pitch 兩軸旋轉矩陣）＋ pointer 事件拖曳旋轉＋畫家演算法（painter's algorithm）深度排序，純 SVG 繪製、無外部 3D／WebGL 函式庫依賴。地面（Z=0）上的任一點在此投影下退化為單純 2D 仿射變換，因此色暈塗抹貼圖以一張 `<image>` 搭配對應仿射矩陣直接貼附於地面，貼圖本身（核密度估計結果）僅於選取物件／塗抹模式／頻寬改變時才重新計算並快取，旋轉拖曳時只重新計算貼圖的仿射變換，避免逐幀重算。

## 參考文獻

Chen, C.-H., & Chen, J.-A. (2000). Interactive diagnostic plots for multidimensional scaling with applications in psychosis disorder data analysis. *Statistica Sinica*, 10(2), 665–691.
