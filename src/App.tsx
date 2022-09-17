import { resolve } from 'path';
import React, { ChangeEventHandler, FC, useEffect, useReducer, Reducer, useState } from 'react';
import './App.css';

interface IPost {
  title: string | null
  url: string | null
  author: string
  // commentsCnt: number
  points: number
  objectID: string
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
          {/* <div><a href={el.url}>{el.title}</a></div> */}
          <div>{el.author}</div>
          {/* <div>{el.commentsCnt}</div> */}
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
    // commentsCnt: 101,
    points: 102,
    objectID: '103',
  },
  {
    title: 'title 456',
    url: 'url 456',
    author: 'author 456',
    // commentsCnt: 201,
    points: 202,
    objectID: '203',
  }
]

type IPostsReducerAction = 
{
  type: 'FETCH_INIT',
} | {
  type: 'FETCH_SUCCESS',
  payload: IPost[]
} | {
  type: 'FETCH_FAILURE',
} | {
  type: 'DELETE',
  payload: IPost
}

interface IPostsState {
  data: IPost[],
  isLoading: boolean,
  isError: boolean
}

const postsReducer: Reducer<IPostsState, IPostsReducerAction> = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {data: [], isLoading: true, isError: false}
    case 'FETCH_SUCCESS':
      return {data: action.payload, isLoading: false, isError: false}
    case 'FETCH_FAILURE':
      return {...state, isLoading: false, isError: true}
    case 'DELETE':
      return {...state, data: state.data.filter(p => p.objectID !== action.payload.objectID)}
  }
}

interface IApiPost {
  title: string | null
  url: string | null
  author: string
  points: number
  objectID: string
}

interface IApiResponse {
  hits: IApiPost[]
}

const API_URL = 'https://hn.algolia.com/api/v1/search';


function App() {
  const [posts, dispatchPosts] = useReducer(postsReducer, {data: [], isLoading: false, isError: false});
  
  const getAsyncPosts = () => new Promise<{ data: { posts: IPost[] }}>((resolve) => {
    setTimeout(()=>resolve({data: {posts: initPosts}}), 2000)
  })
  
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const handleSearch: IHandleSearch = (term) => {setSearchTerm(term);}
  // const searchPosts = posts.data.filter(el => el.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    dispatchPosts({type: 'FETCH_INIT'});
    fetch(`${API_URL}?query=${searchTerm}`)
    .then(res => res.json())
    .then((result: IApiResponse)=>{
      dispatchPosts({type: 'FETCH_SUCCESS', payload: result.hits})
    })
    .catch(()=>dispatchPosts({type: 'FETCH_FAILURE'}))
 },[searchTerm])

  const handleRemovePost = (post: IPost) => {
    dispatchPosts({type: 'DELETE', payload: post})
  }

  return (
    <>
      <InputWithLabel term={searchTerm} onSearch={handleSearch} id="search">Search123</InputWithLabel>
      {posts.isError && <p>Something went wrong ...</p>}
      {
        posts.isLoading
          ? <p>Loading...</p>
          : <List list={posts.data} onRemoveItem = {handleRemovePost}/>
      }      
    </>

  );
}

export default App;
