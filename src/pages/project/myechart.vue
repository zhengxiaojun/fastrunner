<template>
    <div class="echarts">
        <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick" />
    </div>
</template>

<script type="text/babel">
    import IEcharts from 'vue-echarts-v3/src/full.js';
  export default {
    name: 'myechart',
    components: {
      IEcharts
    },
    props: {
        projectInfo:Object
    },
    data: () => ({
      loading: true,
      bar: {
        title: {
          text: ''
        },
        color: ['#3398DB'],
        tooltip: {},
        xAxis: {
          data: ['用例数', '套件数', '层级标签数', '报告数', '任务数']
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: []
        }]
      },
      line: {
        title: {
          text: 'ECharts Hello World'
        },
        tooltip: {},
        xAxis: {
          data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
        },
        yAxis: {},
        series: [{
          name: 'Sales',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }]
      },
      pie: {
        title: {
          text: 'ECharts Hello World'
        },
        tooltip: {},
        series: [{
          name: ['Sales1','Sales2','Sales3','Sales4','Sales5'],
          type: 'pie',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }),
    methods: {
      doRandom() {
        const that = this;
        let data = [];
        for (let i = 0, min = 5, max = 99; i < 6; i++) {
          data.push(Math.floor(Math.random() * (max + 1 - min) + min));
        }
        // that.loading = !that.loading;
        that.bar.series[0].data = data;
      },
      onReady(instance, ECharts) {
        console.log(instance, ECharts);
        setTimeout(() => {
            this.bar.series[0].data.push(this.projectInfo.case_count);
            this.bar.series[0].data.push(this.projectInfo.suite_count);
            this.bar.series[0].data.push(this.projectInfo.leveltag_count);
            this.bar.series[0].data.push(this.projectInfo.report_count);
            this.bar.series[0].data.push(this.projectInfo.task_count);
        }, 500);

        this.loading = false;
      },
      onClick(event, instance, ECharts) {
        console.log(arguments);
      }
    }
  };
</script>

<style scoped>
    .echarts {
        width: 1000px;
        height: 400px;
    }
</style>

<!-- https://www.echartsjs.com/examples/zh/index.html#chart-type-line -->
