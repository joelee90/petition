Petition Part 5

form filled with existing db

password/ update or insert
update two distinct table
have to do two different queries.
transaction

users table 1 update

password - sth in or not?
empty - don't change password
value - hash - update

update with whatever the user inputs

built in syntax - upsert -

delete signature = button(in the form)
<delete from table where>

--------------------------------------------------------------------

how to split index.js
1.
2.

//when logged out,(after cookie session)
//always call next to let sth else.
//for register and login

app.use((req, res, next) => {
    if(!req.session.userId && req.url != '/register' && req.url != '/login') {
        res,redirect('/register');
    } else {
        next();
    }
});

function requireLoggedOut(req, res, next) {
    if(req.session.userId) {
        return res.redirect('/petition');
    }
    next();
}
//or this could be made as module if u think index.js is getting longer.

app.get('register', requireLoggedOut, (req.res) => {

    });


    
