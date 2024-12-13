import { defineStore } from 'pinia';

export const useSensorStore = defineStore('sensorStore', {
  state: () => ({
    salinity: null,
    logs: []
  }),
  actions: {
    updateSensorData({ salinity }) {
      if (salinity === null || salinity === undefined || isNaN(salinity)) {
        console.error("Invalid salinity data:", salinity);
        return; 
      }
      this.salinity = salinity;
      this.logs.push({ time: new Date().toLocaleTimeString(), salinity });
      console.log("Updated salinity:", this.salinity);
    }
  },
  persist: true 
});
