import React, { ChangeEventHandler } from 'react';
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


const List = () => {
  return (
    <>
    {posts.map(function(el){
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

function App(): JSX.Element {
  const logInputEvent: ChangeEventHandler<HTMLInputElement> = (evt) => console.log(evt)
  return (
    <>
      <input type="text" onChange={logInputEvent} />
      <List />
    </>

  );
}

export default App;
