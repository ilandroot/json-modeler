# json-modeler (Minimal JSON Modeling Tool)

json-modeler は、JSON モデリングの構造と意味を直感的に理解するための  
**最小構成の GUI ツール**です。

ノードとエッジを使ってモデルを作成し、  
include / ref / *object<> / array<> の意味論に基づいて  
JSON を自動生成します。

本バージョンは、極力、他ライブラリへの依存を削ぎ落とし、  
**1 ファイル（json-modeler.html）で動作するシンプルな構成**になっています。

---

## ■ 特徴

- `json-modeler.html` 1 ファイルで動作  
- include / ref / *object<> / array<> の意味論を忠実に反映  
- ノードとエッジによる直感的なモデリング  
- JSON 自動生成  
- バリデーション機能  
- Windows では `web.bat` により簡単起動が可能  

---

## ■ ファイル構成

```
json-modeler/
├─ json-modeler.html ← 本体（1 ファイルで動作）
├─ web.bat ← Windows 用起動スクリプト
├─ README.md
├─ docs/
│  ├─ json-modeler-background.pdf ← JSON モデリングの背景説明
│  └─ graph_script_spec.pdf ← Graph Scriptの資料
└─ example/
   ├─ mk_graph_script.bat ← Graph Scriptファイルを作成するバッチファイル
   ├─ graph-script-futoshiki.txt ← 不等式のGraph Scriptファイル例
   └─ graph-script-sudoku.txt ← 数独のGraph Scriptファイル例
```
 example/mk_graph_script.bat は、引数にモデル名を指定して実行します。
---

## ■ 起動方法（Windows）

zip を展開し、web.bat をダブルクリックしてください。
ブラウザが自動的に開き、json-modeler が起動します。

---

## ■ 注意事項

`web.bat` は `live-server` を使用しています。  
これは Node.js 上で動作するため、  
**Node.js がインストールされている必要があります。**

---

## ■ Node.js / live-server のインストール方法

### 1. Node.js をインストールする

- https://nodejs.org/  
- 「LTS（推奨版）」をダウンロード  
- インストーラの指示に従って進める  

インストール後、Node.js、npm の versionは、以下で確認できます：  
node -v  
npm -v  
実行例:
```
>node -v  
v22.14.0  
>npm -v  
11.1.0  
```
### 2. live-server をインストールする

npm install -g live-server


---

## ■ 使用しているライブラリ

json-modeler は以下のライブラリを CDN 経由で利用しています。

- **Cytoscape.js**  
  グラフ描画およびノード・エッジのレイアウトに使用  
  https://js.cytoscape.org/

---

## ■ ライセンス

MIT

---

## ■ ドキュメント

- [JSONデータモデリング背景説明 PDF](docs/json-modeler-background.pdf)
- [Graph Scriptの資料](docs/graph_script_spec.pdf)

## Author
Jsonic Lab  
Developer of json-modeler

