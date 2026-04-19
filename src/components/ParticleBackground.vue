<template>
  <canvas
    ref="canvasRef"
    class="particle-canvas"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
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
  originalX?: number
  originalY?: number
  isAggregating?: boolean
  // 数学方程参数
  equationType?: 'lissajous' | 'spiral' | 'rose' | 'wave' | 'parametric' | 'butterfly' | 'heart' | 'star' | 'hypocycloid' | 'epicycloid' | 'deltoid' | 'nephroid'
  phase?: number
  amplitude?: number
  frequency?: number
  trail?: { x: number; y: number }[]
  // 生命周期管理
  age?: number // 粒子年龄
  maxAge?: number // 最大年龄
  fadeIn?: boolean // 是否正在淡入
}

const props = withDefaults(defineProps<{
  particleCount?: number
  connectionDistance?: number
  mouseRadius?: number
}>(), {
  particleCount: 80,
  connectionDistance: 120, // 从180降低到120,减少连接,让粒子看起来更分散
  mouseRadius: 300
})

const themeStore = useThemeStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let particles: Particle[] = []
let mouse = { x: 0, y: 0, isActive: false }
let animationId: number | undefined
let isAggregating = false
let aggregateTimer: number | undefined
let aggregateCenter = { x: 0, y: 0 }

// 自动循环状态 - 已禁用,专注于方程展示
let autoCycleEnabled = false // 禁用自动循环
let cyclePhase: 'idle' | 'aggregating' | 'dispersing' | 'attracting' = 'idle'
let cycleTimer: number | undefined
const AGGREGATE_DURATION = 2000 // 聚合持续时间
const ATTRACT_DURATION = 5000 // 吸附持续时间
const IDLE_DURATION = 3000 // 空闲时间

// 函数轮廓绘制状态
let isDrawingOutline = true // 是否正在绘制轮廓
let outlineProgress = 0 // 轮廓绘制进度
let selectedEquation: 'lissajous' | 'spiral' | 'rose' | 'wave' | 'parametric' | 'butterfly' | 'heart' | 'star' | 'hypocycloid' | 'epicycloid' | 'deltoid' | 'nephroid' = 'lissajous'
let outlineTimer: number | undefined
const OUTLINE_DURATION = 8000 // 轮廓绘制持续时间8秒

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

const route = useRoute()

// 重新初始化粒子(用于路由切换时)
const reinitializeParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  particles = []
  // 根据屏幕大小动态调整粒子数量
  const screenArea = canvas.width * canvas.height
  const baseParticleCount = 65
  const particleDensity = screenArea / (1920 * 1080)
  const dynamicParticleCount = Math.floor(baseParticleCount * Math.sqrt(particleDensity) * 1.2)

  for (let i = 0; i < dynamicParticleCount; i++) {
    const particle = createParticle()
    // 初始时粒子从屏幕外缓慢飞入
    const angle = Math.random() * Math.PI * 2
    const distance = 200 + Math.random() * 300
    particle.x = canvas.width / 2 + Math.cos(angle) * distance
    particle.y = canvas.height / 2 + Math.sin(angle) * distance
    particle.vx = -Math.cos(angle) * (0.5 + Math.random() * 0.5)
    particle.vy = -Math.sin(angle) * (0.5 + Math.random() * 0.5)
    particles.push(particle)
  }

  // 重新选择方程
  const equationTypes: Array<'lissajous' | 'spiral' | 'rose' | 'wave' | 'parametric' | 'butterfly' | 'heart' | 'star' | 'hypocycloid' | 'epicycloid' | 'deltoid' | 'nephroid'> =
    ['lissajous', 'spiral', 'rose', 'wave', 'parametric', 'butterfly', 'heart', 'star', 'hypocycloid', 'epicycloid', 'deltoid', 'nephroid']
  selectedEquation = equationTypes[Math.floor(Math.random() * equationTypes.length)]
  isDrawingOutline = true
  outlineProgress = 0

  // 重新开始轮廓绘制
  const outlineStartTime = Date.now()
  const updateOutlineProgress = () => {
    const elapsed = Date.now() - outlineStartTime
    outlineProgress = Math.min(elapsed / OUTLINE_DURATION, 1)
    if (outlineProgress < 1) {
      outlineTimer = setTimeout(updateOutlineProgress, 16)
    } else {
      isDrawingOutline = false
    }
  }
  updateOutlineProgress()
}

