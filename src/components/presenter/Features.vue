<template>  
<div class="flex-col">
  <div class="flex-row">
    <div class="flex-item desc">
      <h2>リアルタイムにスライドを<br/>参加者と共有</h2>
      <p>発表者がスライドを進めると、参加者の画面でも自動的に同じスライドが表示されます。</p>
    </div>
    <div class="flex-item image">
      2
    </div>
  </div>
  <div class="flex-row">
    <div class="flex-item image">
      3
    </div>
    <div class="flex-item desc">
      <h2>メッセージング機能で<br/>双方向コミュニケーション</h2>
      <p>質問に回答してもらったり、感想をつぶやいてもらったり、あなたの発想次第で無限の使い方が考えられます。</p>
    </div>
  </div>
  <div class="flex-row">
    <div class="flex-item desc">
      <h2>スマホからも参加できるので対面でPCがなくても問題なし</h2>
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
  padding: 2rem;
  text-align: left;
}


</style>