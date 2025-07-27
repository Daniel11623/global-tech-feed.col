import React from 'react';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
  onReadMore: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMore }) => {
  return (
    <div className="bg-surface rounded-xl shadow-neumorphic overflow-hidden transition-all duration-300 hover:shadow-glow flex flex-col group">
      <div className="overflow-hidden">
        <img className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110" src={article.imageUrl} alt={article.title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-accent uppercase tracking-wider">{article.source}</p>
        <h3 className="mt-2 text-xl font-bold text-on-surface leading-tight">{article.title}</h3>
        <p className="mt-3 text-on-surface-secondary text-base flex-grow">{article.summary}</p>
        <div className="mt-6">
          <button
            onClick={() => onReadMore(article)}
            className="inline-block border-2 border-accent text-accent font-bold py-2 px-5 rounded-lg hover:bg-accent hover:text-background transition-colors duration-300"
          >
            Leer más
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
