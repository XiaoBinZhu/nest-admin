import request from 'supertest'
import { APP_URL, TESTER_PASSWORD, TESTER_USERNAME } from '../utils/constants'

describe('Auth Module (e2e)', () => {
  const app = APP_URL
  let authToken: string
  let captchaId: string
  let verifyCode: string

  // 获取验证码（如果需要）
  beforeAll(async () => {
    try {
      const captchaResponse = await request(app)
        .get('/auth/captcha')
        .expect(200)

      if (captchaResponse.body) {
        captchaId = captchaResponse.body.id
        verifyCode = captchaResponse.body.code || '1234' // 测试环境可能需要固定验证码
      }
    }
    catch (error) {
      // 如果验证码端点不存在，使用默认值
      captchaId = 'test-captcha-id'
      verifyCode = '1234'
    }
  })

  describe('Login', () => {
    it('should fail with invalid credentials: /auth/login (POST)', () => {
      return request(app)
        .post('/auth/login')
        .send({
          username: 'invalid',
          password: 'invalid',
          captchaId: 'test',
          verifyCode: '1234',
        })
        .expect((res) => {
          expect([400, 401, 422]).toContain(res.status)
        })
    })

    it('should successfully login: /auth/login (POST)', () => {
      return request(app)
        .post('/auth/login')
        .send({
          username: TESTER_USERNAME,
          password: TESTER_PASSWORD,
          captchaId,
          verifyCode,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined()
          authToken = body.token
        })
    })
  })

  describe('Get user info', () => {
    it('should get user info with valid token: /auth/profile (GET)', () => {
      return request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id || body.uid).toBeDefined()
          expect(body.username || body.name).toBeDefined()
          expect(body.password).not.toBeDefined()
        })
    })

    it('should fail without token: /auth/profile (GET)', () => {
      return request(app)
        .get('/auth/profile')
        .expect(401)
    })
  })
})
