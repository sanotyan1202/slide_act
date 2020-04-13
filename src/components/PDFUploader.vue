<template>
  <div :class="[{'-drag': isDrag == 'new'}]"
    @dragover.prevent="checkDrag($event, 'new', true)"
    @dragleave.prevent="checkDrag($event, 'new', false)"
    @drop.prevent="onDrop">
    <div class="drop">
      <p class="drag-drop-info">ここにPDFファイルをドロップ</p>
      <p>または</p>
      <label for="local_file_selector" class="select-file">
        ファイルを選択
        <input type="file" style="display:none;" id="local_file_selector" accept=".pdf" @change="onDrop" />
      </label>
    </div>
  </div>
</template>
 
<script>
export default {

  data() {
    return {
      isDrag: null
    }
  },

  methods: {
    
    checkDrag(event, key, status) {
      this.isDrag = status ? key : null
    },

    onDrop () {

      this.isDrag = null

      // ドラッグされた、または選択されたファイルを取得
      let files = event.target.files ? event.target.files : event.dataTransfer.files;

      // ファイルが無い場合は終了
      if(files.length == 0) return false

      // 1ファイルのみ送ることにする
      let file = files.length > 0 ? files[0] : [];

      let fd   = new FormData(); //★②
      fd.append('file', file);
    }
  }
};
</script>

<style>

.drop {
  border: 2px dashed #2c3e50b0;
  padding: 20px;
}

.select-file {
  background-color: #58c4f0;
  width: 120px;
  padding: 7px;
  color: white;
  border-radius: 4px;
  display:initial;
}
.select-file:hover {
  background-color: #4eb4dc;
  cursor: pointer;
}
</style>