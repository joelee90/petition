Steps to completing part 1:

required express-handlebars templates:

-'petition' template with a <canvas> element that the user can actually sign
(figure out how to capture the signature. url - generated - to get url - toDataURL on canvas)

    - you'll need front-end JS for this. the JS file that contains this code should
    live in your 'public' folder(alongside CSS, imgs, etc)
-'thank you' template that will thank the user for signing the petition, and will
include a link to the next page.
    -should also render the number of people who have signed the petition.
-'signers' template that should render the first and last names of everyone who
has signed the petition.
- and you'll need 1 layout.


SQL stuff
    - will need a database and a table for this project
    -create a table called "signatures" that has the following columns: id, first, last,
    signature(the signature's data type should be TEXT), timestamp

    ```
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ```

DB queries
    -INSERT when user signs the petition (so provides first, last, and signature)
    -SELECT to get number of signers
    -SELECT to get the first and last names of everyone who has signed.

Server Routes
- GET/petition
    -renders petition template
- POST/petition
    - that will run whenever the user singes the petition
=GET/thanks (or/signed - you can call whatever)
    -renders "thank you" template
-GET/signers
    -renders the 'signers' template. will need the first and last names of
    everyone whose signed petition.

if user leaves text-field blank - message
