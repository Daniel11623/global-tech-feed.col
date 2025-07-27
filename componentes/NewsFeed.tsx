import React from 'react';
import { Article } from '../types';
import NewsCard from './NewsCard';

interface NewsFeedProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, onArticleSelect }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} onReadMore={onArticleSelect} />
      ))}
    </div>
  );
};

export default NewsFeed;
