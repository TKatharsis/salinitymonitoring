<template>
  <div style="padding: 20px;">
    <h1>Salinity Monitoring System</h1>

    <!-- Alert Banner -->
    <div v-if="salinityAlert !== 'normal'" :style="alertStyle(salinityAlert)" class="alert-banner">
      <span v-if="salinityAlert === 'high'">Warning: Salinity is too high!</span>
      <span v-if="salinityAlert === 'low'">Warning: Salinity is too low!</span>
    </div>

    <!-- Display Layout -->
    <div style="display: flex; justify-content: space-between; gap: 20px; margin-top: 20px">
      <!-- Historical Data -->
      <div style="flex: 1; border: 1px solid #ddd; border-radius: 8px; background: #fff; padding: 20px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1)">
        <h2 style="text-align: center; margin-bottom: 20px;">Historical Data</h2>
        <div id="historicalDataChart" style="width: 100%; height: 400px"></div>
      </div>

      <!-- Salinity Graph -->
      <div style="flex: 1; border: 1px solid #ddd; border-radius: 8px; background: #fff; padding: 20px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1)">
        <h2 style="text-align: center; margin-bottom: 20px;">Salinity Graph</h2>
        <div id="salinityGraphChart" style="width: 100%; height: 400px"></div>
      </div>

      <!-- Salinity Alert System -->
      <div style="flex: 1; border: 1px solid #ddd; border-radius: 8px; background: #fff; padding: 20px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1)">
        <h2 style="text-align: center; margin-bottom: 20px;">Salinity Alert System</h2>

        <div style="text-align: center; font-size: 24px;">
          Current Status: <span>{{ salinityValue }} ppt</span>
        </div>

        <div v-if="salinityAlert !== 'normal'" style="text-align: center; font-size: 18px; margin-top: 10px;">
          <strong>ALERT: {{ alertMessage }}</strong>
        </div>
        <div v-if="salinityAlert === 'normal'" style="text-align: center; font-size: 18px; margin-top: 10px;">
          <strong>Salinity levels are normal.</strong>
        </div>

        <!-- Threshold Input Fields -->
        <div style="margin-top: 30px;">
          <label for="minThreshold" style="font-weight: bold;">Min Threshold (ppt):</label>
          <input type="number" v-model="minThreshold" :min="0" style="padding: 5px; margin-left: 10px; width: 80px;" />
          <label for="maxThreshold" style="font-weight: bold; margin-left: 20px;">Max Threshold (ppt):</label>
          <input type="number" v-model="maxThreshold" :min="0" style="padding: 5px; margin-left: 10px; width: 80px;" />
        </div>
      </div>
    </div>

    <!-- Logs Section -->
    <div style="margin-top: 20px;">
      <h3>Logs</h3>
      <div style="background: #f7f7f7; border-radius: 8px; padding: 10px;">
        <ul style="padding: 10px; list-style: none; font-size: 14px;">
          <li v-for="(log, index) in logs" :key="index" style="margin-bottom: 8px;">
            {{ log }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import mqttService from "@/services/mqttService";
import { useSensorStore } from "@/stores/Sensorstore";
import * as echarts from "echarts";
import { database } from "@/assets/firebaseconfig.js";  // Import Firebase configuration
import { ref, get } from "firebase/database";  // Firebase functions for database

export default {
  data() {
    return {
      logs: [],
      salinityValue: 0,
      salinityAlert: "normal", // default alert state
      alertMessage: "Salinity levels are normal.", // Default message
      historicalData: [], // Store historical data for chart
      realTimeData: [], // Store real-time salinity data
      timeStamps: [], // Store timestamps for chart

      // User-defined salinity thresholds
      minThreshold: 11,
      maxThreshold: 15,
    };
  },
  computed: {
    temperatureAlert() {
      return useSensorStore().checkTemperatureAlert;
    },
    humidityAlert() {
      return useSensorStore().checkHumidityAlert;
    },
  },
  methods: {
    addLog(message) {
      this.logs.push(message);
      if (this.logs.length > 50) this.logs.shift();
    },
    initializeCharts() {
      this.historicalDataChart = echarts.init(document.getElementById("historicalDataChart"));
      this.salinityGraphChart = echarts.init(document.getElementById("salinityGraphChart"));

      const baseChartOptions = {
        xAxis: { type: "category", data: this.timeStamps },
        yAxis: { type: "value" },
        series: [{ type: "line", smooth: true, data: this.realTimeData }],
      };

      this.historicalDataChart.setOption({
        ...baseChartOptions,
        series: [{ ...baseChartOptions.series[0], name: "Historical Salinity", color: "#36a2eb" }],
      });

      this.salinityGraphChart.setOption({
        ...baseChartOptions,
        series: [{ ...baseChartOptions.series[0], name: "Real-Time Salinity", color: "#ff6384" }],
      });
    },
    updateChart(chart, payload, label) {
      const timestamp = new Date().toLocaleTimeString();
      this.timeStamps.push(timestamp);
      this.realTimeData.push(Number(payload));

      chart.setOption({
        xAxis: { data: this.timeStamps.slice(-20) },
        series: [{ data: this.realTimeData.slice(-20) }],
      });

      this.addLog(`${label}: ${payload} at ${timestamp}`);
    },
    updateSalinityGraph(payload) {
      this.updateChart(this.salinityGraphChart, payload, "Salinity");
      this.salinityValue = payload;
      this.checkSalinityAlert(payload);
    },
    checkSalinityAlert(value) {
      if (value < this.minThreshold) {
        this.salinityAlert = "low";
        this.alertMessage = `Salinity levels too low! (Below ${this.minThreshold} ppt)`;
      } else if (value > this.maxThreshold) {
        this.salinityAlert = "high";
        this.alertMessage = `Salinity levels too high! (Above ${this.maxThreshold} ppt)`;
      } else {
        this.salinityAlert = "normal";
        this.alertMessage = "Salinity levels are normal.";
      }
    },
    alertStyle(alertType) {
      const styles = {
        high: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
        low: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" },
        normal: { display: "none" },
      };
      return styles[alertType] || { display: "none" };
    },
    connectAndSubscribe() {
      this.addLog("Connecting to MQTT broker...");
      mqttService.connectAndSubscribe(
        (message) => {
          const { topic, salinity } = message;
          if (topic === "pond/salinity") {
            this.updateSalinityGraph(salinity);
          }
        },
        (error) => {
          this.addLog(`MQTT Error: ${error.message}`);
        }
      );
    },

    async fetchHistoricalData() {
      try {
        const dbRef = ref(database, "sensorData"); // Reference to your database path
        const snapshot = await get(dbRef);  // Fetch data from the database
        const data = snapshot.val();

        // Log the raw data fetched from Firebase
        console.log('Raw Firebase Data:', JSON.stringify(data));

        // Get the current date and filter for the current month
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        console.log('Start of the month (timestamp):', startOfMonth);
        console.log('End of the month (timestamp):', endOfMonth);

        // Prepare historical data arrays
        this.historicalData = [];
        this.timeStamps = [];

        for (const key in data) {
          const timestamp = new Date(data[key].timestamp).getTime(); 

          // Log the individual timestamps to verify the values
          console.log('Data Timestamp:', timestamp);

          if (timestamp >= startOfMonth && timestamp <= endOfMonth) {
              const salinity = data[key]["salinity (ppt)"];  
            this.historicalData.push(salinity);
            this.timeStamps.push(new Date(timestamp).toLocaleDateString());
          }
        }

        // Update the chart after fetching historical data
        this.historicalDataChart.setOption({
          xAxis: { data: this.timeStamps },
          series: [{ data: this.historicalData }],
        });

        // Log the processed data
        console.log('Processed Historical Data:', this.historicalData);

      } catch (error) {
        console.error("Error fetching historical data:", error);
        this.addLog("Error fetching historical data.");
      }
    },
  },
  mounted() {
    this.connectAndSubscribe();
    this.fetchHistoricalData(); // Fetch historical data on mount
    this.initializeCharts(); // Initialize charts
  },
};
</script>

<style scoped>
.alert-banner {
  padding: 10px;
  text-align: center;
  margin: 10px 0;
  font-weight: bold;
  border-radius: 5px;
}
</style>
