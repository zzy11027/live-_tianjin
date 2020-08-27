<template>
	<div class="Talent">
		<h1>
			<img src="@i/Talent-title.png" alt="" />
		</h1>
		<div class="listbg">
			<div class="div">
				<div class="swiper-container swiper_banner">
					<div class="swiper-wrapper">
						<div v-for="(el, index) in loopPicture" :key="index" class="swiper-slide">
							<img src="@i/1.png" alt="" v-if="index == 1" class="icon" />
							<img src="@i/2.png" alt="" v-if="index == 0" class="icon" />
							<img src="@i/3.png" alt="" v-if="index == 2" class="icon" />
							<div v-if="isClick">
								<a :href="el.live_url" v-if="el.status == 2"><img class="img" :src="`${el.cover}`" /></a>
								<a :href="el.review_url" v-else-if="el.status == 1"><img class="img" :src="`${el.cover}`" /></a>
								<a :href="el.preview_url" v-else><img class="img" :src="`${el.cover}`" /></a>
							</div>
							<div v-else>
								<img class="img" :src="`${el.cover}`" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab">
				<div @click="tabClick" data-index="1" :class="[tabIndex == 1 ? 'active' : '']">曲苑杂坛</div>
				<div @click="tabClick" data-index="2" :class="[tabIndex == 2 ? 'active' : '']">今时津味</div>
				<div @click="tabClick" data-index="3" :class="[tabIndex == 3 ? 'active' : '']">大美天津</div>
				<div @click="tabClick" data-index="4" :class="[tabIndex == 4 ? 'active' : '']">度熊游津企</div>
			</div>
			<div class="list" v-for="(item, index) in typeOne" :key="index" @click="clickHref(item)">
				<p v-if="item.status == 1">直播回放</p>
				<div @click="clickHref(item)">
					<img @click="clickHref(item)" :src="item.cover" alt="" />
					<button></button>
				</div>
				<div class="listText">
					<h1 v-if="item.title1">{{ item.title1 }}</h1>
					<h1 v-else>{{ item.title }}</h1>
					<h2 v-if="item.title2">{{ item.title2 }}</h2>
					<h2 v-else>{{ item.nick_name }}</h2>
					<div class="browseNum">
						<div>
							<img src="@i/icon1.png" alt="" class="icon1" />
							<span>{{ item.total_users }}</span>
						</div>
						<div>
							<img src="@i/icon2.png" alt="" class="icon2" />
							<span>{{ item.feedbacks }}</span>
						</div>
						<div>
							<img src="@i/icon3.png" alt="" class="icon3" />
							<span>{{ item.msgnum }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import '../assets/css/swiper.min.css';
export default {
	name: 'Talent',
	props: {
		allJson: {},
		dataList: {
			type: Object,
			default() {
				return false;
			}
		},
		typeOne: {},
		time: {
			type: Object,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			tabIndex: 1,
			tabContainer: [],
			loopPicture: [],
			isClick: false, //是否可以点击banner轮播
			bannerImg: [
				{
					cover: require('../assets/images/banner1.png')
				},
				{
					cover: require('../assets/images/banner2.png')
				},
				{
					cover: require('../assets/images/banner3.png')
				}
			]
		};
	},
	created() {
		const now = this.time.now; //直播开始时间
		const future = this.time.Unix; //当前系统时间
		console.log(now, future, this.time);
		//如果直播开始了
		if (now < future) {
			this.loopPicture = this.allJson[0].rotation;
			this.isClick = true;
		} else {
			this.loopPicture = this.bannerImg;
			this.isClick = false;
		}
	},
	mounted() {
		this.$nextTick(() => {
			new Swiper('.swiper-container', {
				loop: false, // 循环模式选项
				// 如果需要分页器
				pagination: {
					el: '.swiper-pagination'
				},
				initialSlide: 1,
				// autoplay: {
				// 	delay: 1500
				// },
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
				effect: 'coverflow',
				slidesPerView: 1.5,
				centeredSlides: true,
				coverflowEffect: {
					rotate: 0,
					stretch: 10,
					depth: 340,
					modifier: 2,
					slideShadows: true
				}
			});
		});
	},
	methods: {
		tabClick(e) {
			console.log('e.target.dataset.index :>> ', e.target.dataset.index);
			const index = parseInt(e.target.dataset.index);
			var string;
			switch (index) {
				case 1:
					this.tabIndex = 1;
					string = 'typeOne';
					break;
				case 2:
					this.tabIndex = 2;
					string = 'typeTwo';
					break;
				case 3:
					this.tabIndex = 3;
					string = 'typeThree';
					break;
				case 4:
					this.tabIndex = 4;
					string = 'typeFour';
					break;
				default:
					break;
			}
			this.$emit('update:typeOne', this.dataList[string]);
			// this.typeOne = this.dataList[string];
		},
		clickHref(item) {
			console.log('item :>> ', item);
			console.log('item :>> ', item.status);
			if (item.status == 0) {
				window.location.href = item.preview_url;
			} else if (item.status == 1) {
				window.location.href = item.review_url;
			} else if (item.status == 2) {
				window.location.href = item.live_url;
			}
		}
	},
	computed: {},
	watch: {
		'time.Unix': function (newVal, oldVal) {
			console.log('newVal,oldVal :>> ', newVal, oldVal);
			const now = this.time.now; //直播开始时间
			const future = this.time.Unix; //当前系统时间
			if (now < future) {
				this.loopPicture = this.allJson[0].rotation;
				this.isClick = true;
			} else {
				this.loopPicture = this.bannerImg;
				this.isClick = false;
			}
		},
		deep: true,
		immediate: true
	},
	components: {}
};
</script>
<style lang="scss" scope>
.Talent {
	h1 {
		img {
			@include imgwh(593, 56);
			margin-top: px2rem(60);
		}
	}
	.listbg {
		width: px2rem(612);
		height: px2rem(1026);
		@include bg('~@i/listbg.png');
		margin: 0 auto;
		margin-top: px2rem(27);
		padding-top: 1px;
		.tab {
			width: px2rem(570);
			// height: px2rem(60);
			line-height: px2rem(60);
			display: flex;
			justify-content: space-between;
			background-color: #ffffff;
			margin: 0 auto;
			margin-top: px2rem(18);
			border-radius: px2rem(10);
			border: px2rem(4) solid #4157a6;
			div {
				width: px2rem(135);
				text-align: center;
				color: #4157a6;
				font-size: px2rem(26);
				font-family: 'fangzheng';
				border-radius: px2rem(10);
			}
			.active {
				color: #ffffff;
				background-color: #4157a6;
			}
		}
		.list {
			width: px2rem(570);
			height: px2rem(155);
			border: px2rem(4) solid #4157a6;
			margin: 0 auto;
			margin-top: px2rem(16);
			border-radius: px2rem(10);
			position: relative;
			display: flex;
			> div {
				width: px2rem(275);
				height: 100%;
				position: relative;
				img {
					width: 100%;
					height: 100%;
				}
				button {
					background: none;
					border: none;
					outline: none;
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					margin: auto;
					@include bg('~@i/pause.png');
					width: px2rem(47);
					height: px2rem(47);
				}
			}
			p {
				width: px2rem(96);
				height: px2rem(30);
				line-height: px2rem(30);
				font-size: px2rem(17);
				font-family: 'fangzheng';
				background: rgba(0, 0, 0, 0.3);
				position: absolute;
				text-align: center;
				color: #ffffff;
				z-index: 999;
			}
			.listText {
				width: px2rem(243);
				background: none;
				margin-left: px2rem(24);
				color: #4157a6;
				h1 {
					font-family: 'fangzheng';
					font-size: px2rem(28);
					padding-top: px2rem(15);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				h2 {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: px2rem(22);
				}
				.browseNum {
					background: none;
					display: flex;
					margin-top: px2rem(24);
					margin-left: px2rem(-10);
					div {
						margin-left: px2rem(10);
						display: flex;
						align-items: flex-end;
						span {
							font-size: px2rem(13);
							color: #4157a6;
							margin-left: px2rem(6);
						}
					}
					.icon1 {
						width: px2rem(28);
						height: px2rem(18);
					}
					.icon2 {
						width: px2rem(25);
						height: px2rem(25);
					}
					.icon3 {
						width: px2rem(24);
						height: px2rem(24);
					}
				}
			}
		}
	}
}
.swiper_banner {
	padding: px2rem(20);
	overflow: inherit;
	border-radius: px2rem(10);
	.icon {
		width: px2rem(44);
		height: px2rem(41);
		position: absolute;
		left: 10%;
		top: -4%;
	}
	img {
		border-radius: px2rem(10);
		width: 100%;
	}
}
.div {
	overflow: hidden;
	margin-left: px2rem(20);
	margin-right: px2rem(20);
}
</style>