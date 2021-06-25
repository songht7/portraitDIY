<template>
	<view class="page">
		<view class="common-btn" @click="startLottery">
			抽奖
		</view>
		<!-- 开始抽奖-->
		<uniPopup type="center" ref="lotteryPopup" class="lottery-popup">
			<view class="lotterying-title">
				{{isShowWinner?'恭喜以下用户中奖':'正在第'+round_num+'轮抽奖'}}
			</view>
			<image src="https://s.yun-live.com/images/20201010/5ea6ac38f672131f8d1f3009c1fea7cf.png" mode="" class="lotterying-head">
			</image>
			<view class="lotterying">
				<view class="iconfont lotterying-close-icon" @click="closeDialog">
					&#xe61a;
				</view>
				<view class="lotterying-prize-winner">
					<view class="lucknumb" v-for="(item,index) in isShowWinner?prizeWinnerArr:lotteryJoinList" :key="index" v-if="index<7">
						{{item}}
					</view>
					<!-- <image :src="item" mode="" v-for="(item,index) in isShowWinner?prizeWinnerArr:lotteryJoinList" :key="index" v-if="index<7"></image> -->
				</view>
			</view>
		</uniPopup>
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				lotteryJoinList: [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"10",
					"11",
					"12",
					"13",
					"14",
					"15",
					"16",
				],
				isShowWinner: false, //显示中奖者
				round_num: 1, //第几轮开奖
				prizeWinnerArr: [
					"3",
					"15"
				], //中奖人头像
				lottery_timer: null,
			};
		},
		methods:{
			startLottery(){
				this.isShowWinner = false;
				this.$refs.lotteryPopup.open();
				let _this = this
				_this.lottery_timer = setInterval(() => {
					for (let i = 0; i < 7; i++) {
						let random_num = _this.random();//随机数
						let item = _this.lotteryJoinList[i];//当前循环到的item
						let random_item = _this.lotteryJoinList[random_num];//随机item
						_this.$set(_this.lotteryJoinList, i, random_item);
						_this.$set(_this.lotteryJoinList, random_num, item)
					}
				}, 80)
				setTimeout(() => {
					_this.stopLottery()
				}, 5000)
			},
			// 随机数
			random() {
				return Math.floor(Math.random() * this.lotteryJoinList.length);
			},
			// 停止抽奖
			stopLottery() {
				this.isShowWinner = true;
				clearInterval(this.lottery_timer);
			},
			closeDialog(){
				this.$refs.lotteryPopup.close();
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style.scss';
</style>
