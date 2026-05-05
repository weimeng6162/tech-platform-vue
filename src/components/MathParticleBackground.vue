<template>
  <canvas ref="canvasRef" class="math-particle-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number
let particles: Particle[] = []
let mouseX = 0
let mouseY = 0

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  type: 'rose' | 'butterfly' | 'harmonic' | 'spiral' | 'fractal'
  t: number
  speed: number
  radius: number
  color: string
  alpha: number
  trail: { x: number; y: number; alpha: number }[]
  params: {
    n: number
    k: number
    phase: number
    amplitude: number
  }
}

const props = withDefaults(defineProps<{
  particleCount?: number
  showConnections?: boolean
  trajectoryType?: 'rose' | 'butterfly' | 'harmonic' | 'spiral' | 'fractal' | 'random'
}>(), {
  particleCount: 150,
  showConnections: true,
  trajectoryType: 'random'
})

const colors = [
  'rgba(99, 102, 241, ',  // 靛蓝
  'rgba(139, 92, 246, ',  // 紫色
  'rgba(168, 85, 247, '   // 辅助紫
]

let currentTrajectory: Particle['type'] = 'rose'

const initParticles = (width: number, height: number) => {
  particles = []
  const centerX = width / 2
  const centerY = height / 2
  
  const types: Particle['type'][] = ['rose', 'butterfly', 'harmonic', 'spiral', 'fractal']
  
  // 确定使用的轨迹类型
  if (props.trajectoryType === 'random') {
    currentTrajectory = types[Math.floor(Math.random() * types.length)]
  } else {
    currentTrajectory = props.trajectoryType as Particle['type']
  }
  
  for (let i = 0; i < props.particleCount; i++) {
    const t = Math.random() * Math.PI * 2
    
    particles.push({
      x: centerX,
      y: centerY,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      type: currentTrajectory,
      t,
      speed: (0.0003 + Math.random() * 0.0005) * 0.5,
      radius: 250 + Math.random() * 350,
      color: colors[i % colors.length],
      alpha: 0.3 + Math.random() * 0.5,
      trail: [],
      params: {
        n: 2 + Math.floor(Math.random() * 5),
        k: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.5 + Math.random() * 0.5
      }
    })
  }
}

// Rose曲线: r = cos(n*θ) 极坐标玫瑰曲线
const updateRose = (p: Particle, time: number, width: number, height: number) => {
  const centerX = width / 2
  const centerY = height / 2
  const t = time * p.speed + p.t
  const n = p.params.n
  const k = p.params.k
  
  const theta = t * 2
  const r = p.radius * Math.cos(n * theta) * k
  
  p.x = centerX + r * Math.cos(theta)
  p.y = centerY + r * Math.sin(theta)
}

// 蝴蝶曲线: 复杂的高阶三角函数组合
const updateButterfly = (p: Particle, time: number, width: number, height: number) => {
  const centerX = width / 2
  const centerY = height / 2
  const t = time * p.speed + p.t
  
  // 蝴蝶曲线参数方程
  const exp = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5)
  const scale = p.radius * 0.15 * p.params.amplitude
  
  p.x = centerX + scale * Math.sin(t) * exp
  p.y = centerY + scale * Math.cos(t) * exp
}

// 谐波叠加: 多个正弦波叠加形成的复杂曲线
const updateHarmonic = (p: Particle, time: number, width: number, height: number) => {
  const centerX = width / 2
  const centerY = height / 2
  const t = time * p.speed + p.t
  
  // 高阶谐波叠加
  let x = 0, y = 0
  const harmonics = 5
  
  for (let i = 1; i <= harmonics; i++) {
    const freq = i + p.params.n * 0.5
    const amp = 1 / (i * p.params.k)
    const phase = p.params.phase * i
    
    x += amp * Math.sin(freq * t + phase)
    y += amp * Math.cos(freq * t + phase * 1.5)
  }
  
  p.x = centerX + x * p.radius * 0.5
  p.y = centerY + y * p.radius * 0.5
}

