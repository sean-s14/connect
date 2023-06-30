# TODOs

## Issues

- Unable to implement Auth0 authentication as it requires using `https`. Attempting to use server with `https` with package `next-dev-https` resulted in an error. I have raised an issue about it on GitHub.

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
