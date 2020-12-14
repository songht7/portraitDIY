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
			}
		},
		onLoad(option) {},
		onShow() {
			var that = this;
			that.getAction();
			that.getLucked();
		},
		onReady() {
			var that = this;
		},
		components: {},
		methods: {
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
			}
		}
	}
</script>

<style scoped>
	page {
		font-size: 32upx;
		padding: 100upx 30upx 20upx;
	}

	.ipt {
		font-size: 32upx;
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
		padding-bottom: 20upx;
	}

	.lk-val {
		padding: 0 5upx;
	}

	.lb-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		padding: 10upx 0;
	}

	.submit {
		width: 100%;
		background: #007AFF;
		color: #FFFFFF;
		line-height: 3;
		text-align: center;
		margin-bottom: 10upx;
	}

	.reset {
		background: #999;
	}
</style>
