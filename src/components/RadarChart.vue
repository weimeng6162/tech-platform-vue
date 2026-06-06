<template>
  <div ref="containerRef" class="radar-container">
    <VChart
      v-if="option"
      :option="option"
      :autoresize="true"
      class="radar-instance"
    />
    <div v-else class="radar-empty">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { RadarChart as ERadar } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([ERadar, TooltipComponent, LegendComponent, CanvasRenderer])

interface RadarDataItem {
  name: string
  weight: number
}

const props = defineProps<{
  data: RadarDataItem[]
}>()

const containerRef = ref<HTMLElement>()

const option = computed(() => {
  if (!props.data.length) return null

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 15, 30, 0.92)',
      borderColor: 'rgba(99, 102, 241, 0.4)',
      textStyle: { color: '#e2e8f0', fontSize: 13 },
    },
    legend: { show: false },
    radar: {
      center: ['50%', '50%'],
      radius: '65%',
      indicator: props.data.map((d) => ({
        name: d.name,
        max: 100,
      })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#94a3b8',
        fontSize: 12,
        borderRadius: 4,
        padding: [3, 6],
      },
      axisLine: {
        lineStyle: { color: 'rgba(99, 102, 241, 0.35)' },
      },
      splitLine: {
        lineStyle: { color: 'rgba(99, 102, 241, 0.15)', type: 'dashed' },
      },
      splitArea: {
        areaStyle: {
          color: [
            'rgba(99, 102, 241, 0.04)',
            'rgba(99, 102, 241, 0.02)',
          ],
        },
      },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: {
          color: '#22d3ee',
          width: 1.5,
          shadowBlur: 8,
          shadowColor: 'rgba(34, 211, 238, 0.5)',
        },
        areaStyle: {
          color: 'rgba(34, 211, 238, 0.12)',
        },
        itemStyle: {
          color: '#22d3ee',
          borderColor: 'rgba(34, 211, 238, 0.6)',
          borderWidth: 1.5,
        },
        data: [
          {
            value: props.data.map((d) => d.weight),
            name: '技术能力',
          },
        ],
      },
    ],
  }
})
</script>

<style scoped>
.radar-container {
  width: 100%;
  height: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-instance {
  width: 100%;
  height: 100%;
  min-height: 280px;
}

.radar-empty {
  color: var(--text-tertiary);
  font-size: 0.85rem;
}
</style>
