# TODOs

## Urgent

- Signing out should redirect user to home page

## Issues

- Unable to implement Auth0 authentication as it requires using `https`. Attempting to use server with `https` with package `next-dev-https` resulted in an error. I have raised an issue about it on GitHub.
- 404/not-found page refreshes every 3 seconds in development.
  - https://github.com/vercel/next.js/issues/10024
  - https://github.com/vercel/next.js/discussions/50429
- Warnings appear when site is retrieving css files. The requests stack until everything slows down and becomes unusable.
  - https://github.com/vercel/next.js/discussions/49607

---

## Pages

- News Feed (Home)
- Error
- 404

---

## Components

- Navbar
  - Search Bar
  - Tabs to switch between 'Explore' and 'Following'
- Pagination

---

## Features

- Development
  - Install package `next-dev-https`
  - Add script `"dev-ssl": "next-dev-https --https --port 4430"` to `package.json`
- Post Creation
- Notifications
- Authentication
  - Twitter
  - Auth0
  - Settings (Private)
    - Privacy
    - Security
    - Notification
    - Account Recovery Options

---

# Schemas

- User
  - Verified
  - Notifications
- Notification