// 监听路由变化,重新初始化粒子
watch(() => route.path, (newPath, oldPath) => {
  // 只在特定页面之间切换时重新初始化
  const particlePages = ['/', '/interest', '/login']
  if (particlePages.includes(newPath) && particlePages.includes(oldPath) && newPath !== oldPath) {
    reinitializeParticles()
  }
})

const createParticle = (x?: number, y?: number, isClick = false): Particle => {
  const canvas = canvasRef.value
  const colors = getColors()
  const isDark = themeStore.theme === 'dark'
  const baseSize = isClick ? 5 : (isDark ? 3 : 2)

  // 所有粒子使用同一个随机选择的方程
  const equationType = selectedEquation

  return {
    x: x ?? Math.random() * (canvas?.width || window.innerWidth),
    y: y ?? Math.random() * (canvas?.height || window.innerHeight),
    vx: (Math.random() - 0.5) * (isClick ? 5 : 1.5),
    vy: (Math.random() - 0.5) * (isClick ? 5 : 1.5),
    size: baseSize + Math.random() * (isDark ? 3 : 2),
    opacity: isDark
      ? (0.7 + Math.random() * 0.3)
      : (0.4 + Math.random() * 0.4),
    color: colors[Math.floor(Math.random() * colors.length)],
    life: isClick ? 150 : Infinity,
    maxLife: isClick ? 150 : Infinity,
    // 数学方程参数
    equationType,
    phase: Math.random() * Math.PI * 2,
    amplitude: 50 + Math.random() * 100,
    frequency: 0.1 + Math.random() * 0.2, // 从0.2-0.7进一步降低到0.1-0.3,大幅降低转动速度
    trail: [],
    // 生命周期管理
    age: 0,
    maxAge: 900 + Math.random() * 600, // 从500-1000延长到900-1500帧(15-25秒)
    fadeIn: true // 新粒子淡入
  }
}

const handleClick = (_e: MouseEvent) => {
  // 爆开特效已禁用,专注于方程展示
  // 保留点击交互但不产生爆发效果
}

const handleMouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.isActive = true
}

const handleMouseLeave = () => {
  mouse.isActive = false
}

// 长按触发聚合效果 - 已禁用
const handleMouseDown = (_e: MouseEvent) => {
  // 聚合效果已禁用,专注于方程展示
}

const handleMouseUp = () => {
  // 聚合效果已禁用
}

// 发散粒子
const disperseParticles = () => {
  isAggregating = false
  cyclePhase = 'dispersing'

  // 创建发散效果
  particles.forEach(p => {
    if (p.isAggregating) {
      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 5
      p.vx = Math.cos(angle) * speed
      p.vy = Math.sin(angle) * speed
      p.isAggregating = false
    }
  })

  // 添加额外的爆发粒子
  for (let i = 0; i < 50; i++) {
    const angle = (Math.PI * 2 * i) / 50
    const speed = 6 + Math.random() * 8
    const particle = createParticle(aggregateCenter.x, aggregateCenter.y, true)
    particle.vx = Math.cos(angle) * speed
    particle.vy = Math.sin(angle) * speed
    particle.size = 2 + Math.random() * 3
    particles.push(particle)
  }

  // 5秒后开始吸附
  if (autoCycleEnabled) {
    setTimeout(() => {
      startAttracting()
    }, ATTRACT_DURATION)
  }
}

// 开始吸附阶段
const startAttracting = () => {
  cyclePhase = 'attracting'

  // 吸附持续5秒后回到空闲状态
  if (autoCycleEnabled) {
    setTimeout(() => {
      cyclePhase = 'idle'
      // 空闲3秒后开始新一轮聚合
      setTimeout(() => {
        startAutoAggregate()
      }, IDLE_DURATION)
    }, ATTRACT_DURATION)
  }
}

