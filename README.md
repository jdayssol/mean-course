# Mean-Course

Production website: 
Two app in one:
http://nodeangularoneapplication-env.r3e85hpamz.us-east-2.elasticbeanstalk.com/

Separate app (the way the code is commited)
FrontEnd:
http://wibas-io-mean-course.s3-website.us-east-2.amazonaws.com/
Backend:
http://nodeangular-env.mnawwhfr7u.us-east-2.elasticbeanstalk.com/api/posts

#How to run the backend:
`npm run start:server`

#How to run the frontend:

`ng serve`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Course content

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Plugin for VS: Angular Essentials - Material icon theme

#### Basic command and knowledge of Angular

##### **How to create a new project**

`ng new main-course`

##### **How to run the project ( Ctrl -C to leave)**

`ng serve` 

##### **How to create a component:**

In app folder, create your component folder. 
Create a file post-create.component.ts (using kebab-case is recommended) 

Install Material, you can use of course npm
`npm install --save @angular/material`

Install and configure automatically
`ng add @angular/material`

Generate a component:
`ng g c views/claim/claim-view/assign-dialog`



##### **How to emit and receive event between component:**

Emit component:

`import { Component, EventEmitter, Output} from '@angular/core';`
`@Output() postCreated = new EventEmitter();`
`this.postCreated.emit(post);`

On the mother component, HTML:
  `<app-post-create (postCreated)="onPostAdded($event)"></app-post-create>`
  `<app-post-list [posts]="storedPosts"></app-post-list>`
`JS:`
`storedPosts = [];`
  `onPostAdded(post) {`
    `this.storedPosts.push(post);`
  `}`
`}`

On the receiver component:
`import { Component, OnInit, Input} from '@angular/core';`
`@Input() posts = [];`

##### **How to create a service:**

file posts.service.ts
`@Injectable({providedIn: 'root'})`

##### **How to use service observable to transmit event:**

