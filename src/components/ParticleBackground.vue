<template>
  <canvas
    ref="canvasRef"
    class="particle-canvas"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../stores/theme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

const props = withDefaults(defineProps<{
  particleCount?: number
  connectionDistance?: number
  mouseRadius?: number
}>(), {
  particleCount: 80,
  connectionDistance: 180,
  mouseRadius: 300
})

const themeStore = useThemeStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let particles: Particle[] = []
let mouse = { x: 0, y: 0, isActive: false }
let animationId: number | undefined

// 浅色模式颜色
const lightColors = [
  'rgba(99, 102, 241, ',
  'rgba(139, 92, 246, ',
  'rgba(59, 130, 246, ',
  'rgba(168, 85, 247, ',
]

// 深色模式颜色 - 更亮更明显
const darkColors = [
  'rgba(129, 140, 248, ',
  'rgba(167, 139, 250, ',
  'rgba(96, 165, 250, ',
  'rgba(192, 132, 252, ',
]

const getColors = () => {
  return themeStore.theme === 'dark' ? darkColors : lightColors
}

const createParticle = (x?: number, y?: number, isClick = false): Particle => {
  const canvas = canvasRef.value
  const colors = getColors()
  const isDark = themeStore.theme === 'dark'
  const baseSize = isClick ? 5 : (isDark ? 3 : 2)
  
  return {
    x: x ?? Math.random() * (canvas?.width || window.innerWidth),
    y: y ?? Math.random() * (canvas?.height || window.innerHeight),
    vx: (Math.random() - 0.5) * (isClick ? 5 : 0.8),
    vy: (Math.random() - 0.5) * (isClick ? 5 : 0.8),
    size: baseSize + Math.random() * (isDark ? 3 : 2),
    opacity: isDark 
      ? (0.7 + Math.random() * 0.3) 
      : (0.4 + Math.random() * 0.4),
    color: colors[Math.floor(Math.random() * colors.length)],
    life: isClick ? 150 : Infinity,
    maxLife: isClick ? 150 : Infinity,
  }
}

const handleClick = (e: MouseEvent) => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // 爆发粒子
  for (let i = 0; i < 30; i++) {
    const angle = (Math.PI * 2 * i) / 30
    const speed = 4 + Math.random() * 5
    const particle = createParticle(x, y, true)
    particle.vx = Math.cos(angle) * speed
    particle.vy = Math.sin(angle) * speed
    particles.push(particle)
  }
  
  // 中心大粒子
  for (let i = 0; i < 12; i++) {
    const particle = createParticle(x, y, true)
    particle.size = 6 + Math.random() * 4
    particle.opacity = 1
    particles.push(particle)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.isActive = true
}

const handleMouseLeave = () => {
  mouse.isActive = false
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  particles = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.push(createParticle())
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  canvas.addEventListener('click', handleClick)

  const animate = () => {
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isDark = themeStore.theme === 'dark'
    const connectionOpacity = isDark ? 0.4 : 0.2
    const glowMultiplier = isDark ? 5 : 3

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      // 鼠标吸引 - 增强跟随效果
      if (mouse.isActive) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < props.mouseRadius) {
          const force = (props.mouseRadius - dist) / props.mouseRadius
          // 深色模式下更强的吸引效果
          const attractStrength = isDark ? 0.08 : 0.04
          p.vx += (dx / dist) * force * attractStrength
          p.vy += (dy / dist) * force * attractStrength
        }
      }

      // 添加轻微波动效果
      p.vx += (Math.random() - 0.5) * 0.02
      p.vy += (Math.random() - 0.5) * 0.02

      p.x += p.vx
      p.y += p.vy
      
      // 速度衰减
      p.vx *= 0.98
      p.vy *= 0.98

      // 边界处理
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      // 生命周期
      if (p.life !== Infinity) {
        p.life--
        p.opacity = (p.life / p.maxLife) * 1
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
      }

      // 绘制粒子
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color + p.opacity + ')'
      ctx.fill()

      // 发光效果 - 深色模式更强
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * glowMultiplier)
      gradient.addColorStop(0, p.color + p.opacity * 0.5 + ')')
      gradient.addColorStop(1, p.color + '0)')
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * glowMultiplier, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // 连接线
    const lineColor = isDark ? '129, 140, 248' : '99, 102, 241'
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i]
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < props.connectionDistance) {
          const opacity = (1 - dist / props.connectionDistance) * connectionOpacity
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`
          ctx.lineWidth = isDark ? 1.2 : 0.6
          ctx.stroke()
        }
      }
    }

    // 鼠标光晕 - 深色模式更明显
    if (mouse.isActive) {
      const mouseGlowSize = isDark ? 200 : 120
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, mouseGlowSize
      )
      
      if (isDark) {
        gradient.addColorStop(0, 'rgba(129, 140, 248, 0.25)')
        gradient.addColorStop(0.3, 'rgba(167, 139, 250, 0.15)')
        gradient.addColorStop(0.6, 'rgba(96, 165, 250, 0.08)')
        gradient.addColorStop(1, 'rgba(129, 140, 248, 0)')
      } else {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.12)')
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)')
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
      }
      
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, mouseGlowSize, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // 深色模式额外科技效果
    if (isDark) {
      // 六边形网格点
      const time = Date.now() * 0.001
      const hexSize = 60
      for (let x = 0; x < canvas.width; x += hexSize) {
        for (let y = 0; y < canvas.height; y += hexSize * 0.866) {
          const offsetX = (Math.floor(y / (hexSize * 0.866)) % 2) * (hexSize / 2)
          const px = x + offsetX
          const pulse = Math.sin(time + px * 0.01 + y * 0.01) * 0.5 + 0.5
          const opacity = pulse * 0.15
          
          ctx.beginPath()
          ctx.arc(px, y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(129, 140, 248, ${opacity})`
          ctx.fill()
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {})
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('click', handleClick)
  }
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  z-index: 0;
}
</style>
