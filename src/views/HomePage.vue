<template>
  <div class="container mt-4">
    <h2 class="mb-4">Welcome to CrabAlert</h2>

    <div class="mb-4">
      <img src="@/assets/homepage.jpg" alt="CrabAlert Group" class="img-fluid rounded" />
    </div>

    <h4>About Us</h4>
    <p>
      CrabAlert is a dedicated team focused on monitoring salinity levels in water bodies, ensuring the optimal environment for marine life. Our system uses real-time data to provide insights and alerts for salinity changes.
    </p>

    <h4>Salinity Monitoring Overview</h4>
    <p>
      This platform offers real-time monitoring of salinity levels, ensuring water quality and providing critical data for environmental protection. Here, you can track salinity levels, see historical trends, and receive alerts based on predefined thresholds.
    </p>
  </div>
</template>

<script>
import { useSensorStore } from '../stores/Sensorstore';

export default {
  name: 'HomePage',
  computed: {
    totalReadings() {
      return useSensorStore().totalReadings;
    },
    currentSalinity() {
      return useSensorStore().currentSalinity;
    },
    alerts() {
      return useSensorStore().alerts;
    },
    historicalData() {
      return useSensorStore().historicalData;
    }
  }
};
</script>

<style>
.card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.card-icon {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  opacity: 0.3;
}

img {
  width: 100%;
  max-height: 700px;
  object-fit: cover;
}
</style>
