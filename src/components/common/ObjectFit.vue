<template>
    <div id="content-container" class="content-container" :style="containerSize">
      <div id="slot-container" class="slot-container" :style="slotSize">
          <slot  />
      </div>
    </div>
</template>

<script>

export default {

  data: function() {
    return {
      containerWidth: 100,
      containerHeight: 100,
      contentWidth: 100,
      contentHeight: 100,
    }
  },

  mounted: function() {

    // コンテナのサイズを親要素に合わせる
    this.resizeContainer();

    // PDF（コンテンツ）のサイズ取得
    // ただしmounted時はPDFのサイズが100/50であり、その後自動調整されるので、
    // 自動調整を監視して、サイズを取得し直す
    const contentEl = document.querySelector("#slot-container").children[0];
    const slotObserver = new ResizeObserver((entries) => {
      console.log(entries);
      console.log("objectFit  :  " + this.contentWidth + "/" + this.contentHeight)

      let changedContentWidth = Math.floor(entries[0].contentRect.width);
      let changedContentHeight = Math.floor(entries[0].contentRect.height);

      // 誤差レベルのサイズ変更で無限ループするので小さい差は無視
      if(Math.abs(this.contentWidth - changedContentWidth) < 5 && Math.abs(this.contentHeight - changedContentHeight) < 5) {
        return;
      }

      this.contentWidth = Math.floor(entries[0].contentRect.width);
      this.contentHeight = Math.floor(entries[0].contentRect.height);

    });
    slotObserver.observe(contentEl);


    // 親要素のサイズ変更を監視し、コンテナを親要素のサイズに常に合わせる
    const parentEl = document.querySelector("#content-container").parentElement;
    const parentObserver = new ResizeObserver((entries) => {
      this.containerWidth = Math.floor(entries[0].contentRect.width);
      this.containerHeight = Math.floor(entries[0].contentRect.height);
    });
    parentObserver.observe(parentEl);
  },


  methods: {

    resizeContainer: function() {
      const parentEl = document.querySelector("#content-container").parentElement;

      // コンテナを親要素の幅に合わせる
      this.containerWidth = parentEl.clientWidth;
      this.containerHeight = parentEl.clientHeight;
    },
  },

  computed : {
    containerSize: function() {
      return {
        '--containerWidth': this.containerWidth + 'px',
        '--containerHeight': this.containerHeight + 'px',
       };
    },
    slotSize: function() {
      // コンテナの方が横広の場合
      if (this.containerAspect > this.contentAspect) {
        return {
          '--contentWidth': 'none',
          '--contentHeight': this.containerHeight + 'px',
          '--contentAspect': this.contentWidth +  '/' + this.contentHeight
        };
      // コンテナの方が縦長の場合
      } else {
        return {
          '--contentWidth': this.containerWidth + 'px',
          '--contentHeight': 'none',
          '--contentAspect': this.contentWidth +  '/' + this.contentHeight
        };
      }
    },
    containerAspect: function() {    
      return  this.containerWidth / this.containerHeight;
    },
    contentAspect: function() {    
      return this.contentWidth / this.contentHeight;
    }
  }
}
</script>

<style scoped>
  .content-container {
    box-sizing: border-box;
    --containerWidth: 0px;
    --containerHeight: 0px;
    width: var(--containerWidth);
    height: var(--containerHeight);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slot-container {
    position: absolute;
    --contentWidth: 0px;
    --contentHeight: 0px;
    width: var(--contentWidth);
    height: var(--contentHeight);
    --contentAspect: 2/1;
    aspect-ratio: var(--contentAspect);
  }
</style>