module.exports = {
  apps: [{
    name: "frontend", // Replace with your desired application name
    script: "npm start",
    env: {
      NODE_ENV: "development", // Set the environment variable for development
    },
    // Optional configuration for scaling and advanced settings
    // instances: 1, // Number of worker processes (default: 1)
    // exec_mode: "cluster", // Execution mode (default: "fork")
  }],
};
