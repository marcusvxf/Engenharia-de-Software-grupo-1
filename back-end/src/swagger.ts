const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Engenharia de Software - Grupo 1',
    description: 'API para o Engenharia de Software - Grupo 1',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./endpoints.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index'); // Your project's root file
});
