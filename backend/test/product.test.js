const request = require('supertest');
const app = require('../src/index'); // Importamos tu servidor
const mongoose = require('mongoose');

// Describimos el bloque de pruebas
describe('Pruebas de Productos (API)', () => {
  
  // Prueba 1: Verificar que GET /api/products devuelve una lista
  it('Debería obtener todos los productos con status 200', async () => {
    const res = await request(app).get('/api/products');
    
    // VALIDACIONES (Assertions)
    expect(res.statusCode).toEqual(200); // ¿El código es 200 OK?
    expect(Array.isArray(res.body)).toBeTruthy(); // ¿Me devolvió un arreglo?
    
    // Opcional: Verificar que no esté vacío si ya creaste productos
    // expect(res.body.length).toBeGreaterThan(0);
  });

  // Cerramos la conexión a Mongo al terminar para que el test no se quede colgado
  afterAll(async () => {
    await mongoose.connection.close();
  });
});