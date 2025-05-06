<template>
	<view class="default-layout">
		<slot></slot>
	</view>
</template>

<style lang="scss">
.default-layout {
	/* #ifdef H5 */
	overflow: auto;
	/* #endif */
}
</style>
