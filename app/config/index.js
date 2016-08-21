"use strict";

var config = {
  captcha: {
    enabled: process.env.CPUK || false,
    publicKey: process.env.CPUK,
    privateKey: process.env.CPIK
  },
  db: {
    port: process.env.MPORT || 27017,
    host: process.env.MHOST || "127.0.0.1",
    databaseName: process.env.DB || "test"
  },
  node: {
    port: process.env.PORT || 4001
  }
};

console.log("Using the following configuration");
console.log("---------------------------------");
console.log(JSON.stringify(config, null, 2));

module.exports = config;