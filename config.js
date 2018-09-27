/*
* Configuration file for HTTP & HTTPS, ports and enviroment
*/

'use strict'

let enviroments = {}

// (Default) Staging Enviroment
enviroments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
}

// Production Enviroment
enviroments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
}

// Determine the enviroment that is passed
let currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Check that the enviroment is one of the above, if not, default to staging
let enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

module.exports = enviromentToExport;