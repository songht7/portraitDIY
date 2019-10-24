<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt">
			<view class="portrait-box">
				<imageWrapper ref="imageWrapper" :imgBg="imgBg" :maskImg="maskImg" :frame="frame">
					<view class="text" v-if="slots">
						头像
					</view>
				</imageWrapper>
			</view>
			<view class="imgSelect">
				<image-cropper :src="tempFilePath" :cropFixed="cropFixed" :cropWidth="cropWidth" :cropHeight="cropHeight" @confirm="confirm"
				 @cancel="cancel"></image-cropper>
				<view class="selBtn" @tap="upload">上传头像</view>
				<view class="selBtn" @click="setDec()">添加装饰</view>
				<view class="selBtn" @click="setFrame()">添加相框</view>
			</view>
			<!-- <img src="" alt="" class="imgSmall"> -->
			<view class="editBtn" @click="toImage">生成头像！！</view>
			<uni-popup :show="poptype === 'showNewImg'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<view id="Generated">
					<img class="imgs" v-if="newImg" :src="newImg" alt="">
					<view>长按保存图片</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	var html2canvas = require("@/common/html2canvas.min.js");
	import imageWrapper from '@/components/image-wrapper.vue';
	import uniPopup from '@/components/uni-popup.vue'
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default {
		data() {
			return {
				base64Img: "",
				tempFilePath: "",
				cropFixed: false, //true,
				cropWidth: 250,
				cropHeight: 250,
				imgBg: "",
				maskImg: [],
				newImg: "",
				frame: "",
				"slots": false,
				loading: false,
				poptype: ""
			}
		},
		onLoad() {},
		onShow() {
			//this.getBase64Image();
		},
		components: {
			imageWrapper,
			ImageCropper,
			uniPopup
		},
		methods: {
			upload() {
				var that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						that.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {
				this.tempFilePath = ''
				this.imgBg = e.detail.tempFilePath;
			},
			cancel() {
				console.log('canceled')
			},
			async setDec() {
				var that = this;
				var url = "/static/3.png";
				//var url = "http://img95.699pic.com/element/40121/1517.png_300.png";
				//var _base64Url = await getBase64Image(url);
				that.maskImg.push(url);
			},
			setFrame() {
				var that = this;
				var f = "/static/2.png";
				that.frame = f;
			},
			toImage() {
				var that = this;
				if (that.loading) {
					return false
				}
				var obj = document.getElementById("ImageWrapper");
				var width = obj.offsetWidth;
				var height = obj.offsetHeight;
				that.loading = true;
				uni.showLoading({
					title: "正在生成..."
				})
				html2canvas(obj, {
					backgroundColor: null,
					allowTaint: true,
					tainttest: true,
					width: width,
					height: height
				}).then((canvas) => {
					that.loading = false;
					uni.hideLoading()
					let dataURL = canvas.toDataURL("image/png");
					console.log(dataURL)
					that.poptype = "showNewImg";
					that.newImg = dataURL;
				});
			},
			getBase64Image(dataURL) {
				var that = this;
				var img = new Image();
				img.src = dataURL;
				img.onload = function() {
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0, img.width, img.height);
					var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
					var dataURL = canvas.toDataURL("image/" + ext);
					that.base64Img = dataURL;
					console.log(dataURL);
					return dataURL;
				}
			},
			togglePopup(type) {
				this.poptype = type;
			}
		}
	}
</script>

<style>
	.portrait-box {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
		background: #eee;
	}

	.imgs {
		width: 100%;
	}

	#Generated {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-content: center;
		align-items: center;
	}

	#Generated .imgs {
		width: 90%;
	}

	.imgSelect {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding-bottom: 10upx;
	}

	.imgSmall {
		width: 100upx;
		height: 100upx;
	}

	.selBtn {
		font-size: 24upx;
		padding: 20upx;
	}

	.editBtn {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
		color: #FFFFFF;
		line-height: 20px;
		border-radius: 10upx;
		margin: 10upx;
		padding: 20upx 0;
		background-color: #528BF0;
		background-image: linear-gradient(to right, #528BF0, #A5C1F0);
	}
</style>
