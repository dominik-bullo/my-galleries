# my-galleries

## Description

## Installation

## Usage

### API Endpoints

Except user creation, token has to be provided in the request header (`Authorization: Bearer [token]`).

-   `[GET] /api/comments/:picId` - get all comments for a picture
-   `[POST] /api/comments/:picId` - add a comment to a picture (body: `{ text: string }`)

-   `[GET] /api/galleries` - get all galleries

-   `[GET] /api/pictures/:id` - get picture by id
-   `[GET] /api/pictures/:id/thumb` - get thumbnail by id

-   `[POST] /api/users` - create user (body: `{ username: string, first_name: string, last_name: string, email: string, password: string }`)
-   `[POST] /api/users/auth` - authenticate user (body: `{ username: string, password: string }`)
