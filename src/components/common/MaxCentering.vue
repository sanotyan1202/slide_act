<template>
    <div id="content-container" class="content-container" :style="containerSize">
      <div id="slot-container" class="slot-container" :style="contentAspect">
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

    const slotEl = document.querySelector("#slot-container").children[0];

    let count = 0;
    // slotに入る要素が非同期でサイズ変更される可能性があるのでslot要素を監視する
    const contentObserver = new ResizeObserver((entries, observer) => {
      this.contentWidth = Math.floor(entries[0].contentRect.width);
      this.contentHeight = Math.floor(entries[0].contentRect.height);

      console.log(this.contentWidth)
      console.log(this.contentHeight)
      // 自分自身の変更で無限ループするので適当なところで止める
      count++;
      console.log(count)
      if (count > 10) {
        observer.disconnect();
      }
    });
    contentObserver.observe(slotEl);
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
    contentAspect: function() {    
      return  { 
        '--contentAspect': this.contentWidth + '/' + this.contentHeight
      };
    }
  }
}
</script>

<style>
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
    width: 100%;
    max-height: 100%;
    --contentAspect: 800/450;
    aspect-ratio: var(--contentAspect);
  }
</style>