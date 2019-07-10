Petition Part 4

SELECT * FROM signers
JOIN songs
ON singers.id = songs.singer_id;

SELECT singers.name AS singer_name, songs.name AS songs.name AS song
FROM singers
JOIN songs
ON singers.id = songs.singer_id


-kill
DROP TABLE IF EXISTS users_profile CASCADE;
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(100),
    url VARCHAR(300),
    user_id INT REFERENCES users(id)
)

-need a new GET route and POST route for the extra information page.
(everything should be operational)
-We need a function that cleans the url
-We can use startsWith()

var str = 'hello';

str,startsWith('hell');
true

str,startsWith('for');
false
-Here we want to check if it start with https:// or http://


Also need to work on the signers page.
-problem is data now lives in 3 tables
-solution -> JOINS!
-


{{#signers}}

    {{#if url}}
        <a href={{url}}>{{first}}{{last}} </a>
    {{else}}
    {{first}}{{last}}
    {{/if}}

{{/signers}}

-New GET routes for the city's page (params)

-------------------------------------------------------------------------

Heroku
