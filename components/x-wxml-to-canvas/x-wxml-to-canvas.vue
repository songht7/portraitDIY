<template>
	<view :class="{ hide: hide }">
		<canvas id="canvas" canvas-id="canvas" type="2d" :style="{ width: width + 'px', height: height + 'px' }" @error="canvasIdErrorCallback"></canvas>
	</view>
</template>

<script>
import { xmlParse, Widget, Draw, selectNodesRefInfo, renderToCanvas, canvasToTempFilePath } from './libs/index.js';
export default {
	props: {
		hide: {
			//canvas是否可见
			type: Boolean,
			default: true
		},
		width: {
			type: Number,
			default: 300
		},
		height: {
			type: Number,
			default: 300
		},
		xWxml: {
			type: String,
			default: ''
		},
		xStyle: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			canvasId: 'canvas'
		};
	},
	methods: {
		canvasIdErrorCallback(err) {
			console.log('canvasIdErrorCallback', err);
		},
		renderToCanvas() {
			const { ctx, canvas, xWxml, xStyle } = this;
			renderToCanvas({ ctx, canvas, xWxml, xStyle }).then(res => {
				this.boundary = {
					top: res.layoutBox.top,
					left: res.layoutBox.left,
					width: res.computedStyle.width,
					height: res.computedStyle.height
				};
			});
		},
		canvasToTempFilePath() {
			const { canvas, canvasId, boundary } = this;
			if (!boundary) {
				return Promise.reject(new Error('canvasToTempFilePath: renderToCanvas 函数未执行'));
			}
			const { top, left, width, height } = boundary;
			let _this = this;
			return new Promise((resolve, reject) => {
				canvasToTempFilePath({ top, left, width, height, canvasId, canvas }).then(res => {
					resolve(res);
				});
			});
		}
	},
	mounted() {
		this.$nextTick(async () => {
			const { canvas, ctx, width, height } = await selectNodesRefInfo(`#${this.canvasId}`, this);
			const dpr = uni.getSystemInfoSync().pixelRatio;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			ctx.scale(dpr, dpr);
			this.canvas = canvas;
			this.ctx = ctx;
		});
	}
};
</script>

<style scoped lang="scss">
.hide {
	position: fixed;
	left: -800rpx;
}
</style>