In the service:
`import { Subject } from 'rxjs';`
Declare the event private:
`private postsUpdated = new Subject<Post[]>();`
Get the listener from outside:
`get`PostUpdateListener() {`
    return this.postsUpdated.asObservable();`

In add post, emit the event by returning a copy of the list of post.	
`a`ddPost(title: string, content: string) {const post: Post = {title, content};this.posts.push(post);// Equivalent d'un emit, copy the array in a new onethis.postsUpdated.next([...this.posts]);}`
  }`

In a listener component, use a subscription to the event:
`import { Subscription } from 'rxjs';`
`private postsSub: Subscription;`

In the OnInit method, subscribe to the event. The function when the event is trigered is inside :

`this.postsSub = this.postsService.getPostUpdateListener()`
    `.subscribe((posts: Post[]) => {`
      `this.posts = posts;`
    `});`

`In the OnDestroy method, unscrubscribe to avoir memory leak`
  `ngOnDestroy(): void {`
    `this.postsSub.unsubscribe();`
  `}`

#### Backend with Node.JS

##### How to create a node.js server:

- on the root, create a server.js file
- Run it using the command node server.js on a terminal.
- You need to import http request and create your server in the js file:
`const http = require('http');`

`const server = http.createServer((req, res) => {`

`res.end('This is my first response!');`
`});`
`// Set the port of the server to the environnment variable for the port, or 3000 if this variable is not set`
`server.listen(process.env.PORT || 3000);`

We don't want to code every request/response so we need express witch is a framework that will help us to write the backend. Install it using npm:
 `npm install --save express` 

In backend forder, create a app.js file to use express:
`const express = require('express');`
`const app = express();`

##### Nodemon:

 Watch nodejs file and if we change , it will restart the node server for us
`npm install --save-dev nodemon`
On package.json, update the script part with
`"`scripts": {***"start:server":"nodemon server.js"`
  },`
Then you can run your node server using npm : 

`npm run start:server`

To allow cross domain request, add to you app.js CORS policy:
`app.use((req, res, next) => {`
  `res.setHeader('Access-Control-Allow-Origin','*');`
  `res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');`
  `res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');`
  `next();`
`})`

Body parser automatically extract the body of a post request. Add it using:
`npm install --save body-parser`
On app.js import it and explain you want to use it for each request:
`const bodyParser = require('body-parser');`

`app.use(bodyParser.json());`
`app.use(bodyParser.urlencoded({ extended: false}));`

#### MongoDB:

Go to mongoDB website, create a free cluster, add a authorized IP and a user:
admin
password
 Choose application connexion string
mongodb+srv://admin:password@cluster0-tb6tb.mongodb.net/test?retryWrites=true&w=majority

MongoDB : official driver
`npm install --save mongodb`

You can use also mongoose, a great tool to use mongodb with schema
`npm install --save mongoose`

How to install mongodb access: you can use mongodb Compass or mongo shell.
To connect with mongo shell, type 
mongo mongodb+srv://admin:Jod1mongodb@cluster0-tb6tb.mongodb.net/test
use node-angular
help
show collections
db.posts().find() show the list of posts

##### How to insert Data using mongoose:

`const mongoose = require('mongoose');`
`const Post = require('./models/post');`

`// create a database object`
  `const post = new Post({`
    `title: req.body.title,`
    `content: req.body.content`
  `});`
  `post.save(); // will save in the database`

##### How to fetch data:

https://mongoosejs.com/docs/queries.html
 `Post.find();`

#####  How to delete data:

 `app.delete('/api/posts/:id', (req,res, next) => {`
  `Post.deleteOne( {_id: req.params.id}).then(result => {`
    `res.status(200).json({`
      `message: 'Post deleted!'`
    `});`
  `});`
`});`

#### Angular advanced features

##### Router:

Add a router module app-routing.module.ts in the root folder
This router module declares path to navigate in our application:

`import { NgModule } from '@angular/core';`
`import { RouterModule, Routes } from '@angular/router';`
`import { PostListComponent } from './posts/post-list/post-list.component';`
`import { PostCreateComponent } from './posts/post-create/post-create.component';`

`//  path '' mean the main page`
`// path: 'create' = localhost:4200/create and will route to the create post component.`
`const routes: Routes = [`
  `{ path: '' , component: PostListComponent },`
  `{ path: 'create' , component: PostCreateComponent }`
`];`

`@NgModule({`
  `imports: [RouterModule.forRoot(routes)],`
  `exports: [RouterModule]`
`})`
`export class AppRoutingModule {}`

We import this module in our main module.

On our main component html , we don't declare the component but this:
  <router-outlet></router-outlet>
  This way we will load the main page of our application, and the router will work.
On our header component, we use this link:
<a mat-button routerLink='/create' routerLinkActive="mat-accent">New Post</a>
routerLink link to the component url, routerLinkActive is a property that will change the color of the link when we are actually on the page.

 `npm install nodemon --global`
 To install a package globally.

To extract incoming file in the node.js backend you need to install multer:
`npm install --save multer`

To catch the image, you can add another argument to your post request using multer:
`router.post("", multer(storage).single("image"), (req,res,next) => { ..}`

It will search for a image , from the parameter which is named "image".

To send data to our backend, we will use FormData, that can be used to send data and file.
`const postData = new FormData();`

##### Image access configuration

For the frontend to have access to our image folder on the backend, we need to give them access:
On app.js that file define our node server, we grand a static access to a specific folder like this:
`const path = require('path'); -> Library to construct a path , independly to the operating system.`
`app.use("/images", express.static(path.join("backend/images")));`

Paginator:
Using mat-paginator with parameter: 
`<mat-paginator [length]="totalPosts" [pageSize]="postsPerPage" [pageSizeOptions]="pageSizeOptions" (page)="onChangedPage($event)"></mat-paginator>`

On the backend: rework the query on getPosts route: 
`const pageSize = + req.query.pagesize; // using + will convert the string to a number`
  `const currentPage = req.query.page;`
  `const postQuery = Post.find();`

`postQuery`
    `.skip(pageSize * (currentPage - 1))// skip the previous page`
    `.limit(pageSize); // limit the number of item returned`

On the frontend:
`con`st queryParams = ?pagesize=${postsPerPage}&page=${currentPage}; // back ticks allows us to dynamically add values into a string`
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts' + queryParams)`
	

##### Authentification

We create two component for login and signup, new routes on the frontend / backend for this component.
In the backend we create a new mongoose model user.ts , with unique email. To be sure the email is unique, we install a new package:
`npm install --save mongoose-unique-validator`

When we create a new user, we want to hash the password before saving the user in the database. For that we will install a new package:
`npm install --save bcrypt`
package that will help use to share the authentification web token
`npm install --save jsonwebtoken`

We can use middleware in our backend to intercept request and verify that you are authenticated:
-> create a middleware : It is always a function like this:
Inside verify the token: 
`m`odule.exports = (req,res,next) => {`
  `try {`
    `const token = req.headers.authorization.split(" ")[1];`
    `jwt.verify(token, "secret_this_should_be_longer");`
    `next();`
  }`

Then inject it in the route request:
``router.post("",`
  `checkAuth,`
 multer({storage: storage}).single("image"), (req,res,next) => {`

To inject the token in our frontend request, we will use a interceptor for the http client

`// Injectable enable to inject service into another service`
`@Injectable()`

To use our interceptor, we need to add it in the provider list in our app.module:
`/`/ Providers are for service`
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor}],`

To inform other component that we are authentificated or not and change the UI, in authService we use a boolean listener and a observable from this listener:

`private authStatusListener = new Subject<boolean>();`

`//Exposes the observable from the listener to other component: they can observe the status, butonly AuthService can emit the event.`
  `getAuthStatusListener() {`
    `return this.authStatusListener.asObservable();`
  `}`

When we sucessfully login, we can emit the event this way:
`this.authStatusListener.next(true);`

After login, we want to redirect to the main page. We need to inject Router in the constructor of auth.service.ts where we have the login function,
To redirect, we will use : 

`this.router.navigate(['/']);`

To avoid going to page using address bar , for example /create without being authenticated, We need to use guards:
Add auth.gard.ts in auth folder, which is a service implementing CanActivate
We inject authService and return true if the user is logged. If not, we inject router and we navigate to login.

`c`anActivate(route: ActivatedRouteSnapshot, state:RouterStateSnapshot): boolean {`
    `const isAuth = this.authService.getIsAuth();`
    `if(!isAuth){`
      `this.router.navigate(['/login']);`
    `}`
      `return true;`
  }`

Now, to use this guard we will import it as a provider in our app-routing.module.ts. We decorate the route that we want to protect with this guard using canActivate:

`providers: [AuthGuard]`
`})`
`export class AppRoutingModule {}`

`const routes: Routes = [`
  `{ path: '' , component: PostListComponent },`
  `{ path: 'create' , component: PostCreateComponent, canActivate: [AuthGuard] },`



##### Reflecting the token expiration in the UI

We add a property to our token: expiresInDuration in second.
On the frontend, we can use Angular function setTimeout on login and clearTimeout on logout to initialize and reset the timer.
`this.to`kenTimer = setTimeout(() => {`
          `this.logout();`
        }, expiresInDuration * 1000); // setTimeOut accept milisecond, so * 1000`  
		
Persisting the token state by saving in local storage: How to survive the token after reloading:
Store the token in localStorage of the browser:
Call this function when you login
 `p`rivate saveAuthData(token : string, expirationDate : Date) {`
    `localStorage.setItem('token', token);`
  }`
When you logout, clean the storage:localStorage.removeItem('token');

On NGInit of app.component, try to reconnect to the token we store on the local storage
t`his.authService.autoAuthUser();`
-> check if we have a token in local storage , if the token is valid ( not expired) , then affect the token again and alert the listener:``
`autoAuthUser() {`

    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    // compare the expiration date and the current date, return true if the expiration date is before now.
    const isInFuture = authInformation.expirationDate > now;
    // if the expirationDate is in the future, then the token is valid
    console.log("autoAuthUser", authInformation, isInFuture);
    if(isInFuture){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      this.setAuthTimer(expiresIn / 1000);
    }
    }


##### Authorization

Adding the user id in the post model:
We store a mongoose id which is different to a mongodb id. We precise the object of the id using ref.
`creator : { type : mongoose.Schema.Types.ObjectId, ref: "User", required: true}`

Error Handling:
Subscribe() can take a second argument which is the function that will be executed when a error arrive:
In case of a error when you login, we emit the event that something goes wrong:
`log`in(email: string, password : string) {`
`this.http.post<{token : string,userId: string, expiresIn : number}>("http://localhost:3000/api/user/login", authData)`
    `.subscribe(response => {`
      `....`
      `}`
    `}, error => {`
      `this.authStatusListener.next(false);`
    });`
	
Then on the login component we catch the error event like this:
`private authStatusSub : Subscription`

`this.authStatusSub = this.authService.getAuthStatusListener().subscribe(`
    `authStatus => {`
      `this.isLoading = false;`
    `}`
    `);`

We use this to stop the spinner in case of error. We also need to unsubscribe to the listener:
`n`gOnDestroy(): void {`
    `this.authStatusSub.unsubscribe();`
  }`

##### Error interceptor

To show errror message when a http error arrive, we can create a global error interceptor.
In this interceptor we catch the error of the http stream, when a error occurs, we log the error and we return it. We use for this two librairies:
catchError and throwError.

`export class ErrorInterceptor implements HttpInterceptor {`

  `intercept(req: HttpRequest<any>, next: HttpHandler) {`
    `return next.handle(req).pipe(`
      `catchError((error: HttpErrorResponse) => {`
        `console.log(error);`
        `alert(error.error);`
		`this.dialog.open(ErrorComponent, {data: {message: errorMessage}});`
        `return throwError(error);`
      `})`
    `);`
  `}`
`}`

Of course we need to add them as providers in our app.module
`p`roviders: [`
    `{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},`
    `{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}`
  ],`

We create then a errorComponent that will be view in case of error. Because it will not be added in a specific module or by routing,
we need to explain Angular to load it this way on app.module:
`entryComponents: [ErrorComponent]`

In the error component, we ca pass information like this using a dialog:
`this.dialog.open(ErrorComponent, {data: {message: errorMessage}});`
`constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}`

On the server side, we just need to send a message object. We can add a error function as a secund parameter is the then(). Then we throw a status 500 error with a message
That will be intercept by our interceptor, that will send it to our dialog error component:
`// Delete a post, secure`
`router.delete('/:id', checkAuth, (req,res, next) => {`
  `Post.deleteOne( {_id: req.params.id, creator: req.userData.userId}).then(result => {`
    `console.log(result);`
    `if(result.n > 0){`
      `res.status(200).json({ message : 'Post deleted!'});`
    `}else{`
      `res.status(401).json({ message : 'Not authorized!'});`
    `}`
  `})`
  `.catch(error => {`
    `res.status(500).json({`
      `message: "Deleting post failed"`
    `});`
  `});;`
`});`

Using Controller to clean our code. In the route folder, we add too much code. We can put the function that are executed when you enter a route in a separate file which is called a Controller.
`const UserController = require("../controllers/user");`
`router.post("/signup", UserController.createUser);`

We create a new folder "controllers" and a user.js file inside. Then we cut/paste the function from the user.js route file.
`exports.createUser = (req, res, next) => {...}`
This way the code is cleaner and separated.

#### Optimize the frontend

To clean our app.module.ts we can create different module. For the material library, we create a material module:
In a new file , next to app.module.ts: angular-material.module.ts:
Exports will imports too and make librairies available outside the module.
``// This annotation will declare a new module`
`@NgModule({`
`exports: [`
    `MatInputModule,`
    `****`
  `]`
})` 
export class AngularMaterialModule {}
And then simply use our module in app.module instead of all our mat librairies imports.

##### Create a module with our own component

PostsModule in folder post.
By default module don't share library. That means that we need to import again in our own module the librairy that we allready import in the main one, only if it is needed!
To use angular common library ( ngIf directive for example), import the CommonModule. We need also to import again the AngularMaterial module.

##### Lazy loading our module

This can be done in our routing module. (Eagerly= always loaded at start of the application, Lazy = loaded on demand, when necessary)
For this, create a children route module in auth, we will put login and signup route:
``const routes: Routes = [`
  `{ path: 'login', component: LoginComponent},`
  `{ path: 'signup', component: SignupComponent}`
`];`

`@NgModule({`
  `imports: [RouterModule.forChild(routes)],`
  `exports: [RouterModule],`
`})`
`export class AuthRoutingModule {}`

Import this route in the authModule: AuthRoutingModule
In app-routing.module, refers to this new child route like this:

`{ path: 'auth', loadChildren: "./auth/auth.module#AuthModule"} // All the route registered here will be load lazily`

And because it is load lazily now we need to remove the import from app.module.ts

##### Using Angular global config

Use environment.ts and environment.prod.ts to store url, password, domain
Edit this environment file to add global properties. Then import environement in your module to use this global properties.

##### Node JS Global variable

 We need to put this variable in the environment too: create a nodemon.js in the root of the project.
process.env.JWT_KEY



#### Deployment

##### Backend

We will use AWS Elastic BeanStalk to run our NodeJS code. 

Creat a new environment using NodeJs . On the configuration panel:

Node command: node server.js 
Add two environment properties: JWT_KEY and MONGO_ATLAS_PW.
Load your backend code in a zip file.

Check the health menu and generate a log to check the error (the library bcrypt must be changed to bcrypt.js for example.)

##### Frontend: 

We will use S3 AWS to store our static file ( HTML / CSS / JS ). 
Generate the dist folder using ng build --prod.
Put all the files in this folder intot a S3 bucket. In authorization , authorize all access. You have to paste in strategy: 
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AddPerm",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::wibas-io-mean-course/*"
        }
    ]
}

Then on property "Static Web Site Hosting": input index.html for the index document and the error document and activate the web site Hosting.

