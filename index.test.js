const {app} = require('./index');
const supertest = require('supertest');
const cookieSession = require('cookie-session');

test('GET /home returns an h1 as response', () => {
    return supertest(app).get('/home').then(res => {
        expect(res.statusCode).toBe(200);
        //option #1 for checking HTML of response

        // expect(res.text).toBe('<h1>');

        //option #2 for checking HTML of response
        expect(res.text).toContain('welcome');
    });
});


test('POST /product redirects to /home', () => {
    return supertest(app)
        .post('/product')
        // .send('first=testFirstName&last=testLastName&email=test@test.test&password=myTestPassword')
        //handle user input in the test
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.text).toContain('found');
            expect(res.headers.location).toBe('/home');
        });
});

test('POST /Product sets req.session.wouldLikeToBuy to true', () => {
    //create cookie
    let cookie = {};
    //step 2: tell cookieSession mock that the 'cookie' variable is our cookie, and any time user writes
    //data to a cookie, it should be placed in the 'cookie variable'
    cookieSession.mockSessionOnce(cookie);

    return supertest(app)
        .post('/product')
        .then(res => {
            expect(cookie.wouldLikeToBuy).toBe(true);
            expect(cookie.puppy).toBe('Layla');
            expect(res.statusCode).toBe(302);
        });
});
