export const stressProfile = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 50 },  // Normal load
    { duration: '30s', target: 100 },// Ramp up to 100 users (stress)
    { duration: '2m', target: 100 }, // Hold stress load
    { duration: '30s', target: 0 },  // Ramp down to 0
  ],
};
