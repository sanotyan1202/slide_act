<template>
<div id="features">
  <div class="title-container">
    <h1 class="top-message">
    What is Slide Act?
    </h1>
    <p class="sub-message">プレゼンがリモートだと参加者の反応も無いし、イマイチ盛り上がらない...</p>
    <p class="sub-message">Slide Actはそんな悩みを解決します！</p>
  </div>
  <div class="feature-container">
    <div class="feature-description-container">
      <h1 class="feature-title">リアルタイムにスライドを参加者と共有</h1>
      <p class="description">
        発表者がスライドを進めると、連動して参加者の画面でもスライドが進みます。<br/>
        <span class="underline bold">リモートでも同じ画面を共有する</span>ことができます。
      </p>
    </div>
    <div class="feature-image-container">
      <div>
        <p class="image-title">発表者の画面</p>
        <img class="feature" src="img/feature01presenter.jpeg" alt="発表者の画面">
      </div>
      <div>
        <img class="relation" src="img/interlock-right.png" alt="連動">
      </div>
      <div>
        <p class="image-title">参加者の画面</p>
        <img class="feature" src="img/feature01participant.png" alt="参加者の画面">
      </div>
    </div>
    <div class="feature-description-container">
      <h1 class="feature-title">メッセージング機能で双方向コミュニケーション</h1>
      <p class="description">
        メッセージを送信すると、発表者含め全員にメッセージが共有されます。<br/>
        <span class="underline bold">質問に回答</span>してもらったり、<span class="underline bold">感想をつぶやいて</span>もらったり、使い方はあなたの発想次第。
      </p>
    </div>
    <div class="feature-image-container">
      <div>
        <p class="image-title">参加者の画面</p>
        <img class="feature" src="img/feature02participant.png" alt="参加者の画面">
      </div>
      <div>
        <img class="relation" src="img/send-right.png" alt="連動">
      </div>
      <div>
        <p class="image-title">発表者の画面</p>
        <img class="feature" src="img/feature02presenter.jpeg" alt="発表者の画面">
      </div>
    </div>
    <div class="feature-description-container">
      <h1 class="feature-title">スマホからもメッセージが送れるのでPCがなくても参加できる</h1>
      <p class="description">
        対面でプレゼンする場合は参加者にPCが無いこともあると思います。<br/>
        そんな時は<span class="underline bold">スマホからメッセージを送る</span>ことで、Slide Actを活用できます。
      </p>
    </div>
    <div class="feature-image-container">
      <div>
        <p class="image-title">参加者の画面</p>
        <img class="feature smartphone" src="img/feature03participant.png" alt="発表者のスライド">
      </div>
      <div>
        <img class="relation" src="img/send-right.png" alt="連動">
      </div>
      <div>
        <p class="image-title">発表者の画面</p>
        <img class="feature" src="img/feature03presenter.jpeg" alt="参加者の画面">
      </div>
    </div>
    <div class="feature-description-container">
      <p class="description">
        それではいつもより楽しくなったプレゼンをお楽しみください。
      </p>
      <p class="to-top" @click="scrollTop">
        トップへ
      </p>
    </div>
  </div>
</div>
</template>

<script>
export default {
 methods: {
    scrollTop: function(){
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
}
</script>


<style scoped>

#features {
  margin-top: 8rem;
}

.title-container {
  background-color: #80808014;
  margin: 0 calc(50% - 50vw);
  width: 100vw;
  padding: 2rem 0 2rem 0;
}

.top-message {
  font-size: 2.8rem;
  margin-bottom: 4rem;
}

.sub-message {
  font-size: 1.5rem;  
}

.feature-container {
  display: flex;
  flex-direction: column;
  margin-top: -1rem;
}

.feature-description-container {
  margin-top: 7rem; 
}

.feature-image-container {
  display: flex;
  flex-direction: row;  
  justify-content: center;
  margin-top: 1rem;
}

.feature-title {
  margin-bottom: 3rem;
}

p.description {
  font-size:1.3rem;
  line-height:2.5rem;
}

img.feature {
  width: 30rem;
  box-shadow: 2px 2px 2px 2px gray;
}

img.feature.smartphone {
  width: 10rem;
  box-shadow: none !important;
}


img.relation {
  width: 5rem;
  margin: 9rem 2rem 0 2rem;
}

.image-title {
  font-weight: bold;
  font-size:1.2rem;
}

.to-top:hover {
  cursor: pointer;
}
</style>