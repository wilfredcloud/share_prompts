'use client';
import {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  MouseEvent,
  DependencyList,
} from 'react';
import PromptCard from './PromptCard';
import { PromptCardListProps } from '@utils/interface';

const PromptCardList = ({ data, handleTagClick }: PromptCardListProps) => (
  <div className="mt-16 prompt_layout">
    {data.map((post) => (
      <PromptCard
        key={post._id}
        post={post}
        handleTagClick={(event: MouseEvent<HTMLParagraphElement>) =>
          handleTagClick(event, post.tag)
        }
        handleDelete={() => {}}
        handleEdit={() => {}}
      />
    ))}
  </div>
);

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(setTimeout(() => {}, 500));
  const [searchedResults, setSearchedResults] = useState([]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      clearTimeout(searchTimeout);
      setSearchText(event.target.value);
      setSearchTimeout(
        setTimeout(() => {
          const searchResult = filterPrompts(event.target.value);
          setSearchedResults(searchResult);
        }, 500)
      );
    },

    []
  );

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, 'i'); // 'i' flag for case-insensitive search
    return posts.filter(
      (item: Record<string, any>) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch('api/prompt');

      const data = await response.json();
      setPosts(data);
    };
    fetchPost();
  }, []);

  const handleTagClick = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    tagName: string
  ) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
            handleTagClick
          }
        />
      ) : (
        <PromptCardList
          data={posts}
          handleTagClick={(event: React.MouseEvent<HTMLParagraphElement>) =>
            handleTagClick
          }
        />
      )}
    </section>
  );
};

export default Feed;
