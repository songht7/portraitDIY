<template>
	<div id="ImageWrapper" class="imageWrapper">
		<!-- <img class="real_pic" v-if="imgBg" :src="imgBg" /> -->
		<movable-area>
			<movable-view class="imgbg" v-if="imgBg" direction="all" out-of-bounds=true>
				<img class="real_pic" :src="imgBg" />
			</movable-view>
			<movable-view class="imgbg frame" v-if="frame" direction="all" out-of-bounds=true>
				<img class="real_pic" :src="frame" />
			</movable-view>
			<block v-if="maskImg.length" v-for="(img,k) in maskImg" :key="k">
				<movable-view :id="['Mask'+k]" class="maskImg" direction="all" out-of-bounds=true @touchstart="touch(k)">
					<view class="edit-btn edit-del" v-show="editType===k" @click.stop.prevent="editImg('delt',k)">X</view>
					<img :src="img" alt="">
				</movable-view>
			</block>
			<block v-if="slots">
				<movable-view direction="all" out-of-bounds=true>
					<slot></slot>
				</movable-view>
			</block>
		</movable-area>
		<view>
			=={{hammerVal}}==
		</view>
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
				hammerVal: ""
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
					console.log(ev.type)
					//myElement.textContent += ev.type + " ";
				});
				this.editType = k;
			},
			editImg(type, k) {
				var that = this;
				console.log(type, k)
				switch (type) {
					case "delt":
						that.maskImg.splice(that.maskImg.findIndex((item, key) => key === k), 1)
						break;
					default:
						break;
				}
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

	.edit-del {}

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
