<!-- src/components/common/BaseChart.vue -->
<template>
  <div ref="chartRef" class="base-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import {
  LineChart,
  BarChart,
  // 以后要用其他图表可以在这引入
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

/**
 * 按需注册需要的组件
 */
echarts.use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
])

// 接收一个 options
const props = defineProps<{
  option: echarts.EChartsCoreOption
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
}

const resizeChart = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 监听外部 option 变化，更新图表
watch(
  () => props.option,
  newOption => {
    if (chart && newOption) {
      chart.setOption(newOption, true)
    }
  },
  { deep: true },
)
</script>

<style scoped>
.base-chart {
  width: 100%;
  height: 260px; /* 可以按需调整高度，或通过外部容器控制 */
}
</style>
