Petition Part 2
-Encounter-

Signed route - know which signature belongs to the user.
Use cookies to remember users on the website,
Every single route in the server has access to the cookie and store info into cookie.
∙ Limitation - cookies are tiny, only 4kb
Storing image in the cookie is too big, but storing id is possible.

`SELECT id FROM signatures;`

cookie-session is more secure way which generates two cookies.

1st cookie
base64 coding -
atob('cookie') -> human readable.
sigId - >

2nd cookie
created by cookie session - can't change to string
Its's encrypted and is a copy of the 1st cookie.

------------------------------------------------------------------
Petition Part 2 instructions for myself :

In db.js, add cookieSession = require('cookie-session');

At app.post('/petition') (1st page)
The point is to figure out the 'id' of the new petitioner and save the 'id' into the cookie. In order to save the 'id' into the cookie,
you can use

`
req.session.sigId = results.rows[0].id;
`
'sigId' can be written as you want.
Before, I was able to access the the db of the list of people by 'results.rows'. This time, I want to save the 'id' into the cookie
as above.

Now that I have save the 'id' into cookie, I want to use that information to fetch the url of the signature which is stored in the db.

In order to do that, go to db.js and add 'RETURNING id' in exports.addSignatures, after VALUES.

In db.js, make a new function which will get the url of the image which corresponds to the 'id'.

`
exports.getSignatureImage = function getSignatures(id) {
    return db.query(`SELECT signature FROM signings WHERE id = ${id}`);
};
`

* * Important Part * *

In pet.js at `app.get('/petition/signed'`
I should use the new function which I made in db.js(getSignatureImage)
before I render anything, right after results of db.getSignaturesNum.
If I console.log the the results of the new function, I get an object
which I have the access to the url of the image. I want to put that as a value for sigimage(one of properties in res.render). 'results.rows[0].signature'  is the way to get to the url of the image.

In signed.handlerbars, use img tag to render the signature img on the browser.
