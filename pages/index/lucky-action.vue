<template>
	<view class="lucky-box">
		<view class="lucky-value">
			<view class="lb-row">
				一等奖, 幸运号码：
				<block v-if="isLucked['v1']" v-for="(obj,key) in isLucked['v1']" :key="key">
					<text class="lk-val">{{obj}},</text>
				</block>
			</view>
			<view class="lb-row">
				二等奖, 幸运号码：
				<block v-if="isLucked['v2']" v-for="(obj,key) in isLucked['v2']" :key="key">
					<text class="lk-val">{{obj}},</text>
				</block>
			</view>
			<view class="lb-row">
				三等奖, 幸运号码：
				<block v-if="isLucked['v3']" v-for="(obj,key) in isLucked['v3']" :key="key">
					<text class="lk-val">{{obj}},</text>
				</block>
			</view>
			<view class="lb-row" v-if="lucky==4||isLucked['v4']">
				四等奖, 幸运号码：
				<block v-if="isLucked['v4']" v-for="(obj,key) in isLucked['v4']" :key="key">
					<text class="lk-val">{{obj}},</text>
				</block>
			</view>
			<view class="lb-row" v-if="lucky==5||isLucked['v5']">
				五等奖, 幸运号码：
				<block v-if="isLucked['v5']" v-for="(obj,key) in isLucked['v5']" :key="key">
					<text class="lk-val">{{obj}},</text>
				</block>
			</view>
			<view class="lb-row" v-if="lucky==6||isLucked['v6']">
				六等奖, 幸运号码：
				<block v-if="isLucked['v6']" v-for="(obj,key) in isLucked['v6']" :key="key">
					<text class="lk-val">{{obj}},</text>
				</block>
			</view>
		</view>
		<view class="lucky-act">
			<view class="lb-row">
				当前抽取<input class="ipt" type="number" name="" id="" v-model="lucky" @blur="getLucky">等奖, <input class="ipt" type="number"
				 name="" id="" v-model="luckyCount" @blur="getLuckyCount">名。
			</view>
			<view class="lb-row">
				参与人数<input class="ipt" type="number" name="" id="" v-model="pCount" @blur="getPCount">名
			</view>
		</view>
		<view class="submit" @click="submit">确认</view>
		<view class="submit reset" @click="reset">清空抽奖</view>
		<view class="black-box">
			<view v-if="isblack" class="lucky-act">
				<view class="lb-row"><input class="ipt" type="text" name="" id="" v-model="blockBoxNum" @input="ckBlockBox">
				</view>
			</view>
			<view class="longpress" @longpress="longpress" @dblclick="longpress"></view>
			<block v-if="hasBlockBox">
				<view class="lb-row row-title">
					暗箱
				</view>
				<view class="lb-row">
					一等奖号<input class="ipt" type="text" name="" id="" v-model="luckyV1">
				</view>
				<view class="lb-row">
					二等奖号<input class="ipt" type="text" name="" id="" v-model="luckyV2">
				</view>
				<view class="lb-row">
					三等奖号<input class="ipt" type="text" name="" id="" v-model="luckyV3">
				</view>
				<view class="submit" @click="confirm">确认</view>
				<view class="submit reset" @click="remore">清空暗箱</view>
			</block>
		</view>
	</view>
</template>