// 螺旋线: 阿基米德螺旋 + 对数螺旋混合
const updateSpiral = (p: Particle, time: number, width: number, height: number) => {
  const centerX = width / 2
  const centerY = height / 2
  const t = time * p.speed + p.t
  
  // 混合螺旋: 阿基米德螺旋 (r = a*θ) + 对数螺旋 (r = a*e^(b*θ))
  const theta = t * 3
  const a = p.radius * 0.05
  const b = p.params.k * 0.1
  
  // 对数螺旋部分
  const rLog = a * Math.exp(b * theta) * 0.3
  // 阿基米德螺旋部分
  const rArch = a * theta * 0.3
  // 混合
  const r = rLog * Math.sin(p.params.phase) + rArch * Math.cos(p.params.phase)
  
  p.x = centerX + r * Math.cos(theta)
  p.y = centerY + r * Math.sin(theta)
}

// 分形轨迹: 递归三角函数生成类分形轨迹
const updateFractal = (p: Particle, time: number, width: number, height: number) => {
  const centerX = width / 2
  const centerY = height / 2
  const t = time * p.speed + p.t
  
  // 分形函数: 递归嵌套的三角函数
  const depth = 3
  let x = t, y = t
  
  for (let i = 0; i < depth; i++) {
    const scale = Math.pow(0.5, i) * p.params.amplitude
    x = Math.sin(x * p.params.n + p.params.phase) * scale + x * 0.3
    y = Math.cos(y * p.params.n + p.params.phase) * scale + y * 0.3
  }
  
  p.x = centerX + x * p.radius * 0.4
  p.y = centerY + y * p.radius * 0.4
}

const update = (time: number, width: number, height: number) => {
  for (const p of particles) {
    const oldX = p.x
    const oldY = p.y
    
    switch (p.type) {
      case 'rose':
        updateRose(p, time, width, height)
        break
      case 'butterfly':
        updateButterfly(p, time, width, height)
        break
      case 'harmonic':
        updateHarmonic(p, time, width, height)
        break
      case 'spiral':
        updateSpiral(p, time, width, height)
        break
      case 'fractal':
        updateFractal(p, time, width, height)
        break
    }
    
    // 更新拖尾
    p.trail.push({ x: oldX, y: oldY, alpha: p.alpha })
    if (p.trail.length > 15) {
      p.trail.shift()
    }
  }
}

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
  // 绘制粒子连接
  if (props.showConnections) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i]
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15
          ctx.strokeStyle = `rgba(0, 242, 255, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          
          // 贝塞尔曲线连接
          const midX = (p1.x + p2.x) / 2 + (dy * 0.1)
          const midY = (p1.y + p2.y) / 2 - (dx * 0.1)
          ctx.quadraticCurveTo(midX, midY, p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
  }
  
  // 绘制粒子
  for (const p of particles) {
    // 绘制光尾 - 渐变效果
    for (let i = 0; i < p.trail.length; i++) {
      const t = p.trail[i]
      const progress = i / p.trail.length
      const trailAlpha = progress * progress * t.alpha * 0.6
      const size = 0.5 + progress * 3
      
      ctx.fillStyle = p.color + trailAlpha + ')'
      ctx.beginPath()
      ctx.arc(t.x, t.y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 绘制主粒子光斑
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5)
    gradient.addColorStop(0, p.color + p.alpha + ')')
    gradient.addColorStop(0.4, p.color + p.alpha * 0.6 + ')')
    gradient.addColorStop(1, p.color + '0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
    ctx.fill()
    
    // 中心亮点
    ctx.fillStyle = p.color + p.alpha + ')'
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

const animate = (time: number) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  update(time, canvas.width, canvas.height)
  draw(ctx)
  
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight
  canvas.width = width
  canvas.height = height
  initParticles(width, height)
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

onMounted(() => {
  nextTick(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    
    // 确保canvas尺寸正确
    canvas.width = width
    canvas.height = height
    
    // 初始化粒子
    initParticles(width, height)
    
    // 立即绘制第一帧
    const ctx = canvas.getContext('2d')
    if (ctx) {
      update(0, width, height)
      draw(ctx)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    
    // 开始动画
    animate(0)
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.math-particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  max-width: 100%;
}
</style>
