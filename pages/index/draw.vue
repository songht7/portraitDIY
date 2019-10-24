<template>
  <view class="wrap">
    <view class="wrap-head">
      <text @click="close=false" v-if="close">开启画笔</text>
      <text @click="close=true" v-else class="wrap-head-close">关闭画笔</text>
      <text @click="subCanvas">保存涂鸦</text>
    </view>
    <view
      :key="j"
      v-for="(i,j) in ImageInfo"
      class="handCenter"
      :style="{width:i.cavWidth+'px',height:i.cavHeight+'px'}"
    >
      <!-- 开启 -->
      <!-- 绑定自定义信息 -->
      <!--画笔开始-->
      <!-- 画笔移动 -->
      <!-- 画笔结束 -->
      <!-- canvas的id -->
      <image class="cavImg" :style="{width:i.cavWidth+'px',height:i.cavHeight+'px'}" :src="i.url" />
      <!-- 透明的 canvas-->
      <canvas
        class="myCanvas"
        disable-scroll="true"
        :data-id="j"
        @touchstart="penStart"
        @touchmove="penMove"
        @touchend="penEnd"
        :canvas-id="'myCanvas'+j"
      ></canvas>
      <!-- 为了保证在手机上能正常上下滑动 -->
      <view
        v-show="close"
        class="wrap-index"
        :style="{width:i.cavWidth+'px',height:i.cavHeight+'px'}"
      ></view>
    </view>
    <view v-if="!close&&open" class="marking-tag3">
      <!-- 颜色 -->
      <view class="color">
        <block v-for="i in colorArr" :key="i.color">
          <view :class="{colorSelection:i.active}">
            <view @click="updateColor(i.color)" :style="{background: i.color}"></view>
          </view>
        </block>
      </view>
      <!-- 粗细 -->
      <view class="thickness">
        <view @tap="open=false" class="marking-tag4">收起</view>
        <block v-for="i in thickness" :key="i.thickness">
          <view :class="{colorSelection:i.active}">
            <view @click="updateThickness(i.thickness)" :style="{height: i.thickness/5+'rpx'}"></view>
          </view>
        </block>
      </view>
      <!-- 擦除 -->
      <view class="Erase">
        <view @click="retDraw" style="color:red">清除</view>
      </view>
    </view>
    <view v-else-if="!close&&!open" @tap="open=true" class="marking-tag2">展开</view>
  </view>
</template>