// 开始自动聚合
const startAutoAggregate = () => {
  if (!autoCycleEnabled || mouse.isActive) return

  const canvas = canvasRef.value
  if (!canvas) return

  // 随机选择聚合中心
  aggregateCenter = {
    x: canvas.width * (0.3 + Math.random() * 0.4),
    y: canvas.height * (0.3 + Math.random() * 0.4)
  }

  isAggregating = true
  cyclePhase = 'aggregating'

  // 保存原始位置
  particles.forEach(p => {
    if (p.life === Infinity) {
      p.originalX = p.x
      p.originalY = p.y
      p.isAggregating = true
    }
  })

  // 2秒后发散
  setTimeout(() => {
    disperseParticles()
  }, AGGREGATE_DURATION)
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
  // 根据屏幕大小动态调整粒子数量
  const screenArea = canvas.width * canvas.height
  const baseParticleCount = 65 // 从50增加到65,增加粒子密度
  const particleDensity = screenArea / (1920 * 1080) // 相对于1080p的密度
  const dynamicParticleCount = Math.floor(baseParticleCount * Math.sqrt(particleDensity) * 1.2) // 增加20%

  for (let i = 0; i < dynamicParticleCount; i++) {
    const particle = createParticle()
    // 初始时粒子从屏幕外缓慢飞入
    const angle = Math.random() * Math.PI * 2
    const distance = 200 + Math.random() * 300 // 从屏幕外200-500像素处飞入
    particle.x = canvas.width / 2 + Math.cos(angle) * distance
    particle.y = canvas.height / 2 + Math.sin(angle) * distance
    // 向中心缓慢飞入的速度
    particle.vx = -Math.cos(angle) * (0.5 + Math.random() * 0.5)
    particle.vy = -Math.sin(angle) * (0.5 + Math.random() * 0.5)
    particles.push(particle)
  }

  // 随机选择一个方程进行轮廓绘制
  const equationTypes: Array<'lissajous' | 'spiral' | 'rose' | 'wave' | 'parametric' | 'butterfly' | 'heart' | 'star' | 'hypocycloid' | 'epicycloid' | 'deltoid' | 'nephroid'> =
    ['lissajous', 'spiral', 'rose', 'wave', 'parametric', 'butterfly', 'heart', 'star', 'hypocycloid', 'epicycloid', 'deltoid', 'nephroid']
  selectedEquation = equationTypes[Math.floor(Math.random() * equationTypes.length)]
  isDrawingOutline = true
  outlineProgress = 0

  // 开始轮廓绘制进度
  const outlineStartTime = Date.now()
  const updateOutlineProgress = () => {
    const elapsed = Date.now() - outlineStartTime
    outlineProgress = Math.min(elapsed / OUTLINE_DURATION, 1)
    if (outlineProgress < 1) {
      outlineTimer = setTimeout(updateOutlineProgress, 16)
    } else {
      isDrawingOutline = false
    }
  }
  updateOutlineProgress()

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  canvas.addEventListener('click', handleClick)
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mouseup', handleMouseUp)

  // 启动自动循环 - 3秒后开始第一次聚合
  if (autoCycleEnabled) {
    setTimeout(() => {
      startAutoAggregate()
    }, IDLE_DURATION)
  }

  const animate = () => {
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isDark = themeStore.theme === 'dark'
    const time = Date.now() * 0.001

    // 数学方程计算函数 - 适应屏幕大小
    const calculateEquationPosition = (p: Particle, t: number) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const phase = (p.phase || 0) + t * (p.frequency || 1)

      // 根据屏幕大小动态调整振幅
      const screenScale = Math.min(canvas.width, canvas.height) / 800 // 基准800px
      const baseAmp = (p.amplitude || 100) * screenScale * 2.5 // 从2.0扩大到2.5,增大函数轮廓

      switch (p.equationType) {
        case 'lissajous': // 利萨如曲线
          return {
            x: centerX + baseAmp * Math.sin(3 * phase + (p.phase || 0)),
            y: centerY + baseAmp * Math.sin(2 * phase)
          }
        case 'spiral': // 阿基米德螺旋线
          const r = 10 + phase * 8 * screenScale
          return {
            x: centerX + r * Math.cos(phase),
            y: centerY + r * Math.sin(phase)
          }
        case 'rose': // 玫瑰曲线
          const k = 5
          const roseR = baseAmp * Math.cos(k * phase)
          return {
            x: centerX + roseR * Math.cos(phase),
            y: centerY + roseR * Math.sin(phase)
          }
        case 'wave': // 正弦波
          return {
            x: centerX + (phase * 30 * screenScale) % (canvas.width * 0.8) - canvas.width * 0.4,
            y: centerY + baseAmp * Math.sin(phase * 2) * 0.5
          }
        case 'parametric': // 参数方程
          return {
            x: centerX + baseAmp * Math.cos(phase) * (1 + 0.5 * Math.cos(5 * phase)),
            y: centerY + baseAmp * Math.sin(phase) * (1 + 0.5 * Math.sin(5 * phase))
          }
        case 'butterfly': // 蝴蝶曲线
          const butterflyR = baseAmp * (Math.exp(Math.cos(phase)) - 2 * Math.cos(4 * phase) + Math.pow(Math.sin(phase / 12), 5))
          return {
            x: centerX + Math.sin(phase) * butterflyR * 0.3,
            y: centerY + Math.cos(phase) * butterflyR * 0.3
          }
        case 'heart': // 心形曲线
          const heartScale = baseAmp * 0.8
          return {
            x: centerX + heartScale * 16 * Math.pow(Math.sin(phase), 3) / 16,
            y: centerY - heartScale * (13 * Math.cos(phase) - 5 * Math.cos(2 * phase) - 2 * Math.cos(3 * phase) - Math.cos(4 * phase)) / 16
          }
        case 'star': // 星形曲线
          const starR = baseAmp * (1 + 0.5 * Math.cos(5 * phase))
          return {
            x: centerX + starR * Math.cos(phase),
            y: centerY + starR * Math.sin(phase)
          }
        case 'hypocycloid': // 内摆线
          const hypocycloidA = baseAmp
          const hypocycloidB = baseAmp / 4
          return {
            x: centerX + (hypocycloidA - hypocycloidB) * Math.cos(phase) + hypocycloidB * Math.cos((hypocycloidA - hypocycloidB) / hypocycloidB * phase),
            y: centerY + (hypocycloidA - hypocycloidB) * Math.sin(phase) - hypocycloidB * Math.sin((hypocycloidA - hypocycloidB) / hypocycloidB * phase)
          }
        case 'epicycloid': // 外摆线
          const epicycloidA = baseAmp * 0.5
          const epicycloidB = baseAmp * 0.2
          return {
            x: centerX + (epicycloidA + epicycloidB) * Math.cos(phase) - epicycloidB * Math.cos((epicycloidA + epicycloidB) / epicycloidB * phase),
            y: centerY + (epicycloidA + epicycloidB) * Math.sin(phase) - epicycloidB * Math.sin((epicycloidA + epicycloidB) / epicycloidB * phase)
          }
        case 'deltoid': // 三尖点曲线
          const deltoidR = baseAmp * 0.6
          return {
            x: centerX + deltoidR * (2 * Math.cos(phase) + Math.cos(2 * phase)),
            y: centerY + deltoidR * (2 * Math.sin(phase) - Math.sin(2 * phase))
          }
        case 'nephroid': // 肾形线
          const nephroidR = baseAmp * 0.5
          return {
            x: centerX + nephroidR * (3 * Math.cos(phase) - Math.cos(3 * phase)),
            y: centerY + nephroidR * (3 * Math.sin(phase) - Math.sin(3 * phase))
          }
        default:
          return { x: p.x, y: p.y }
      }
    }

    const connectionOpacity = isDark ? 0.15 : 0.2  // 深色模式降低连接线亮度
    const glowMultiplier = isDark ? 3 : 3  // 降低粒子光晕

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      // 生命周期管理
      if (p.age !== undefined && p.maxAge !== undefined) {
        p.age++

        // 淡入效果
        if (p.fadeIn && p.age < 60) {
          p.opacity = (p.age / 60) * (isDark ? 1.0 : 0.8)
        }
        // 淡出效果
        else if (p.age > p.maxAge - 60) {
          const fadeOutProgress = (p.maxAge - p.age) / 60
          p.opacity = fadeOutProgress * (isDark ? 1.0 : 0.8)
        }

        // 粒子死亡,移除并生成新粒子
        if (p.age >= p.maxAge) {
          particles.splice(i, 1)
          // 生成新粒子飘入
          const newParticle = createParticle()
          newParticle.x = Math.random() * canvas.width
          newParticle.y = -50 // 从屏幕上方飘入
          newParticle.vy = 0.3 + Math.random() * 0.5 // 向下缓慢飘入(从1-3降低到0.3-0.8)
          particles.push(newParticle)
          continue
        }
      }

      // 应用数学方程运动
      if (p.equationType && p.life === Infinity && !isAggregating && cyclePhase === 'idle') {
        const targetPos = calculateEquationPosition(p, time)
        const dx = targetPos.x - p.x
        const dy = targetPos.y - p.y

        // 平滑过渡到目标位置 - 降低速度,从0.05降低到0.015
        const smoothFactor = isDrawingOutline ? 0.017 : 0.034 // 从0.015/0.03增加15%到0.017/0.034
        p.vx = dx * smoothFactor
        p.vy = dy * smoothFactor

        // 保存轨迹
        if (p.trail) {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 100) { // 从49增加到100,加长粒子轨迹
            p.trail.shift()
          }
        }
      }
      // 聚合效果
      if (isAggregating && p.isAggregating) {
        const dx = aggregateCenter.x - p.x
        const dy = aggregateCenter.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 5) {
          const force = 0.15
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          p.vx *= 0.95
          p.vy *= 0.95
        } else {
          p.vx *= 0.8
          p.vy *= 0.8
        }
      }
      // 吸附阶段 - 粒子缓慢向中心移动
      else if (cyclePhase === 'attracting' && p.life === Infinity) {
        const centerX = (canvas?.width || window.innerWidth) / 2
        const centerY = (canvas?.height || window.innerHeight) / 2
        const dx = centerX - p.x
        const dy = centerY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 50) {
          const force = 0.008 // 从0.02降低到0.008,减缓吸附速度
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          // 添加速度衰减,使运动更加平滑缓慢
          p.vx *= 0.98
          p.vy *= 0.98
        }
      }
      // 鼠标吸引 - 增强跟随效果
      else if (mouse.isActive && !isAggregating) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < props.mouseRadius) {
          const force = (props.mouseRadius - dist) / props.mouseRadius
          // 深色模式下更强的吸引效果
          const attractStrength = isDark ? 0.12 : 0.06
          p.vx += (dx / dist) * force * attractStrength
          p.vy += (dy / dist) * force * attractStrength

          // 添加旋转效果
          const angle = Math.atan2(dy, dx) + Math.PI / 2
          const rotateStrength = 0.02
          p.vx += Math.cos(angle) * rotateStrength
          p.vy += Math.sin(angle) * rotateStrength
        }
      }

      // 添加轻微波动效果
      if (!isAggregating) {
        p.vx += (Math.random() - 0.5) * 0.05 // 从0.03增加到0.05,增加波动
        p.vy += (Math.random() - 0.5) * 0.05 // 从0.03增加到0.05,增加波动
      }

      p.x += p.vx
      p.y += p.vy

      // 速度衰减 - 降低衰减率,让粒子保持更高速度
      p.vx *= 0.995 // 从0.98增加到0.995,降低衰减
      p.vy *= 0.995 // 从0.98增加到0.995,降低衰减

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

      // 绘制轨迹 - 增强科技感
      if (p.trail && p.trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(p.trail[0].x, p.trail[0].y)
        for (let j = 1; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y)
        }
        ctx.strokeStyle = p.color + (p.opacity * 0.5) + ')' // 从0.3提高到0.5,增加轨迹透明度
        ctx.lineWidth = p.size * 0.8 // 从0.5提高到0.8,增加轨迹宽度
        ctx.stroke()
      }

      // 发光效果 - 深色模式更强
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * glowMultiplier)
      gradient.addColorStop(0, p.color + p.opacity * 0.5 + ')')
      gradient.addColorStop(1, p.color + '0)')
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * glowMultiplier, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // 连接线 - 增强效果
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

          // 添加脉冲效果
          const pulse = Math.sin(time * 2 + i * 0.1 + j * 0.1) * 0.3 + 0.7
          const finalOpacity = opacity * pulse

          // 鼠标附近的连接线更亮
          let lineOpacity = finalOpacity
          if (mouse.isActive) {
            const midX = (p1.x + p2.x) / 2
            const midY = (p1.y + p2.y) / 2
            const mouseDist = Math.sqrt(
              Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2)
            )
            if (mouseDist < props.mouseRadius) {
              lineOpacity *= 1.5
            }
          }

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(${lineColor}, ${Math.min(lineOpacity, 1)})`
          ctx.lineWidth = isDark ? 1.5 : 0.8
          ctx.stroke()
        }
      }
    }

    // 绘制函数轮廓 - 增强科技感,适应屏幕大小
    if (isDrawingOutline && outlineProgress > 0) {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxPoints = 200
      const currentPoints = Math.floor(maxPoints * outlineProgress)

      // 根据屏幕大小动态调整振幅
      const screenScale = Math.min(canvas.width, canvas.height) / 800
      const baseAmp = 100 * screenScale * 2.5 // 从2.0扩大到2.5,增大函数轮廓

      ctx.beginPath()
      for (let i = 0; i <= currentPoints; i++) {
        const t = (i / maxPoints) * Math.PI * 4

        let x: number, y: number
        switch (selectedEquation) {
          case 'lissajous':
            x = centerX + baseAmp * Math.sin(3 * t)
            y = centerY + baseAmp * Math.sin(2 * t)
            break
          case 'spiral':
            const r = 10 + t * 8 * screenScale
            x = centerX + r * Math.cos(t)
            y = centerY + r * Math.sin(t)
            break
          case 'rose':
            const roseR = baseAmp * Math.cos(5 * t)
            x = centerX + roseR * Math.cos(t)
            y = centerY + roseR * Math.sin(t)
            break
          case 'wave':
            x = centerX + (t * 30 * screenScale) % (canvas.width * 0.8) - canvas.width * 0.4
            y = centerY + baseAmp * Math.sin(t * 2) * 0.5
            break
          case 'parametric':
            x = centerX + baseAmp * Math.cos(t) * (1 + 0.5 * Math.cos(5 * t))
            y = centerY + baseAmp * Math.sin(t) * (1 + 0.5 * Math.sin(5 * t))
            break
          default:
            x = centerX
            y = centerY
        }

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      // 轮廓样式
      const outlineOpacity = 0.3 + outlineProgress * 0.4
      ctx.strokeStyle = isDark
        ? `rgba(129, 140, 248, ${outlineOpacity})`
        : `rgba(99, 102, 241, ${outlineOpacity})`
      ctx.lineWidth = 2
      ctx.stroke()

      // 发光效果
      ctx.shadowColor = isDark ? 'rgba(129, 140, 248, 0.5)' : 'rgba(99, 102, 241, 0.3)'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // 鼠标光晕 - 已禁用
    // if (mouse.isActive) {
    //   const mouseGlowSize = isDark ? 200 : 120
    //   const gradient = ctx.createRadialGradient(
    //     mouse.x, mouse.y, 0,
    //     mouse.x, mouse.y, mouseGlowSize
    //   )
    //   
    //   if (isDark) {
    //     gradient.addColorStop(0, 'rgba(129, 140, 248, 0.25)')
    //     gradient.addColorStop(0.3, 'rgba(167, 139, 250, 0.15)')
    //     gradient.addColorStop(0.6, 'rgba(96, 165, 250, 0.08)')
    //     gradient.addColorStop(1, 'rgba(129, 140, 248, 0)')
    //   } else {
    //     gradient.addColorStop(0, 'rgba(99, 102, 241, 0.12)')
    //     gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)')
    //     gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
    //   }
    //   
    //   ctx.beginPath()
    //   ctx.arc(mouse.x, mouse.y, mouseGlowSize, 0, Math.PI * 2)
    //   ctx.fillStyle = gradient
    //   ctx.fill()
    // }

    // 深色模式额外科技效果 - 已禁用，保持纯黑
    // if (isDark) {
    //   // 六边形网格点
    //   const time = Date.now() * 0.001
    //   const hexSize = 60
    //   for (let x = 0; x < canvas.width; x += hexSize) {
    //     for (let y = 0; y < canvas.height; y += hexSize * 0.866) {
    //       const offsetX = (Math.floor(y / (hexSize * 0.866)) % 2) * (hexSize / 2)
    //       const px = x + offsetX
    //       const pulse = Math.sin(time + px * 0.01 + y * 0.01) * 0.5 + 0.5
    //       const opacity = pulse * 0.15
    //       
    //       ctx.beginPath()
    //       ctx.arc(px, y, 1.5, 0, Math.PI * 2)
    //       ctx.fillStyle = `rgba(129, 140, 248, ${opacity})`
    //       ctx.fill()
    //     }
    //   }
    // }

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
    canvasRef.value.removeEventListener('mousedown', handleMouseDown)
    canvasRef.value.removeEventListener('mouseup', handleMouseUp)
  }
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (aggregateTimer) {
    clearTimeout(aggregateTimer)
  }
  if (cycleTimer) {
    clearTimeout(cycleTimer)
  }
  if (outlineTimer) {
    clearTimeout(outlineTimer)
  }
  // 禁用自动循环
  autoCycleEnabled = false
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
