# fakebook

## This is essentially a barebones social media app

Following features have been implemented. It's development is still in progress.

- User Signup - Data is stored in a MongoDB database hosted on a GCP compute Engine
- User Authentication / Login - User Auth is managed using session and cookies
- Password Security - Passwords are made secure before storing in database by hashing them
- User Posts - Each user can create their own text based posts to share with their followers

Features yet to be implemented -

- Followers - All users can follow someone and see their posts on their feed
  etc.
- Feed - Each user will have their own custom feed based on accounts they follow
- Search - All users will be able to search for posts by other users
- Chat - There will be a common chat room for all the people logged in to the webapp to get connected

Technologies used -

- The webapp is primarily built using NodeJS and Express
- Used EJS as the templating engine
- Libraries used - express, mongodb, express-session, bcrypt(for hashing passwords), validator(to validate emails)
