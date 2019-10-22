<template>
	<view class="content">
		<canvas style="width: 100%; height: 200px;" canvas-id="portrait" disable-scroll></canvas>
		<!-- <canvas style="width: 400px; height: 500px;" canvas-id="secondCanvas"></canvas>
		<canvas style="width: 400px; height: 500px;" canvas-id="secondCanvas" @error="canvasIdErrorCallback"></canvas> -->
		<!-- <image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		onReady: function(e) {
			var context = uni.createCanvasContext('portrait')
		},
		methods: {
			drawImg: function(avatarUrl, index) {
				var that = this;
				let promise1 = new Promise(function(resolve, reject) {
					uni.getImageInfo({
						src: "/static/logo.png",
						success(res) {
							console.log("promise1:", res)
							resolve(res);
						}
					})
				});
			}
		}
	}
</script>

<style>
</style>
