<template>
	<div id="ImageWrapper" class="imageWrapper">
		<movable-area out-of-bounds>
			<!-- 头像 -->
			<movable-view class="imgbg" scale v-if="imgBg" direction="all" out-of-bounds>
				<img class="real_pic" :src="imgBg" />
			</movable-view>
			<!-- 相框 -->
			<movable-view class="imgbg frame" v-if="frame" direction="all" out-of-bounds>
				<img class="real_pic" :src="frame" />
			</movable-view>
			<!-- 饰品 -->
			<block v-if="maskImg.length" v-for="(img,k) in maskImg" :key="k">
				<movable-view :id="['Mask'+k]" class="maskImg" direction="all" @touchstart="touch(k)" out-of-bounds scale scale-min="0.5"
				 scale-max="4" :scale-value="img.scale" @scale="onScale">
					<view class="edit-btn edit-del" v-show="editType===k" @click.stop.prevent="editImg('delt',k)">×</view>
					<img :src="img.url" :class="['maskImgs','maskImgs-'+k,editType===k?'imgBorder':'']" :style="{'transform':'rotate('+img.rotate+'deg)'}"
					 alt="">
					<view class="edit-btn edit-pinch edit-set-rotate" v-show="editType===k" @click.stop.prevent="editImg('rotate',k)">↻</view><!-- ↺ -->
					<view class="edit-btn edit-pinch edit-set-small" v-show="editType===k" @click.stop.prevent="editImg('setSmall',k)">━</view>
					<view class="edit-btn edit-pinch edit-set-big" v-show="editType===k" @click.stop.prevent="editImg('setBig',k)">✚</view>
				</movable-view>
			</block>
			<!-- slot -->
			<block v-if="slots">
				<movable-view direction="all" out-of-bounds>
					<slot></slot>
				</movable-view>
			</block>
		</movable-area>
	</div>
</template>

<script>
	const hammer = require("@/common/hammer.min.js");
	export default {
		name: 'imageWrapper',
		props: {
			imgBg: {
				type: String,
				default: ''
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
				}
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
			editImg(type, k) {
				var that = this;
				//console.log(type, k)
				switch (type) {
					case "delt":
						that.maskImg.splice(that.maskImg.findIndex((item, key) => key === k), 1)
						break;
					case 'setSmall':
						that.maskImg.map((item, key) => {
							if (key === k) {
								item.scale = item.scale - 0.1
							}
						})
						break;
					case 'setBig':
						that.maskImg.map((item, key) => {
							if (key === k) {
								item.scale = item.scale + 0.1
							}
						})
						break;
					case 'rotate':
						that.maskImg.map((item, key) => {
							if (key === k) {
								item.rotate = item.rotate + 15
							}
						})
						break;
					default:
						break;
				}
			},
			onScale: function(e) {
				this.old.scale = e.detail.scale
			}
		}
	}
</script>


<style>
	#ImageWrapper {
		height: 650upx;
		width: 600upx;
	}

	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 150upx;
		width: 150upx;
		background-color: none;
		color: #fff;
		position: relative;
	}

	.edit-btn {
		position: absolute;
		top: -20upx;
		left: -20upx;
		color: #f40;
	}

	.edit-del,
	.edit-pinch {
		background: #FF4400;
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
		top: auto;
		left: -20upx;
		right: auto;
		bottom: -20upx;
	}

	.edit-set-rotate {
		top: -20upx;
		right: -20upx;
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
		height: 600upx;
		width: 600upx;
		background-color: #eee;
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
</style>
