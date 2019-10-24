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
				<movable-view class="maskImg" direction="all" out-of-bounds=true>
					<img :src="img" alt="">
				</movable-view>
			</block>
			<block v-if="slots">
				<movable-view direction="all" out-of-bounds=true>
					<slot></slot>
				</movable-view>
			</block>
		</movable-area>
	</div>
</template>

<script>
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
			return {};
		},
		onShow() {},
		methods: {},
		computed: {}
	}
</script>


<style>
	#ImageWrapper {
		height: 600upx;
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

	.maskImg {
		z-index: 99;
	}

	movable-area {
		height: 600upx;
		width: 600upx;
		background-color: #D8D8D8;
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
