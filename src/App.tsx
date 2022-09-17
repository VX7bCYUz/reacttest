import { resolve } from 'path';
import React, { ChangeEventHandler, FC, useEffect, useReducer, Reducer, useState } from 'react';
import './App.css';

interface IPost {
  title: string
  url: string
  author: string
  commentsCnt: number
  points: number
  objectID: number
}


interface IListProps {
  list: IPost[];
  onRemoveItem: (p: IPost) => void;
}

const List: FC<IListProps> = (props) => {
  return (
    <>
    {
      props.list.map(function(el){
      return (
        <div key={el.objectID}>
          <div><a href={el.url}>{el.title}</a></div>
          <div>{el.author}</div>
          <div>{el.commentsCnt}</div>
          <div>{el.points}</div>
          <button onClick={() => props.onRemoveItem(el)}>delete</button>
        </div>      
      )
    }
    )
  }
  </>
  )
}

type IHandleSearch = (val: string) => void;

interface ISearchProps {
  term: string,
  onSearch: IHandleSearch,
  id: string,
  children: string,
}

const InputWithLabel: FC<ISearchProps> = (props1) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    props1.onSearch(evt.target.value);
  };
  return (
    <>      
    <label htmlFor={props1.id}>{props1.children}</label>
    <input type="text" value={props1.term} onChange={handleChange} />
    </>
  )
}

const useSemiPersistentState = (key: string, initialState = '') => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key]);
  return [value, setValue] as const;
}

const initPosts: IPost[] = [
  {
    title: 'title 123',
    url: 'url 123',
    author: 'author 123',
    commentsCnt: 101,
    points: 102,
    objectID: 103,
  },
  {
    title: 'title 456',
    url: 'url 456',
    author: 'author 456',
    commentsCnt: 201,
    points: 202,
    objectID: 203,
  }
]

type IPostsReducerAction = {
  type: 'SET',
  payload: IPost[]
} | {
  type: 'DELETE',
  payload: IPost
}

const postsReducer: Reducer<IPost[], IPostsReducerAction> = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'DELETE':
      return state.filter(p => p.objectID !== action.payload.objectID)
  }
}

function App() {
  // const [posts, setPosts] = useState<IPost[]>([]);
  const [posts, dispatchPosts] = useReducer(postsReducer, []);
  
  const getAsyncPosts = () => new Promise<{ data: { posts: IPost[] }}>((resolve) => {
    setTimeout(()=>resolve({data: {posts: initPosts}}), 2000)
  })
  // useEffect(()=>{
    //   getAsyncPosts().then(result => setPosts(result.data.posts))
    // }, [])
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(()=>{
      setIsLoading(true);
      getAsyncPosts().then(result => {
        // setPosts(result.data.posts);
        dispatchPosts({type: 'SET', payload: result.data.posts})
        setIsLoading(false);
      })
    })


  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const handleSearch: IHandleSearch = (term) => {setSearchTerm(term);}
  const searchPosts = posts.filter(el => el.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRemovePost = (post: IPost) => {
    // setPosts(posts.filter((p) => p.objectID !== post.objectID))
    dispatchPosts({type: 'DELETE', payload: post})
  }

  return (
    <>
      <InputWithLabel term={searchTerm} onSearch={handleSearch} id="search">Search123</InputWithLabel>
      {
        isLoading
          ? <p>Loading...</p>
          : <List list={searchPosts} onRemoveItem = {handleRemovePost}/>
      }      
    </>

  );
}

export default App;
