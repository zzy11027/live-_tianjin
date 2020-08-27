<template>
	<div class="container">
		<div class="banner">
			<img src="@i/banner.png" alt="" />
		</div>
		<div class="home">
			<Banner :liveType="mainRoom" />
			<div v-if="isRender">
				<Talent
					:dataList.sync="dataList"
					:typeOne.sync="typeOne"
					:time="future"
					:allJson="getLiveJson"
					v-if="getLiveJson.length"
				/>
				<Vote />
			</div>
			<div v-else>
				<Vote />
				<Talent
					:dataList.sync="dataList"
					:typeOne.sync="typeOne"
					:time="future"
					:allJson="getLiveJson"
					v-if="getLiveJson.length"
				/>
			</div>
		</div>
		<div class="popup" @touchmove.prevent v-if="isPopup">
			<img src="@i/close_icon.png" alt="" @click="close" class="close" />
			<h1>投票占比</h1>
			<div>
				<div class="item" v-for="(item, index) in popupList" :key="index">
					<div class="itemText">
						<h2>{{ item.name }}</h2>
						<h3>{{ item.number | multiple(item.number) }}</h3>
					</div>
					<div class="itemStrip">
						<p ref="strip"></p>
					</div>
				</div>
			</div>
		</div>
		<div class="mask" @touchmove.prevent v-if="isPopup"></div>
	</div>
</template>

<script>
// @ is an alias to /src
import Banner from '@c/banner.vue';
import Vote from '@c/vote.vue';
import Talent from '@c/Talent.vue';

