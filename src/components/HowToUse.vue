<template>
  <div id="how-to-use" class="how-to-use">
    <div class="container">
      <div class="row title-container">
        <h4 class="sub-title">使い方</h4>
        <div class="description">
          <div class="row">
            <div class="twelve columns">
              <p>Slide Actは4ステップで簡単に使用することができます。</p>
              <div id="step1" class="how-to-step">
                <h5>Step1. プレゼン資料をPDFに変換</h5>
                <p>PowerPointなどでスライドを作成し、エクスポート機能でPDFに変換してください。</p>
                <p>対応ソフトは以下の通りです。</p>
                <ul>
                  <li>Microsoft Power Point</li>
                  <li>Google Slide</li>
                  <li>beautiful.ai</li>
                </ul>
              </div>
              <div id="step2" class="how-to-step">
                <h5>Step2. Slide Actにアップロード</h5>
                <p>次にPDFをアップロードします。</p>
                <p>枠内にドラッグ&ドロップをするか、ボタンを押してファイルを選択してください。</p>
                <p><img src="img/slideact.png" class="how-to-use-image" /></p>
              </div>
              <div id="step3" class="how-to-step">
                <h5>Step3. 閲覧用URLを参加者に共有</h5>
                <p>PDFをアップロードすると、閲覧用URLが表示されます。</p>
                <p>プレゼンを開始する前に参加者に閲覧用URLを配布してください。</p>
                <p><img src="img/browserurl.png" class="how-to-use-image" /></p>
                <p>閲覧用URLにアクセスすると参加者用のサイトが表示されます。</p>
                <p><img src="img/browserscreen.png" class="how-to-use-image" /></p>
                <p>参加者は名前とメッセージを入力し、Enterキーで送信することができます。</p>
              </div>
              <div id="step4" class="how-to-step">
                <h5>Step4. スライドショーの開始</h5>
                <p>最後にActボタンを押すとスライドショーが実行されます。（Escで終了）</p>
                <p>それでは、いつもより活性化したプレゼンをお楽しみください。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#usable {
  text-align:left;
}

.title-container {
  padding-top:100px;
  margin-bottom: 50px;
}

.how-to-use-image {
  width: 65%;
  box-shadow: 2px 2px 2px 2px gray;
}

.how-to-step {
  margin-top:80px;
}
</style>