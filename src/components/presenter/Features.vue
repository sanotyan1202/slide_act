<template>  
<div class="flex-col">
  <div class="flex-row">
    <div class="flex-item desc">
      <h1>リアルタイムにスライドを<br/>参加者と共有</h1>
      <p class="description">発表者がスライドを進めると、参加者の画面でも自動的に同じスライドが表示されます。</p>
    </div>
    <div class="flex-item image">
      <img class="feature" src="img/feature01presenter.png" alt="スライドの連動">
      <img class="feature" src="img/feature01participant.png" alt="スライドの連動">
    </div>
  </div>
  <div class="flex-row">
    <div class="flex-item image">
      3
    </div>
    <div class="flex-item desc">
      <h1>メッセージング機能で<br/>双方向コミュニケーション</h1>
      <p class="description">質問に回答してもらったり、感想をつぶやいてもらったり、あなたの発想次第で無限の使い方が考えられます。</p>
    </div>
  </div>
  <div class="flex-row">
    <div class="flex-item desc">
      <h1>スマホからメッセージが送れる<br/>のでPCがなくても参加できる</h1>
      <p class="description">対面でプレゼンする場合は参加者にPCが無いこともあると思います。そんな時はスマホからメッセージを送ってもらうことで、Slide Actを活用できます。</p>
    </div>
    <div class="flex-item image">
      6
    </div>
  </div>
</div>
</template>
<style scoped>

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
  height: 40rem;
  justify-content: space-around;
}

.flex-item {
  width: 30rem;
}

.flex-item.desc {
  text-align: left;
}

p.description {
  font-size:1.2rem;
}

img.feature {
  width: 100%;
}

</style>