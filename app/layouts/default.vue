<template>
  <div class="layout">
    <AnnouncementBanner @height-change="onBannerHeight" />
    <NavBar :announcement-offset="bannerHeight" />
    <main :style="{ paddingTop: mainPadding }">
      <slot />
    </main>
    <FooterSection />
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
/**
 * Default layout — announcement banner + sticky glass navbar + content + full footer.
 * Owns the measured banner height so navigation and page content remain aligned.
 */
const bannerHeight = ref(0)

function onBannerHeight(height: number) {
  bannerHeight.value = height
}

const mainPadding = computed(() =>
  `${72 + bannerHeight.value}px`,
)
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  transition: padding-top 0.3s ease;
}
</style>
