import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', async() => {
    return request(app)
      .post('/api/user/signup')
      .send({
          email: 'test@test.com',
          password: '1234'
      })
      .expect(201);
})