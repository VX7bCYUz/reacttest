import React, {
  ChangeEventHandler,
  FC,
  useEffect,
  useReducer,
  Reducer,
  useState,
  useCallback,
  createContext,
} from 'react';
import './App.css';
import styled from 'styled-components';
import classes from './App.module.css';

const StyledApp = styled.div`
  margin: 100px auto;
  max-width: 600px;
  padding: 30px;
  border: 1px dashed grey;
  border-radius: 15px;
`;

interface IPost {
  title: string;
  url: string;
  author?: string;
  points?: number;
  objectID: number;
}

interface IListProps {
  list: IPost[];
  onRemoveItem: (p: IPost) => void;
}

const List: FC<IListProps> = (props) => {
  return (
    <>
      {props.list.map(function (el) {
        return (
          <div className={classes.clmy} key={el.objectID}>
            <div>{el.title}</div>{' '}
            <div>
              <img src={el.url} alt={el.title} />
            </div>
            <button onClick={() => props.onRemoveItem(el)}>delete</button>
          </div>
        );
      })}
    </>
  );
};

type IHandleSearch = (val: string) => void;

interface ISearchProps {
  term: string;
  onSearch: IHandleSearch;
  id: string;
  children: string;
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
  );
};

const useSemiPersistentState = (key: string, initialState = '') => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue] as const;
};

type IPostsReducerAction =
  | {
      type: 'FETCH_INIT';
    }
  | {
      type: 'FETCH_SUCCESS';
      payload: IPost[];
    }
  | {
      type: 'FETCH_FAILURE';
    }
  | {
      type: 'DELETE';
      payload: IPost;
    };

interface IPostsState {
  data: IPost[];
  isLoading: boolean;
  isError: boolean;
}

const postsReducer: Reducer<IPostsState, IPostsReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { data: [], isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return { data: action.payload, isLoading: false, isError: false };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    case 'DELETE':
      return {
        ...state,
        data: state.data.filter((p) => p.objectID !== action.payload.objectID),
      };
  }
};

interface IApiPost {
  /*
  title: string | null;
  url: string | null;
  author: string;
  points: number;
  objectID: string;
 */
  _id: number;
  name: string;
  imageUrl: string;
}

interface IApiResponse {
  data: IApiPost[];
}

// const API_URL = 'https://hn.algolia.com/api/v1/search';
const API_URL = 'https://api.disneyapi.dev/characters';

interface IUser {
  name: string;
}
interface IUserContext {
  user: IUser;
}

export const userContext = createContext<IUserContext>({
  user: {
    name: 'noname',
  },
});

function App() {
  const [posts, dispatchPosts] = useReducer(postsReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const handleSearch: IHandleSearch = (term) => {
    setSearchTerm(term);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handlePosts = useCallback(() => {
    dispatchPosts({ type: 'FETCH_INIT' });
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((result: IApiResponse) => {
        dispatchPosts({
          type: 'FETCH_SUCCESS',
          payload: result.data.map((el) => ({
            title: el.name,
            url: el.imageUrl,
            // author: '',
            // points: 0,
            objectID: el._id,
          })),
        });
      })
      .catch(() => dispatchPosts({ type: 'FETCH_FAILURE' }));
  }, [searchTerm]);

  useEffect(handlePosts, [handlePosts]);
  const handleRemovePost = (post: IPost) => {
    dispatchPosts({
      type: 'DELETE',
      payload: post,
    });
  };

  return (
    <StyledApp>
      <InputWithLabel term={searchTerm} onSearch={handleSearch} id="search">
        Search123
      </InputWithLabel>
      {posts.isError && <p>Something went wrong ...</p>}
      {posts.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={posts.data} onRemoveItem={handleRemovePost} />
      )}
    </StyledApp>
  );
}

export default App;
