import { components, paths, schemas } from './config'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'NodeJs Rest Api using TDD, Clean Architecture and Typescript',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://mit-license.org/'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    { name: 'Login' },
    { name: 'Survey' }
  ],
  paths,
  schemas,
  components
}
