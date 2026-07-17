export const spikeProfile = {
  stages: [
    { duration: '10s', target: 10 }, // Baseline
    { duration: '10s', target: 200 },// Spike!
    { duration: '30s', target: 200 },// Hold spike
    { duration: '20s', target: 10 }, // Scale down
    { duration: '10s', target: 0 },  // Recovery
  ],
};
