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
      slotWidth: 100,
      slotHeight: 100,
    }
  },

  mounted: function() {

    // コンテナのサイズを親要素に合わせる
    this.resizeContainer();

    // slotに入る要素が非同期でサイズ変更される可能性があるのでslot要素を監視する
    const slotEl = document.querySelector("#slot-container").children[0];
    let count = 0;
    const slotObserver = new ResizeObserver((entries, observer) => {
      this.slotWidth = Math.floor(entries[0].contentRect.width);
      this.slotHeight = Math.floor(entries[0].contentRect.height);

      // 自分自身の変更で無限ループするので適当なところで止める
      count++;
      if (count > 10) {
        observer.disconnect();
      }
    });
    slotObserver.observe(slotEl);

    // 親要素のサイズ変更を監視する
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
    contentAspect: function() {    
      return  { 
        '--contentAspect': this.slotWidth + '/' + this.slotHeight
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
    --contentAspect: 2/1;
    aspect-ratio: var(--contentAspect);
  }
</style>