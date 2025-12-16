const request = require('supertest');
const app = require('../src/index'); 
const mongoose = require('mongoose');

/*
 * ------------------------------------------------------------------
 * SUITE DE PRUEBAS DE INTEGRACIÓN: API PRODUCTOS
 * ------------------------------------------------------------------
 * Conjunto de tests automatizados para validar la disponibilidad
 * y consistencia de los endpoints del catálogo.
 */
describe('Endpoint: GET /api/products', () => {
  
  /*
   * CASO DE PRUEBA 1: OBTENCIÓN DE CATÁLOGO
   * Objetivo: Verificar respuesta exitosa y formato de datos.
   */
  it('Debería responder con status 200 y devolver un array JSON', async () => {
    // 1. Simulación de la petición HTTP
    const res = await request(app).get('/api/products');
    
    // 2. Assertions (Validaciones)
    expect(res.statusCode).toEqual(200);       // Verifica disponibilidad
    expect(Array.isArray(res.body)).toBeTruthy(); // Verifica tipo de dato
  });

  /*
   * HOOK: TEARDOWN
   * Cierre ordenado de la conexión a la base de datos para
   * evitar fugas de memoria al finalizar los tests.
   */
  afterAll(async () => {
    await mongoose.connection.close();
  });
});