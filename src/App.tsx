import React, { ChangeEventHandler, FC } from 'react';
// import logo from './logo.svg';
import './App.css';

// const title = 'React_123'
// const list = [1,2,3,4,5]


interface IPost {
  title: string
  url: string
  author: string
  commentsCnt: number
  points: number
  objID: number
}


// const List: FC = () => {
// const List: FC = (props: { list: IPost[]}) => {
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

const Search: FC<{ onSearch: IHandleSearch}> = (props) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    // setSearchTerm(evt.target.value);
    props.onSearch(evt.target.value);
  };
  return (
    <>      
    <input type="text" onChange={handleChange} />
    {/* <p>Searching for <strong>{searchTerm}</strong>.</p> */}
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

  const [searchTerm, setSearchTerm] = React.useState('11111');
  const handleSearch: IHandleSearch = (term) => setSearchTerm(term);
  const searchPosts = posts.filter(el => el.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Search onSearch={handleSearch}/>
      <List list={searchPosts} list2 = {posts}/>
    </>

  );
}

export default App;