export default {
	name: 'Home',
	data() {
		return {
			popupList: [],
			isPopup: false,
			getLiveJson: [], //ajax json数据
			mainRoom: {}, //主直播间
			future: {
				now: 1597123800, //直播开始时间
				Unix: 0 //当前系统时间戳
			},
			typeOne: {}, //首次渲染初始值tab
			dataList: {
				typeOne: {},
				typeTwo: {},
				typeThree: {},
				typeFour: {}
			}, //选项卡数据
			isRender: false //是否切换模块
		};
	},
	components: {
		Banner,
		Vote,
		Talent
	},
	created() {
		this.getData();
		setInterval(() => {
			this.getData();
		}, 5000);
	},
	mounted() {
		// this.wxshare(1);
	},
	methods: {
		getData() {
			this.HTTPS.fetchGet(`${window.location.protocol}//kanzhibo.baidu.com/liveshow/api/proxybzchina?type=get-anchor`)
				// this.HTTPS.fetchGet(`${this.baseURL.value}api/get-anchor`)
				.then((res) => {
					for (const key in res.data.data) {
						if (key == 'typeOne' || key == 'typeTwo' || key == 'typeThree' || key == 'typeFour') {
							res.data.data[key].forEach((item, index) => {
								const id = parseInt(item.room_id);
								switch (id) {
									case 3826854447:
										item.title1 = '天津疯味·摇滚大鼓';
										item.title2 = '谁说曲艺不能摇滚起来!';
										break;
									case 3828309354:
										item.title1 = '天津相声冷知识';
										item.title2 = '你不知道的相声秘闻';
										break;
									case 3826879070:
										item.title1 = '快板少杰说';
										item.title2 = '竹板这么一打，咱们说点嘛。';
										break;
									case 3827222158:
										item.title1 = '天津时调有调调';
										item.title2 = '就是浓郁津味的调调';
										break;
									case 3826970678:
										item.title1 = '空中早点铺';
										item.title2 = '早餐吃好，一天管饱！';
										break;
									case 3826998994:
										item.title1 = '煎饼果子来7套';
										item.title2 = '绝对正经的试吃测评';
										break;
									case 3827297594:
										item.title1 = '打卡天津网红观光带';
										item.title2 = '坐海河游船，览天津美景';
										break;
									case 3827193336:
										item.title1 = '曙光水镇醉津城';
										item.title2 = '让我们一步一景踏进津城画卷';
										break;
									case 3827242335:
										item.title1 = '用行走丈量天津';
										item.title2 = '不一样的风景 不一样的文化';
										break;
									case 3827021065:
										item.title1 = '喝红酒，去王朝';
										item.title2 = '一起参观酒的王朝';
										break;
									case 3826975222:
										item.title1 = '重出江湖的“山海关汽水”';
										item.title2 = '带您探寻天津人的儿时记忆';
										break;
									default:
										break;
								}
							});
						}
					}
					if (this.$children[2] != undefined) {
						// this.$children[2].tabIndex = 1;
						const index = this.$children[2].tabIndex;
						if (index == 1) {
							this.typeOne = res.data.data.typeOne;
						} else if (index == 2) {
							this.typeOne = res.data.data.typeTwo;
						} else if (index == 3) {
							this.typeOne = res.data.data.typeThree;
						} else if (index == 4) {
							this.typeOne = res.data.data.typeFour;
						}
					} else {
						this.typeOne = res.data.data.typeOne; //首次进入子组件为渲染完毕，导致页面空白，因此赋值
					}
					this.getLiveJson = [];
					this.getLiveJson.push(res.data.data);
					this.mainRoom = res.data.data.mainRoom;
					this.future.Unix = res.data.data.Unix;
					this.dataList.typeOne = res.data.data.typeOne;
					this.dataList.typeTwo = res.data.data.typeTwo;
					this.dataList.typeThree = res.data.data.typeThree;
					this.dataList.typeFour = res.data.data.typeFour;
				})
				.catch((res) => {});
		},
		close() {
			this.isPopup = false;
		},
		wxshare(e) {
			this.wxConfig.wxShowMenu({
				titles: '宝藏天津  嘛都开心。',
				descs: '8月11日11:30-22:30，快来直播间一起探索天津的宝藏吧！',
				link: 'https://mbd.baidu.com/webpage?type=live&action=treasure',
				imgUrl: 'https://mbdp02.bdstatic.com/static/treasure/img/share.jpg',
				path: 'https://mbd.baidu.com/webpage?type=live&action=treasure'
				// path: window.location.href.split('#')[0]
			});
		}
	},
	filters: {
		multiple: function (value1, value2, value3) {
			console.log('value1 :>> ', value1);
			return parseInt(value1 * 100) + '%';
		}
	},
	watch: {
		'future.Unix': function (val, vals) {
			console.log('val,vals :>> ', val, vals);
			console.log('this.isRender :>> ', this.isRender);
			const now = this.future.now; //直播开始时间
			const future = this.future.Unix; //当前系统时间
			//如果当前系统时间大于直播开始时间说明直播开始了  那么让模块切换
			if (future > now) {
				this.isRender = true;
			} else {
				this.isRender = false;
			}
		}
	}
};
</script>
<style lang="scss" scope>
.container {
	position: relative;
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.popup {
		@include bg('~@i/popup.png');
		width: px2rem(420);
		height: px2rem(619);
		position: fixed;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1000;
		.close {
			position: absolute;
			right: 2%;
			top: 2%;
		}
		h1 {
			text-align: center;
			font-family: 'fangzheng';
			font-size: px2rem(30);
			color: #000000;
			padding-top: px2rem(135);
		}
		> div {
			padding: px2rem(30);
			.item {
				margin-top: px2rem(4);
				.itemText {
					width: 100%;
					height: px2rem(32);
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					h2 {
						font-family: 'fangzheng';
						font-size: px2rem(26);
						color: #000000;
					}
					h3 {
						font-family: 'fangzheng';
						font-size: px2rem(20);
						color: #000000;
					}
				}
				.itemStrip {
					height: px2rem(10);
					margin-top: px2rem(4);
					background-color: #d1d1d1;
					border-radius: px2rem(2);
					p {
						width: 80%;
						height: 100%;
						background: #e4b64d;
						border-radius: px2rem(2);
					}
				}
			}
		}
	}
}
.banner img {
	width: 100%;
}
.home {
	width: px2rem(750);
	height: px2rem(3806);
	margin-top: px2rem(-60);
	position: relative;
	max-height: px2rem(3806);
	@include bg('~@i/bg.png');
}
</style>