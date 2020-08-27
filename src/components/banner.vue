<template>
	<div class="banner">
		<h1>
			<img src="@i/banner-title.png" alt="" />
		</h1>
		<div class="video">
			<div v-if="liveType.status == 2">
				<a :href="liveType.live_url"><img src="@i/video-pause.png" alt="" /></a>
			</div>
			<div v-else-if="liveType.status == 1">
				<a :href="liveType.review_url"><img src="@i/video-pause.png" alt="" /></a>
			</div>
			<div v-else>
				<a :href="liveType.preview_url"><img src="@i/video-pause.png" alt="" /></a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Banner',
	props: {
		liveType: {
			type: Object
		}
	},
	data() {
		return {};
	},
	created() {},
	mounted() {},
	methods: {}
};
</script>
<style lang="scss" scope>
.banner {
	> h1 img {
		@include imgwh(548, 57);
		padding-top: px2rem(130);
	}
	.video > div {
		width: px2rem(570);
		height: px2rem(336);
		margin: 0 auto;
		padding-top: 1px;
		margin-top: px2rem(30);
		@include bg('~@i/video-poster.png');
		img {
			@include imgwh(71, 71);
			margin-top: px2rem(120);
		}
	}
}
</style>