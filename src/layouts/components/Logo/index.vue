<script lang="ts" setup>
import { useLayoutMode } from '@/hooks/useLayoutMode'

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true,
})

const { isLeft, isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container" :class="{ 'collapse': props.collapse, 'layout-mode-top': isTop }">
    <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/dashboard">
        <!-- <img :src="logo" class="layout-logo"> -->
        <div style="color: #fff;font-size: 16px;font-weight: 600;">
          Shiptrack
        </div>
      </router-link>
      <router-link v-else key="expand" to="/dashboard">
        <!-- <img :src="!isLeft ? logoText2 : logoText1" class="layout-logo-text"> -->
        <div style="color: #fff;font-size: 20px;font-weight: 600;">
          Shiptrack 管理控制台
        </div>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  text-align: center;
  overflow: hidden;
  .layout-logo {
    display: none;
  }
  .layout-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.layout-mode-top {
  height: var(--v3-navigationbar-height);
  line-height: var(--v3-navigationbar-height);
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .layout-logo-text {
    display: none;
  }
}
</style>
