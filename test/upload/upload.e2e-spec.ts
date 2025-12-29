import * as fs from 'node:fs'
import * as path from 'node:path'
import request from 'supertest'
import { APP_URL, TESTER_PASSWORD, TESTER_USERNAME } from '../utils/constants'

describe('Upload Module (e2e)', () => {
  const app = APP_URL
  let authToken: string

  beforeAll(async () => {
    // 登录获取 token
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: TESTER_USERNAME,
        password: TESTER_PASSWORD,
      })
    authToken = response.body.accessToken
  })

  describe('File upload', () => {
    it('should fail without authentication: /tools/upload (POST)', () => {
      return request(app)
        .post('/tools/upload')
        .expect(401)
    })

    it('should fail without file: /tools/upload (POST)', () => {
      return request(app)
        .post('/tools/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)
    })

    it('should upload file successfully: /tools/upload (POST)', () => {
      // 创建一个临时测试文件
      const testFilePath = path.join(__dirname, '../fixtures/test-image.jpg')

      // 如果文件不存在，创建一个简单的测试文件
      if (!fs.existsSync(testFilePath)) {
        const dir = path.dirname(testFilePath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        // 创建一个最小的有效 JPEG 文件
        const jpegHeader = Buffer.from([
          0xFF,
          0xD8,
          0xFF,
          0xE0,
          0x00,
          0x10,
          0x4A,
          0x46,
          0x49,
          0x46,
          0x00,
          0x01,
          0x01,
          0x01,
          0x00,
          0x48,
          0x00,
          0x48,
          0x00,
          0x00,
          0xFF,
          0xD9,
        ])
        fs.writeFileSync(testFilePath, jpegHeader)
      }

      return request(app)
        .post('/tools/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFilePath)
        .expect(200)
        .expect(({ body }) => {
          expect(body.filename).toBeDefined()
        })
    })
  })
})
