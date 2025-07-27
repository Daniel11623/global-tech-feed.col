import React from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  return (
    <div className="bg-surface rounded-lg shadow-glow p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-accent hover:text-white font-semibold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Volver al feed
        </button>
      </div>

      <div className="overflow-hidden rounded-lg mb-6">
        <img className="h-64 md:h-96 w-full object-cover" src={article.imageUrl} alt={article.title} />
      </div>

      <p className="text-sm font-semibold text-accent uppercase tracking-wider">{article.source}</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
        {article.title}
      </h1>

      <div className="mt-8 prose prose-lg prose-p:text-on-surface-secondary prose-strong:text-on-surface max-w-none">
        <p className="lead text-on-surface text-xl">{article.summary}</p>
        <div 
          className="text-on-surface-secondary space-y-6" 
          dangerouslySetInnerHTML={{ __html: article.fullContent.replace(/\n/g, '<br />') }} 
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