<script>
	var r0 = "";
	export default {
		data() {
			return {
				lucky: 1, //奖号
				luckyCount: 1, //抽奖次数
				minNum: 1, //最小值
				pCount: 200, //共多少人参与
				isLucked: {}, //已抽取的号
				numb: [], //抽奖号
				luckyV1: "", //暗箱抽奖号
				luckyV2: "",
				luckyV3: "",
				luckyV4: "",
				luckyV5: "",
				luckyV6: "",
				isblack: false,
				hasBlockBox: false,
				blockBoxNum: "",
				blockBoxPW: "s12321"
			}
		},
		onLoad(option) {},
		onShow() {
			var that = this;
			that.getAction();
			that.getLucked();
			that.getmyLuck();
		},
		onReady() {
			var that = this;
		},
		components: {},
		methods: {
			longpress() {
				this.isblack = !this.isblack;
			},
			ckBlockBox() {
				if (this.blockBoxNum == this.blockBoxPW) {
					this.hasBlockBox = true;
				} else {
					this.hasBlockBox = false;
				}
			},
			getAction() {
				const that = this;
				uni.getStorage({
					key: 'rbdAction',
					success: function(res) {
						that.lucky = res.data.lucky;
						that.luckyCount = res.data.luckyCount;
						that.pCount = res.data.pCount;
					}
				});
			},
			getLucked() {
				const that = this;
				uni.getStorage({
					key: 'rbdLucked',
					success: function(res) {
						that.isLucked = res.data;
					},
					fail() {
						that.isLucked = {};
					}
				});
			},
			getLucky(e) {
				console.log(e.detail.value)
				const that = this;
			},
			getLuckyCount(e) {
				console.log(e.detail.value)
				const that = this;
			},
			getPCount(e) {
				console.log(e.detail.value)
				const that = this;
			},
			submit() {
				const that = this;
				let data = {
					lucky: that.lucky,
					luckyCount: that.luckyCount,
					pCount: that.pCount,
				};
				uni.setStorage({
					key: 'rbdAction',
					data: data,
					success: function() {
						uni.showToast({
							title: "提交成功，请刷新活动页"
						})
					}
				});
			},
			reset() {
				const that = this;
				uni.removeStorage({
					key: 'rbdLucked',
					success: function() {
						that.getLucked();
					}
				});
			},
			getmyLuck() {
				const that = this;
				uni.getStorage({
					key: 'myLuck',
					success: function(res) {
						that.luckyV1 = res.data.v1 ? res.data.v1.join(',') : "";
						that.luckyV2 = res.data.v2 ? res.data.v2.join(',') : "";
						that.luckyV3 = res.data.v3 ? res.data.v3.join(',') : "";
						that.luckyV4 = res.data.v4 ? res.data.v4.join(',') : "";
						that.luckyV5 = res.data.v5 ? res.data.v5.join(',') : "";
						that.luckyV6 = res.data.v6 ? res.data.v6.join(',') : "";
					},
					fail() {
						that.luckyV1 = "";
						that.luckyV2 = "";
						that.luckyV3 = "";
						that.luckyV4 = "";
						that.luckyV5 = "";
						that.luckyV6 = "";
					}
				});
			},
			confirm() {
				const that = this;
				let v1 = that.luckyV1.split(',');
				let v2 = that.luckyV2.split(',');
				let v3 = that.luckyV3.split(',');
				let v4 = that.luckyV4.split(',');
				let v5 = that.luckyV5.split(',');
				let v6 = that.luckyV6.split(',');
				let vv1 = [];
				let vv2 = [];
				let vv3 = [];
				let vv4 = [];
				let vv5 = [];
				let vv6 = [];
				let myLuck = {}
				v1.map((obj) => {
					console.log(obj)
					if (obj) {
						vv1.push(parseInt(obj));
					}
				});
				v2.map((obj) => {
					console.log(obj)
					if (obj) {
						vv2.push(parseInt(obj));
					}
				});
				v3.map((obj) => {
					console.log(obj)
					if (obj) {
						vv3.push(parseInt(obj));
					}
				});
				v4.map((obj) => {
					console.log(obj)
					if (obj) {
						vv4.push(parseInt(obj));
					}
				});
				v5.map((obj) => {
					console.log(obj)
					if (obj) {
						vv5.push(parseInt(obj));
					}
				});
				v6.map((obj) => {
					console.log(obj)
					if (obj) {
						vv6.push(parseInt(obj));
					}
				});
				myLuck = {
					v1: vv1,
					v2: vv2,
					v3: vv3,
					v4: vv4,
					v5: vv5,
					v6: vv6
				}
				uni.setStorage({
					key: 'myLuck',
					data: myLuck,
					success: function() {
						uni.showToast({
							title: "GOOD JOB!"
						})
					}
				});

			},
			remore() {
				const that = this;
				uni.removeStorage({
					key: 'myLuck',
					success: function() {
						that.luckyV1 = "";
						that.luckyV2 = "";
						that.luckyV3 = "";
						that.luckyV4 = "";
						that.luckyV5 = "";
						that.luckyV6 = "";
						uni.showToast({
							title: "已清空!"
						})
					}
				});
			}
		}
	}
</script>

<style scoped>
	page {
		font-size: 16px;
		padding: 20px;
	}

	.ipt {
		/* font-size: 32upx; */
		border-bottom: 1px solid #ddd;
		width: 100px;
		text-align: center;
	}

	.lucky-act,
	.lucky-value {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		padding-bottom: 20px;
	}

	.lk-val {
		padding: 0 5px;
	}

	.lb-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		padding: 10px 0;
	}

	.submit {
		width: 100%;
		background: #007AFF;
		color: #FFFFFF;
		line-height: 3;
		text-align: center;
		margin-bottom: 10px;
	}

	.reset {
		background: #999;
	}

	.black-box {
		padding: 30px 0;
	}

	.row-title {
		/* font-size: 36upx; */
		font-size: 16px;
	}

	.longpress {
		width: 100px;
		height: 100px;
		background: #fffcfc;
		position: fixed;
		bottom: 0;
		right: 0;
	}
</style>