<script>
import Mycanvas from "../../static/js/handwriting.js";
export default {
  data() {
    return {
      close: true,
      open: true,
      colorArr: [
        //画笔颜色
        { color: "#ff0000", active: true },
        { color: "#1c9d02", active: false },
        { color: "#000000", active: false },
        { color: "#006ce6", active: false },
        { color: "#efaa03", active: false }
      ],
      thickness: [
        //画笔粗细
        { thickness: 10, active: false },
        { thickness: 20, active: false },
        { thickness: 30, active: true },
        { thickness: 40, active: false },
        { thickness: 50, active: false }
      ],
      //当前的图片路径
      answerPhoto: ["/static/img/img3.jpg", "/static/img/img2.jpg"],
      // 保存图片、画布宽高
      ImageInfo: [],
      // new出来的实例
      canvasInfo: [],
      // 有涂鸦的图片的下标
      imgIndex: [],
    };
  },
  onReady() {
    // 获取图片信息
    this.getImageInfo();
  },
  watch: {
    // new出canvas的实例
    ImageInfo(ImageInfo) {
      this.ImageInfo.map((i, j) => {
        this.canvasInfo.push(
          new Mycanvas({
            lineColor: this.lineColor,
            lineSise: this.lineSise,
            canvasName: "myCanvas" + j,
          })
        );
      });
    }
  },
  computed: {
    //颜色
    lineColor: {
      get() {
        let [color] = this.colorArr.filter(i => i.active);
        return color.color;
      }
    },
    //粗细
    lineSise: {
      get() {
        let [thicknes] = this.thickness.filter(i => i.active);
        return thicknes.thickness;
      }
    }
  },
  methods: {
    // 获取图片信息
    async getImageInfo() {
      let newArr = [];
      for (let i = 0; i < this.answerPhoto.length; i++) {
        let [, image] = await uni.getImageInfo({ src: this.answerPhoto[i] });
        newArr.push({
          url: this.answerPhoto[i],
          cavWidth: this.widths(image.width),
          cavHeight: this.heights(image.height, image.width),
          imgWidth: image.width,
          imgHeight: image.height
        });
      }
      this.ImageInfo = newArr;
    },
    //计算宽
    widths(imgWidth) {
      const res = uni.getSystemInfoSync();
      //屏幕宽
      if (res.windowWidth * 0.95 <= imgWidth) {
        return res.windowWidth * 0.95; //rpx
      } else {
        return imgWidth;
      }
    },
    //计算高
    heights(imgHeight, imgWidth) {
      const res = uni.getSystemInfoSync();
      if (res.windowWidth * 0.95 <= imgWidth) {
        let b = (res.windowWidth * 0.95) / imgWidth;
        return b * imgHeight;
      } else {
        return imgHeight;
      }
    },
    // 笔迹粗细滑块
    updateThickness(value) {
      this.canvasInfo.map(i => {
        i.selectSlideValue(value);
      });
      this.thickness.map(i => {
        if (i.thickness == value) {
          i.active = true;
        } else {
          i.active = false;
        }
        return i;
      });
    },
    // 选择画笔颜色
    updateColor(color) {
      this.canvasInfo.map(i => {
        i.selectColorEvent(color);
      });
      this.colorArr.map(i => {
        if (i.color == color) {
          i.active = true;
        } else {
          i.active = false;
        }
        return i;
      });
    },
    // 清除画布
    retDraw() {
      this.canvasInfo.map(i => {
        i.retDraw();
      });
    },
    // 笔迹开始
    penStart(event) {
      if (this.close) return;
      let index = "";
      //#ifdef H5
      index = event.currentTarget.dataset.id;
      //#endif

      // #ifdef  MP-WEIXIN
      index = event.target.dataset.id;
      // #endif
      // 涂鸦后的下标
      this.imgIndex.push(index);
      this.canvasInfo[index].penStart(event);
    },
    // 笔迹移动
    penMove(event) {
      if (this.close) return;
      let index = "";
      // #ifdef  MP-WEIXIN
      index = event.target.dataset.id;
      // #endif
      //#ifdef H5
      index = event.currentTarget.dataset.id;
      //#endif
      this.canvasInfo[index].penMove(event);
    },
    // 笔迹结束
    penEnd(event) {
      if (this.close) return;
      let index = "";
      // #ifdef  MP-WEIXIN
      index = event.target.dataset.id;
      // #endif
      //#ifdef H5
      index = event.currentTarget.dataset.id;
      //#endif
      this.canvasInfo[index].penEnd(event);
    },
    // 保存涂鸦的图片
    async subCanvas() {
      let index = [...new Set(this.imgIndex)];
      if (index.length !== 0) {
        for (let i = 0; i < index.length; i++) {
          // h5环境下为base
          const data = await this.canvasInfo[index[i]].saveCanvas();
          console.log(data);
          
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.colorSelection {
  background: #ccc;
}
.wrap {
  width: 100%;
  height: 100%;
  margin: 30upx 0;
  overflow: hidden;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  font-size: 28upx;
  .marking-tag2 {
    position: fixed;
    right: 0;
    z-index: 10;
    bottom: 280rpx;
    background-color: #fff;
    padding: 5rpx 10rpx;
  }
  .marking-tag3 {
    position: fixed;
    right: 0;
    bottom: 210rpx;
    z-index: 10;
    .Erase {
      display: flex;
      justify-content: space-between;
      background: #fff;
      > view {
        padding: 15rpx 0;
        text-align: center;
        flex-grow: 1;
      }
    }
    .color {
      display: flex;
      .colorSelection {
        background: #ccc;
      }
      > view {
        background: #fff;
        padding: 15rpx 30rpx;
        > view {
          width: 25rpx;
          height: 25rpx;
          border-radius: 50%;
        }
      }
    }
    .thickness {
      display: flex;
      justify-content: space-between;
      background: #fff;
      position: relative;
      > view {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20rpx 0;
        > view {
          width: 40rpx;
          background: #666;
        }
      }
      .marking-tag4 {
        position: absolute;
        background: #fff;
        left: 0;
        padding: 5rpx 15rpx;
        transform: translateX(-100%);
      }
    }
  }
  .wrap-head {
    display: flex;
    padding: 0 5rpx;
    justify-content: center;
    .wrap-head-close {
      background: #8799a3;
    }
    text {
      background-color: #39b54a;
      color: white;
      border-radius: 5upx;
      font-size: 30rpx;
      padding: 10rpx 15rpx;
      margin: 15rpx;
    }
  }
  .myCanvas {
    // background: transparent;
    width: 100%;
    height: 100%;
  }
  .handCenter {
    border: 4upx dashed #e9e9e9;
    flex: 5;
    overflow: hidden;
    background: transparent;
    box-sizing: border-box;
    max-width: 95%;
    margin: 5rpx auto;
    position: relative;
    z-index: 2;
  }
  .cavImg {
    position: absolute;
    z-index: -1;
  }
  .wrap-index {
    position: absolute;
    z-index: 10;
    top: 0;
    background-color: transparent;
  }
}
</style>
