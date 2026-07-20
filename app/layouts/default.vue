<template>
  <div class="layout">
    <AnnouncementBanner @visibility-change="onBannerVisibility" />
    <NavBar :announcement-offset="bannerVisible" />
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
 * Owns the announcement visibility state and passes it to children via props.
 * Uses props instead of provide/inject to avoid parent→child direction issues.
 */
const bannerVisible = ref(false)

function onBannerVisibility(visible: boolean) {
  bannerVisible.value = visible
}

const mainPadding = computed(() =>
  bannerVisible.value ? 'calc(72px + 40px)' : '72px',
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
