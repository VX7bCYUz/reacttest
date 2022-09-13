import React, { ChangeEventHandler, FC } from 'react';
import './App.css';

interface IPost {
  title: string
  url: string
  author: string
  commentsCnt: number
  points: number
  objID: number
}


const List: FC<{ list: IPost[]; list2: IPost[] }> = (props) => {
  console.log(111, props.list2)
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
        </div>      
      )
    }
    )
  }
  </>
  )
}

interface ISearchProps {
  term: string,
  onSearch: IHandleSearch
}

const Search: FC<ISearchProps> = (props) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    props.onSearch(evt.target.value);
  };
  return (
    <>      
    <input type="text" value={props.term} onChange={handleChange} />
    </>
  )
}


type IHandleSearch = (val: string) => void;

function App() {
  const posts: IPost[] = [
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

  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || '1');
  const handleSearch: IHandleSearch = (term) => {
    setSearchTerm(term);
    localStorage.setItem('search',term);
  }
  const searchPosts = posts.filter(el => el.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Search term={searchTerm} onSearch={handleSearch}/>
      <List list={searchPosts} list2 = {posts}/>
    </>

  );
}

export default App;
