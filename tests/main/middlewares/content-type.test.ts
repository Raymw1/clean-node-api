import app from '@/main/config/app'
import request from 'supertest'

describe('Content Type Middleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test_default_content_type', (request, response) => {
      response.send('')
    })
    await request(app)
      .get('/test_default_content_type')
      .expect('content-type', /json/)
  })

  test('should return xml content type when forced', async () => {
    app.get('/test_xml_content_type', (request, response) => {
      response.type('xml')
      response.send('')
    })
    await request(app)
      .get('/test_xml_content_type')
      .expect('content-type', /xml/)
  })
})
