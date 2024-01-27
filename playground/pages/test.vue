<template>
	<div class="Test">
		This is a test page !
		<NuxtLink to="/">Go to home</NuxtLink>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
.Test {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: lightblue;
}
</style>
