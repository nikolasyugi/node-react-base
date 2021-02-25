# Node React seed project

## Description

This is a seed project using Node/Express, Reactjs and MongoDB. The admin dashboard interface is developed using Reactjs and the back-end, Node.js/Express connected to a MongoDB.

## Environment Variables 

Create a .env file on the root folder and populate with the appropriate variables. The file .env-sample shows which variables should be added.

## Seed

`npm run seed` will run a seed script and add the following user to the database.

```json
{
    "email": "admin@gmail.com", 
    "password": "12345678"
}
```
## Edit default parameters

### *package.json*
name, version and author

### *global.css*
var(--primary)

### *api/swagger.json*
info and servers

### *api/emails*
change project name inside html.pug/subject.pug and body background color/button color inside style.css for both folders (forgotPassword/forgotPasswordNotFound)

### *api/tasks*
delete task if it's useless

### *api/cors.js*
add whitelisted urls to array

### *src/components/Login.js*
change project name

### *src/components/SideHeader.js*
change project name

### *src/assets*
background-img (Login.css), logo.png (Modal.js, SideHeader.js)

### *public/*
change favicons (`https://www.favicon-generator.org/`)

### *public/index.html*
change host, project name and favicon

## Development server

Open two terminal instances, one for the Node back-end and one for the React front-end.

For the back-end, run `nodemon app` for a dev server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files. *Important*: As you're running only the Node server with this command, if you alter anything on the react code, changes on the front-end will not be updated automatically, since it is serving the files directly from the `build/` folder.

For the front-end, run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

In sum, you should run both commands on separate terminal instances. The `npm run dev` will be responsible for the automatic update of the frontend portion, whereas the `nodemon app` will be responsible for the automatic update of the backend portion of the project. In order to see all updates, navigate to `http://localhost:3000`.

## Building the project

Run `npm run build` to build the project. The build artifacts will be stored in the `build/` directory.