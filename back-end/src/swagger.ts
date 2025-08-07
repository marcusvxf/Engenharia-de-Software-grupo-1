const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Engenharia de Software - Grupo 1',
    description: 'API para o projeto de Engenharia de Software - Grupo 1',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

// Corrigido: O arquivo de saída será o swagger.json que já existe
const outputFile = './swagger.json'; 

// Corrigido: Apontamos para o arquivo que usa todas as nossas rotas
const endpointsFiles = ['./src/index.ts']; 

// Esta linha executa a geração da documentação com base nos arquivos de rotas
swaggerAutogen(outputFile, endpointsFiles, doc);