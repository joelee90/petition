const {app} = require('./index');
const supertest = require('supertest');
const cookieSession = require('cookie-session');

test('GET /home returns an h1 as response', () => {
    return supertest(app).get('/home').then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('welcome');
    });
});


test('POST /product redirects to /home', () => {
    return supertest(app)
        .post('/product')
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.text).toContain('found');
            expect(res.headers.location).toBe('/home');
        });
});

test('POST /Product sets req.session.wouldLikeToBuy to true', () => {
    let cookie = {};
    cookieSession.mockSessionOnce(cookie);

    return supertest(app)
        .post('/product')
        .then(res => {
            expect(cookie.wouldLikeToBuy).toBe(true);
            expect(cookie.puppy).toBe('Layla');
            expect(res.statusCode).toBe(302);
        });
});
