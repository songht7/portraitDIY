<template>
	<view>
		<view class="uni-mask bg-mask" v-show="show" :style="{ top: offsetTop + 'px' }" @click="hide"
			@touchmove.stop.prevent="moveHandle"></view>
		<view class="uni-popup"
			:class="'uni-popup-' + position + ' ' + 'uni-popup-' + mode + ' ' + 'uni-popup-' + width" v-show="show"
			:style="width?'width:'+width+'%':'',bgStye?'background:'+bgStye:''">
			{{ msg }}
			<slot></slot>
			<view v-if="position === 'middle' && mode === 'insert'&&closeBtnShow" class=" uni-icon uni-icon-close"
				:class="{
					'uni-close-bottom': buttonMode === 'bottom',
					'uni-close-right': buttonMode === 'right'
				}" @click="closeMask"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'uni-popup',
		props: {
			/**
			 * 页面显示
			 */
			show: {
				type: Boolean,
				default: false
			},
			closeBtnShow: {
				type: Boolean,
				default: true
			},
			/**
			 * 背景色
			 */
			bgStye: {
				type: String,
				//background:bgStye
				default: 'none'
			},
			/**
			 * 对齐方式
			 */
			position: {
				type: String,
				//top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			/**
			 * 显示模式
			 */
			mode: {
				type: String,
				default: 'insert'
			},
			/**
			 * 宽度
			 */
			width: {
				type: String,
				default: '80'
			},
			/**
			 * 额外信息
			 */
			msg: {
				type: String,
				default: ''
			},
			/**
			 * h5遮罩是否到顶
			 */
			h5Top: {
				type: Boolean,
				default: false
			},
			buttonMode: {
				type: String,
				default: 'bottom'
			}
		},
		data() {
			return {
				offsetTop: 0
			};
		},
		watch: {
			h5Top(newVal) {
				if (newVal) {
					this.offsetTop = 44;
				} else {
					this.offsetTop = 0;
				}
			}
		},
		computed: {},
		methods: {
			setWidth(w) {
				return `${w}%`
			},
			hide() {
				if (this.mode === 'insert' && this.position === 'middle') return;
				this.$emit('hidePopup');
			},
			closeMask() {
				if (this.mode === 'insert') {
					this.$emit('hidePopup');
				}
			},
			moveHandle() {}
		},
		created() {
			let offsetTop = 0;
			// //#ifdef H5
			// if (!this.h5Top) {
			// 	offsetTop = 44;
			// } else {
			// 	offsetTop = 0;
			// }
			// //#endif
			this.offsetTop = offsetTop;
		}
	};
</script>
<style>
	.uni-mask {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.uni-popup {
		position: absolute;
		z-index: 999;
		background-color: #ffffff;
	}

	.uni-popup-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.uni-popup-middle.uni-popup-insert {
		min-width: 380upx;
		min-height: 380upx;
		max-width: 100%;
		max-height: 80%;
		transform: translate(-50%, -65%);
		background: none;
		box-shadow: none;
	}

	.uni-popup-middle.uni-popup-fixed,
	.uni-popup-middle.uni-popup-posfixed {
		border-radius: 10upx;
		padding: 30upx;
	}

	.uni-popup-middle.uni-popup-posfixed {
		position: fixed;
	}

	.uni-popup-full {
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}

	.uni-popup-full.uni-popup-insert {
		min-width: 100%;
		min-height: 100%;
		max-width: 100%;
		max-height: 100%;
		transform: translate(-50%, -65%);
		background: none;
		box-shadow: none;
	}

	.uni-close-bottom,
	.uni-close-right {
		position: absolute;
		bottom: -180upx;
		text-align: center;
		border-radius: 50%;
		color: #f5f5f5;
		font-size: 60upx;
		font-weight: bold;
		opacity: 0.8;
		z-index: -1;
	}

	.uni-close-right {
		right: -60upx;
		top: -80upx;
	}

	.uni-close-bottom:after {
		content: '';
		position: absolute;
		width: 0px;
		border: 1px #f5f5f5 solid;
		top: -200upx;
		bottom: 56upx;
		left: 50%;
		transform: translate(-50%, -0%);
		opacity: 0.8;
	}

	.uni-popup-top {
		top: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}

	.uni-popup-bottom {
		left: 0;
		bottom: 0;
		width: 100%;
		min-height: 100upx;
		line-height: 100upx;
		text-align: center;
	}
</style>
