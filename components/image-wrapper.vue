<template>
	<view id="CanvaBox">
		<view id="ImageWrapper" class="imageWrapper">
			<movable-area :out-of-bounds="outOfBounds">
				<!-- 头像 -->
				<block v-if="imgBgEdit">
					<movable-view class="maskImg porMask" id="Maskpor" :style="{'z-index':stackLow}" v-if="imgBg.src"
						direction="all" :out-of-bounds="outOfBounds" scale scale-min="0.5" scale-max="10" x="100"
						y="300" :scale-value="imgBg.scale" @scale="onScale" @change="getPosition" data-type='imgBg'
						data-key="1">
						<view class="maskImgBlock">
							<img :class="['real_pic','maskImgs','maskImgs-por',editType==='por'?'imgBorder':'']"
								:style="{'transform':'rotate('+imgBg.rotate+'deg)'}" :src="imgBg.src"
								@touchstart="touch('por')" />
							<view class="edit-btn edit-pinch edit-set-rotate-right" v-show="editType==='por'"
								@click.stop.prevent="editImg('rotateRight','por')">↺</view>
							<view class="edit-btn edit-pinch edit-set-rotate" v-show="editType==='por'"
								@click.stop.prevent="editImg('rotate','por')">↻</view><!-- ↻↺ -->
							<view class="edit-btn edit-pinch edit-set-small" v-show="editType==='por'"
								@click.stop.prevent="editImg('setSmall','por')">━</view>
							<view class="edit-btn edit-pinch edit-set-big" v-show="editType==='por'"
								@click.stop.prevent="editImg('setBig','por')">✚</view>
						</view>
					</movable-view>
				</block>
				<block v-else>
					<movable-view class="imgbg" scale v-if="imgBg.src" direction="all" :out-of-bounds="outOfBounds">
						<image :src="imgBg.src" mode="aspectFill" class="real_pic"></image>
					</movable-view>
				</block>
				<!-- 相框 -->
				<movable-view class="imgbg frame" v-if="frame" direction="all" :out-of-bounds="outOfBounds"
					@tap="imgStackLow('low')">
					<img class="real_pic" :src="frame" />
				</movable-view>
				<!-- 饰品 -->
				<block v-if="maskImg.length" v-for="(img,k) in maskImg" :key="k">
					<movable-view v-if="img.delt===0" :id="['Mask'+k]" class="maskImg" direction="all"
						:out-of-bounds="outOfBounds" scale scale-min="0.5" scale-max="4" x="100" y="100"
						:scale-value="img.scale" @scale="onScale">
						<view class="maskImgBlock">
							<view class="edit-btn edit-del" v-show="editType===k"
								@click.stop.prevent="editImg('delt',k)">✘</view>
							<img :src="img.url" :class="['maskImgs','maskImgs-'+k,editType===k?'imgBorder':'']"
								:style="{'transform':'rotate('+img.rotate+'deg)'}" alt="" @touchstart="touch(k)">
							<view class="edit-btn edit-pinch edit-set-rotate-right" v-show="editType===k"
								@click.stop.prevent="editImg('rotateRight',k)">↺</view>
							<view class="edit-btn edit-pinch edit-set-rotate" v-show="editType===k"
								@click.stop.prevent="editImg('rotate',k)">↻</view><!-- ↻↺ -->
							<view class="edit-btn edit-pinch edit-set-small" v-show="editType===k"
								@click.stop.prevent="editImg('setSmall',k)">━</view>
							<view class="edit-btn edit-pinch edit-set-big" v-show="editType===k"
								@click.stop.prevent="editImg('setBig',k)">✚</view>
						</view>
					</movable-view>
				</block>
				<!-- 站点二维码 -->
				<block v-if="waterState">
					<movable-view class="watermark" x="0" y="600" scale :scale-value="wmSize" scale-min="0.1">
						<img class="watermarkImg" :src="watermark" /><!-- style="opacity:0.5" -->
					</movable-view>
				</block>
				<!-- slot -->
				<block v-if="slots">
					<movable-view direction="all" :out-of-bounds="outOfBounds">
						<slot></slot>
					</movable-view>
				</block>
			</movable-area>
		</view>
	</view>
</template>

