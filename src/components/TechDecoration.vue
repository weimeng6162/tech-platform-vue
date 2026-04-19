<template>
  <div class="tech-decoration">
    <!-- 扫描线 -->
    <div class="scan-line" />
    
    <!-- 角落装饰 -->
    <div class="corner corner-tl" />
    <div class="corner corner-tr" />
    <div class="corner corner-bl" />
    <div class="corner corner-br" />
    
    <!-- 数据流 -->
    <div class="data-streams">
      <div v-for="i in 5" :key="i" class="stream" :style="{ '--delay': i * 2 + 's', '--x': 10 + i * 18 + '%' }" />
    </div>
    
    <!-- 脉冲圆环 -->
    <div class="pulse-rings">
      <div v-for="i in 3" :key="i" class="ring" :style="{ '--delay': i * 1.5 + 's' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.tech-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

/* 扫描线效果 */
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(129, 140, 248, 0) 10%,
    rgba(129, 140, 248, 0.8) 50%,
    rgba(129, 140, 248, 0) 90%,
    transparent 100%
  );
  box-shadow: 
    0 0 20px rgba(129, 140, 248, 0.5),
    0 0 40px rgba(129, 140, 248, 0.3);
  animation: scanMove 8s linear infinite;
  opacity: 0.6;
}

@keyframes scanMove {
  0% { top: -2px; opacity: 0; }
  5% { opacity: 0.6; }
  95% { opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
}

/* 角落装饰 */
.corner {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.4;
}

.corner::before,
.corner::after {
  content: '';
  position: absolute;
  background: rgba(129, 140, 248, 0.6);
}

.corner-tl {
  top: 20px;
  left: 20px;
}
.corner-tl::before {
  top: 0;
  left: 0;
  width: 30px;
  height: 2px;
}
.corner-tl::after {
  top: 0;
  left: 0;
  width: 2px;
  height: 30px;
}

.corner-tr {
  top: 20px;
  right: 20px;
}
.corner-tr::before {
  top: 0;
  right: 0;
  width: 30px;
  height: 2px;
}
.corner-tr::after {
  top: 0;
  right: 0;
  width: 2px;
  height: 30px;
}

.corner-bl {
  bottom: 20px;
  left: 20px;
}
.corner-bl::before {
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
}
.corner-bl::after {
  bottom: 0;
  left: 0;
  width: 2px;
  height: 30px;
}

.corner-br {
  bottom: 20px;
  right: 20px;
}
.corner-br::before {
  bottom: 0;
  right: 0;
  width: 30px;
  height: 2px;
}
.corner-br::after {
  bottom: 0;
  right: 0;
  width: 2px;
  height: 30px;
}

/* 数据流 */
.data-streams {
  position: absolute;
  inset: 0;
}

.stream {
  position: absolute;
  left: var(--x);
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(129, 140, 248, 0.3) 20%,
    rgba(167, 139, 250, 0.5) 50%,
    rgba(129, 140, 248, 0.3) 80%,
    transparent 100%
  );
  animation: streamPulse 4s ease-in-out infinite;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes streamPulse {
  0%, 100% { opacity: 0; transform: scaleY(0.5); }
  50% { opacity: 0.6; transform: scaleY(1); }
}

/* 脉冲圆环 */
.pulse-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 50%;
  animation: ringPulse 6s ease-out infinite;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes ringPulse {
  0% {
    width: 100px;
    height: 100px;
    opacity: 0.8;
    border-color: rgba(129, 140, 248, 0.6);
  }
  100% {
    width: 600px;
    height: 600px;
    opacity: 0;
    border-color: rgba(129, 140, 248, 0);
  }
}
</style>
