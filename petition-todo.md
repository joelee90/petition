PETITION CHECK LIST

<Part 5>

- [x] Make users to unsign the petition
  - [x] delete the image url from the database
- [x] After unsigning, users be redirected to the petition to sign again.

- [x] Problem - after unpdating -> directed to petition page. should be  see signers.
- [x] csurf error fix
- [ ] middleware?
- [ ] code arrange
- [x] petition
- [x] heroku
- [x] When adding homepage without http, still works
- [x] see all signers page - rearrange names |remove hyperlink from names
- [x] delete signature button at signers
- [x] edit page - css 

Problems:

Greet the user by name

<profile>

- [ ] profile page, when the field is empty(age, city, homepage) - won't direct to the next
- [ ] homepage without http works

<peittion>

- [ ] signature won't be submitted

iulia/errors

- no placeholder appears in the edit profile fields
- multiple data saved in db.

- [ ] Not updating properly

git push heroku HEAD:master

**➜**  **curry-petition** **git:(****joe****)** **✗** heroku pg:psqlgit

----

- [ ] saving user with all info

- [ ] saving user without age,city,homepage
- [ ] when try to update profile, bringing back the wrong db
- [ ] showing too man ppl who siged up

i think bc i am using one cookie and have problem in db  with ids.

user proper coookie for proper time.

--------

**<cookie -  req.session.user_id>**

app.get(/register) :

​	use - req.session.user_id

app.post(/register) :

​	save - req.session.user_id = results.rows[0].id

app.post(/profile) :

​	use - req.session.user_id

app.get(/login) :

​	use - req.session.user_id

app.post(/login) :

​	use - req.session.user_id

app.post(/petition) :

​	use - req.session.user_id

app.get(/profile/edit) :

​	use - req.session.user_id

app.post(/profile/edit) :

​	use - req.session.user_id 4 times.

app.post(/sigdelete) : 

​	use - req.session.user_id

**<cookie -  req.session.sign_id>**

app.post(/login) :

- [x] ​	save - req.session.sign_id = results.rows[o].sign_id;

- [ ] ​	use - req.session.sign_id

app.get(/petition) :

- [ ] ​	use - req.session.sign_id

app.post(/petition) : 

- [ ] ​	save - req.session.sign_id = results.rows[0].user_id

app.get(petition/signed) :

- [ ]   use - req.session.sign_id

app.post(/sigdelete) :

- [ ]   use - req.session.sign_id

------------------------