<script>
	const hammer = require("@/common/hammer.min.js");
	export default {
		name: 'imageWrapper',
		props: {
			imgBg: {
				type: Object,
				default () {
					return {};
				}
			},
			imgBgEdit: {
				type: Boolean,
				default: false
			},
			watermark: {
				type: String,
				default: ''
			},
			waterState: {
				type: Boolean,
				default: false
			},
			wmSize: {
				type: String,
				default: "0.5"
			},
			outOfBounds: {
				type: Boolean,
				default: true
			},
			frame: {
				type: String,
				default: ''
			},
			maskImg: Array,
			slots: {
				type: String,
				default: ''
			},
			data: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		data() {
			return {
				editType: "",
				hammerVal: "",
				scale: 1,
				old: {
					scale: 1
				},
				stackLow: 0
			};
		},
		onShow() {},
		computed: {},
		methods: {
			touch(k) {
				console.log(k)
				var that = this;
				var id = "Mask" + k;
				console.log(id)
				var myElement = document.getElementById(id);
				var mc = new Hammer(myElement);
				// var pinch = new Hammer.Pinch();
				// var rotate = new Hammer.Rotate();
				// pinch.recognizeWith(rotate);
				// mc.add([pinch, rotate]);
				// mc.on("pinch rotate", function(ev) {
				mc.get('pinch').set({
					enable: true
				});
				mc.get('rotate').set({
					enable: true
				});
				mc.on("pinch rotate", function(ev) {
					that.hammerVal = ev.type;
					//console.log(ev)
					//myElement.textContent += ev.type + " ";
				});
				this.editType = k;
			},
			imgStackLow(v) {
				//照片叠低
				this.stackLow = this.stackLow >= 50 ? 0 : 50;
			},
			editImg(type, k) {
				var that = this;
				//console.log(type, k)
				switch (type) {
					case "delt":
						that.maskImg.map((item, key) => {
							if (key === k) {
								item['delt'] = 1;
							}
						});
						//that.maskImg.splice(that.maskImg.findIndex((item, key) => key === k), 1)
						break;
					case 'setSmall':
						if (that.editType == 'por') {
							that.imgBg.scale = that.imgBg.scale - 0.1
						} else {
							that.maskImg.map((item, key) => {
								if (key === k) {
									item.scale = item.scale - 0.1
								}
							})
						}
						break;
					case 'setBig':
						if (that.editType == 'por') {
							that.imgBg.scale = that.imgBg.scale + 0.1
						} else {
							that.maskImg.map((item, key) => {
								if (key === k) {
									item.scale = item.scale + 0.1
								}
							})
						}
						break;
					case 'rotate':
						if (that.editType == 'por') {
							that.imgBg.rotate = that.imgBg.rotate + 5
						} else {
							that.maskImg.map((item, key) => {
								if (key === k) {
									item.rotate = item.rotate + 5
								}
							})
						}
						break;
					case 'rotateRight':
						if (that.editType == 'por') {
							that.imgBg.rotate = that.imgBg.rotate - 5
						} else {
							that.maskImg.map((item, key) => {
								if (key === k) {
									item.rotate = item.rotate - 5
								}
							})
						}
						break;
					default:
						break;
				}
			},
			onScale: function(e) {
				this.old.scale = e.detail.scale
			},
			getPosition(e) {
				// console.log(e)
				let type = e.currentTarget.dataset.type;
				let key = e.currentTarget.dataset.key;
				// this.setPosition(type, key, e.detail)
			},
			setPosition(type, key, dtl) {
				let that = this;
				switch (type) {
					case "imgBg":
						that.imgBg.position = dtl;
						console.log(that.imgBg)
						break;
					default:
						break;
				}
			}
		}
	}
</script>


<style>
	#CanvaBox {
		height: 100%;
		width: 100%;
		border: 1px solid #eee;
	}

	#ImageWrapper {
		height: 100%;
		width: 100%;
		background: #FFFFFF;
	}

	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 100upx;
		/* min-height: 150upx; */
		background-color: none;
		color: #fff;
	}

	movable-view.watermark {
		min-width: 150upx;
		min-height: 150upx;
	}

	.maskImgBlock {
		position: relative;
		width: 100%;
	}

	img.maskImgs {
		max-width: none;
		position: relative;
		left: -50%;
		width: 200%;
	}

	.edit-btn {
		position: absolute;
		top: -30upx;
		left: -30upx;
		color: #f40;
		z-index: 2;
	}

	.edit-del,
	.edit-pinch {
		background: rgba(243, 58, 0, 0.6);
		color: #FFFFFF;
		border-radius: 50%;
		overflow: hidden;
		font-size: 24upx;
		width: 40upx;
		height: 40upx;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		align-content: center;
	}

	.edit-pinch {
		top: auto;
		left: auto;
		right: -20upx;
		bottom: -20upx;
	}

	.edit-set-small {
		bottom: -20upx;
		left: auto;
		right: -30upx;
	}

	.edit-set-big {
		bottom: -20upx;
		top: auto;
		left: auto;
		right: 20upx;
	}

	.edit-set-rotate {
		top: -30upx;
		left: auto;
		right: -30upx;
	}

	.edit-set-rotate-right {
		top: -30upx;
		left: auto;
		right: 20upx;
	}

	.imgBorder {
		border: 1px solid #FF4400;
	}

	.edit-rotate {
		position: absolute;
		top: 100%;
		right: 100%;
		background: none;
	}

	.maskImg {
		z-index: 99;
		position: relative;
	}

	movable-area {
		height: 100%;
		width: 100%;
		background-color: transparent;
		background-size: cover;
		overflow: hidden;
		position: relative;
	}

	img {
		max-width: 100%;
	}

	.imgbg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.porMask {
		/* z-index: 1; */
	}

	.frame {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
	}

	.real_pic {
		width: 100%;
		height: 100%;
	}


	movable-view.watermark {
		width: 50%;
		padding: 4%;
		height: 80upx;
		z-index: 98;
		justify-content: flex-start;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	img.watermarkImg {
		height: 100%;
		width: auto;
		max-width: none;
	}
</style>
