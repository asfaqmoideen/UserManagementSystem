**Application Flow Scenario**

1. **User Login**
   - User navigates to the login page.
   - User enters their username and password.
   - User submits the login form.
   - Application sends a [POST /login]() request.
   - Server authenticates the user and returns a JWT token.
   - Application stores the JWT token and user details.
2. **Accessing User Data**
   - User navigates to the dashboard.
   - Application sends a GET /user/me request with the JWT token.
   - Server returns the authenticated user's details.
   - Application displays the user's details on the dashboard.
3. **Managing Users**
   - Admin navigates to the user management page.
   - Application sends a GET /users request with the JWT token.
   - Server returns a list of all users.
   - Admin can search, filter, sort, and paginate users using the respective endpoints.
   - Admin can add a new user by sending a [POST /users/add]() request.
   - Admin can update an existing user by sending a [PUT /users/:id]() request.
   - Admin can delete a user by sending a [DELETE /users/:id]() request.
4. **User-Related Data**
   - User navigates to their profile page.
   - Application sends a GET /users/:id/carts request to retrieve the user's carts.
   - Application sends a GET /users/:id/posts request to retrieve the user's posts.
   - Application sends a GET /users/:id/todos request to retrieve the user's todos.
   - Server returns the respective data, and the application displays it on the profile page.
5. **Post Management**
   - User navigates to the posts page.
   - Application sends a GET /posts/tags request to retrieve all post tags.
   - User selects a tag to filter posts.
   - Application sends a GET /posts/tags/:tag request to retrieve posts associated with the selected tag.
   - Server returns the filtered posts, and the application displays them on the posts page.
