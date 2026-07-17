export const volumeProfile = {
  stages: [
    { duration: '2m', target: 300 }, // Slowly ramp up to high volume
    { duration: '1h', target: 300 }, // Sustain high volume for a long duration
    { duration: '2m', target: 0 },   // Ramp down
  ],
};
