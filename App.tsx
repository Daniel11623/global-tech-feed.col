import React, { useState, useEffect, useCallback } from 'react';
import { Article } from './types';
import { fetchLatestTechNews, translateArticleToSpanish } from './services/geminiService';
import NewsFeed from './components/NewsFeed';
import LoadingSpinner from './components/LoadingSpinner';
import ArticleDetail from './components/ArticleDetail';
import ApiKeyForm from './components/ApiKeyForm';

interface SidebarProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ articles, onArticleSelect }) => {
  return (
    <aside className="space-y-6">
      <h2 className="text-2xl font-bold text-on-surface border-b-2 border-accent/50 pb-2">
        Destacados
      </h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <div 
            key={`sidebar-${article.id}`} 
            className="bg-surface p-4 rounded-lg shadow-neumorphic hover:shadow-glow transition-shadow duration-300 cursor-pointer"
            onClick={() => onArticleSelect(article)}
          >
            <p className="text-xs font-semibold text-accent uppercase tracking-wider">{article.source}</p>
            <h4 className="mt-1 font-semibold text-on-surface hover:text-accent transition-colors">
                {article.title}
            </h4>
          </div>
        ))}
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('gemini-api-key'));
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const loadAndTranslateNews = useCallback(async (key: string) => {
    setIsLoading(true);
    setError(null);
    setArticles([]);
    try {
      const fetchedNews = await fetchLatestTechNews(key);
      const processedArticles = await Promise.all(
        fetchedNews.map(async (articleData): Promise<Article> => {
          const articleWithDefaults: Article = { ...articleData, url: '#' };
          if (articleWithDefaults.lang === 'en') {
            try {
              const translatedContent = await translateArticleToSpanish(key, articleWithDefaults);
              return { ...articleWithDefaults, ...translatedContent, lang: 'es' };
            } catch (translationError) {
              console.error(`Could not translate article ${articleWithDefaults.id}, using original version.`, translationError);
              return articleWithDefaults;
            }
          }
          return articleWithDefaults;
        })
      );
      setArticles(processedArticles);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Ocurrió un error desconocido al cargar las noticias.");
        }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (apiKey) {
      loadAndTranslateNews(apiKey);
    }
  }, [apiKey, loadAndTranslateNews]);

  const handleApiKeySubmit = (key: string) => {
    sessionStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };
  
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };

  const handleBackToFeed = () => {
    setSelectedArticle(null);
  };
  
  const handleChangeApiKey = () => {
    sessionStorage.removeItem('gemini-api-key');
    setApiKey(null);
    setError(null);
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="bg-red-900/50 border border-red-500 text-red-300 p-6 rounded-lg text-center" role="alert">
            <p className="font-bold text-lg">Error al Cargar Noticias</p>
            <p className="my-4">{error}</p>
            <button
                onClick={handleChangeApiKey}
                className="inline-block border-2 border-accent text-accent font-bold py-2 px-5 rounded-lg hover:bg-accent hover:text-background transition-colors duration-300"
            >
                Usar otra API Key
            </button>
        </div>
      );
    }
    if (selectedArticle) {
        return <ArticleDetail article={selectedArticle} onBack={handleBackToFeed} />;
    }
    if (articles.length > 0) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <NewsFeed articles={articles} onArticleSelect={handleSelectArticle} />
                </div>
                <div className="lg:col-span-1">
                    <Sidebar articles={articles.slice(0, 4)} onArticleSelect={handleSelectArticle} />
                </div>
            </div>
        );
    }
     if (!isLoading && !error) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-on-surface">No se encontraron noticias.</h2>
                <p className="text-on-surface-secondary mt-2">Intenta recargar la página más tarde.</p>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans">
      <header className="bg-surface/50 backdrop-blur-lg sticky top-0 z-10 border-b border-surface">
        <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 00-14.14 0m14.14 0a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14M12 9v.01M12 12v.01M12 15v.01M12 18v.01M12 6v.01" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.5A2.5 2.5 0 0112 12a2.5 2.5 0 012.5-2.5" />
                </svg>
                <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
                    Global Tech Feed
                </h1>
            </div>
          <p className="mt-2 text-center text-lg text-on-surface-secondary">Las noticias de tecnología más importantes del mundo, en tu idioma.</p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!apiKey ? <ApiKeyForm onSubmit={handleApiKeySubmit} /> : renderContent()}
      </main>
    </div>
  );
};
