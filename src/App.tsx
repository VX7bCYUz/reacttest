import React, { ChangeEventHandler, FC, useState } from 'react';
import './App.css';

interface IPost {
  title: string
  url: string
  author: string
  commentsCnt: number
  points: number
  objID: number
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
        <div key={el.objID}>
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

const Search: FC<ISearchProps> = (props) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    props.onSearch(evt.target.value);
  };
  return (
    <>      
    <label htmlFor={props.id}>{props.children}</label>
    <input type="text" value={props.term} onChange={handleChange} />
    </>
  )
}

const useSemiPersistentState = (key: string, initialState = '') => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value]);
  return [value, setValue] as const;
}

const initPosts: IPost[] = [
  {
    title: 'title 123',
    url: 'url 123',
    author: 'author 123',
    commentsCnt: 101,
    points: 102,
    objID: 103,
  },
  {
    title: 'title 456',
    url: 'url 456',
    author: 'author 456',
    commentsCnt: 201,
    points: 202,
    objID: 203,
  }
]

function App() {
  const [posts, setPosts] = useState(initPosts);

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const handleSearch: IHandleSearch = (term) => {
    setSearchTerm(term);
  }
  const searchPosts = posts.filter(el => el.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRemovePost = (post: IPost) => {
    setPosts(posts.filter((p) => p.objID !== post.objID))
  }

  return (
    <>
      <Search term={searchTerm} onSearch={handleSearch} id="search">Search123</Search>
      <List list={searchPosts} onRemoveItem = {handleRemovePost}/>
    </>

  );
}

export default App;
