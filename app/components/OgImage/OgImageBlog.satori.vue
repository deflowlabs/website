<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '60px 80px',
      background: '#0B0B14',
      fontFamily: 'Geist, Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <!-- Background glow -->
    <div
      :style="{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
      }"
    />

    <!-- Category badge -->
    <div
      v-if="category"
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 16px',
        borderRadius: '100px',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        color: '#818CF8',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: '24px',
        alignSelf: 'flex-start',
      }"
    >
      {{ category }}
    </div>

    <!-- Title -->
    <div
      :style="{
        fontSize: title && title.length > 60 ? '42px' : '52px',
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: '1.15',
        letterSpacing: '-0.02em',
        marginBottom: '32px',
        maxWidth: '900px',
      }"
    >
      {{ title || 'DeFlow Labs' }}
    </div>

    <!-- Author + date row -->
    <div
      v-if="author"
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }"
    >
      <div
        :style="{
          fontSize: '18px',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.8)',
        }"
      >
        {{ author }}
      </div>
      <div
        v-if="date"
        :style="{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.5)',
        }"
      >
        · {{ date }}
      </div>
    </div>

    <!-- Logo watermark -->
    <div
      :style="{
        position: 'absolute',
        top: '48px',
        right: '64px',
        fontSize: '20px',
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.2)',
        letterSpacing: '-0.02em',
      }"
    >
      DeFlow Labs
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * OgImageBlog — Dynamic OG image template for blog posts.
 * Used by nuxt-og-image to generate 1200x630 social sharing images.
 * Renders title, category badge, author, and date on the brand background.
 */
defineProps<{
  title?: string
  category?: string
  author?: string
  date?: string
}>()
</script>
