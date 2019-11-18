import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

import { AuthGuard } from './auth/auth.gard';

//  path '' mean the main page
// path: 'create' = localhost:4200/create and will route to the create post component.
const routes: Routes = [
  { path: '' , component: PostListComponent },
  { path: 'create' , component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId' , component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: "./auth/auth.module#AuthModule"} // All the route registered here will be load lazyly
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
