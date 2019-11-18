import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map} from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { post } from 'selenium-webdriver/http';
import { Form } from '@angular/forms';
import { environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/'

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // back ticks allows us to dynamically add values into a string
    this.http.get<{message: string, posts: any, maxPosts : number}>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts};
    }))
      .subscribe( (transformedPostData) => {
        console.log("transformedPostData",transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts : [...this.posts],postCount : transformedPostData.maxPosts});
      });
  }

  // return a copy of the post from the client post list, which match with the id.
  //getPost(id: string) {
  //  return {...this.posts.find(p => p.id === id)};
  //}


   getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL + id);
   }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
    .post<{message: string, post: Post}>(
      BACKEND_URL, postData
      )
    .subscribe((responseData) => {
      // Navigate will refresh the current list of posts, so we don't need to pass it anymore.
      /*
      const post: Post = {
        id: responseData.post.id,
        title : title,
        content : content,
        imagePath : responseData.post.imagePath
      };
      const id = responseData.post.id;
      post.id = id;
      this.posts.push(post);
      // Equivalent d'un emit, copy the array in a new one
      this.postsUpdated.next([...this.posts]);
*/
      // return to the main page
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image : File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image,title);
    }else{
      postData = {
        id:id,
        title:title,
        content:content,
        imagePath: image,
        creator: null
      };
    }


    this.http.put(BACKEND_URL + id, postData)
    .subscribe( response => {
      // Navigate will refresh the current post, so we don't need to pass it anymore.
      /*
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post : Post = {id:id,
        title:title,
        content:content,
        imagePath: "response.imagePath"
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
*/
      // return to the main page
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId)
  }
}
