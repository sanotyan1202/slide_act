<template>
  <div id="pdf-uploader"
       @dragover.prevent="dragging = true"
       @dragleave.prevent="dragging = false"
       @drop.prevent="onDrop">
    <div v-show="!uploading" class="drop" :class="{dragging: dragging}">
      <p class="drag-drop-info">ここにPDFファイルをドラック&amp;ドロップ</p>
      <p>または</p>
      <label for="local_file_selector" class="select-file">
        ファイルを選択
        <input type="file" style="display:none;" id="local_file_selector" accept=".pdf" @change="onDrop" />
      </label>
    </div>
    <Loading class="loading" v-show="uploading"></Loading>
  </div>
</template>

<script>
import utils from '@/common/utils';
import db from '@/firebase/firestore';
import analytics from '@/firebase/analytics';
import storage from '@/firebase/storage';
import Loading from '@/components/utils/Loading';

export default {

  components: {
    Loading
  },

  data: function() {
    return {
      message: '',
      dragging: false,
      uploading: false,
    }
  },

  methods: {
    
    // ドロップされたファイルをStorageに保存
    // ファイル情報をFireStoreに登録
    onDrop: async function() {

      this.message = '';
      this.dragging = false;

      // ドラッグされた、または選択されたファイルを取得
      const files = event.target.files ? event.target.files : event.dataTransfer.files;

      // ファイルが1つ以外の場合は終了
      if (files.length !== 1) {
        return;
      }

      if (files[0].size > 50 * 1024 * 1024) {
        alert("50MB以下のPDFのみアップロード可能です。");
        return;
      }
      
      // ローディングコンポーネントを表示
      this.uploading = true;

      const userId = localStorage.userId;
      // 一意なファイル名を生成
      const filename = utils.generateUuid();
      const filepath = `pdf/${userId}/${filename}`;

      // ファイルをアップロード
      const snapshot = await storage.ref(filepath).put(files[0]);

      // ファイルのアップロードURLを取得
      const url = await snapshot.ref.getDownloadURL();

      // firestoreにPDF情報を登録
      let slide = {
        url: url,
        file: filename,
        createdAt: new Date
      };
      const slideRef = db.collection('slides');
      const docRef = await slideRef.add(slide);

      // 新規登録されたIDを設定
      slide.id = docRef.id;

      // ローディングコンポーネントを非表示
      this.uploading = false;

      // 親にスライドIDを渡す
      this.$emit('give-slide', slide);

      analytics.logEvent('share', {
        content_type: 'slide',
        item_id: slide.id,
      })
    },
  }
};
</script>
<style scoped>
#pdf-uploader {
  height: 8rem;
  width: 25rem;
  left: 0;
  right: 0;
  margin: auto;
}

.drop {
  border: 3px dashed #2c3e5082;
  padding: 1rem;
  text-align: center;
}

.dragging {
  border: 4px dashed #2c3e50b0;
}

.select-file {
  background-color: #58c4f0;
  width: 80rem;
  padding: 7px;
  color: white;
  border-radius: 4px;
  display:initial;
}

.select-file:hover {
  background-color: #4eb4dc;
  cursor: pointer;
}

.loading {
  padding-top: 2rem;
}
</style>