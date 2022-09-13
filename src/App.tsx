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
  console.log(props.list2)
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

function App() {
  const logInputEvent: ChangeEventHandler<HTMLInputElement> = (evt) => console.log(evt)
  const posts: IPost[] = [
    {
      title: 'title 1234',
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

  return (
    <>
      <input type="text" onChange={logInputEvent} />
      <List list={posts} list2 = {posts}/>
    </>

  );
}

export default App;
