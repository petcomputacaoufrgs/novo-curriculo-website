import axios, { AxiosInstance } from 'axios';

// Usando a axios, além de deixar a declaração das requisições mais concisas definindo uma URL base e deixando evidente o método HTTP usado, 
// temos Conversão automática de JSON e Tratamento automático de erros na chamada da requisição

const api:AxiosInstance = axios.create({
     /* baseURL: "https://test-render-uimd.onrender.com" */ 
      baseURL: 'http://backend:8000'

})

export default api;
