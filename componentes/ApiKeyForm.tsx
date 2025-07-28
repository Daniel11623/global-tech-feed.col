import React, { useState } from 'react';

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  return (
    <div className="bg-surface p-8 rounded-xl shadow-glow max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-on-surface mb-2">Ingresa tu API Key de Google</h2>
      <p className="text-on-surface-secondary mb-6">
        Para usar esta aplicación, necesitas una API Key de Google AI Studio. Tu clave se guardará solo en tu navegador para esta sesión.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pega tu API Key aquí"
          className="w-full bg-background/50 border-2 border-surface focus:border-accent focus:outline-none rounded-lg px-4 py-3 text-on-surface placeholder-on-surface-secondary"
          aria-label="API Key de Google Gemini"
        />
        <button
          type="submit"
          className="w-full border-2 border-accent bg-accent text-background font-bold py-3 px-5 rounded-lg hover:bg-transparent hover:text-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          Guardar y Cargar Noticias
        </button>
      </form>
       <p className="text-xs text-on-surface-secondary mt-4">
        Puedes obtener tu clave en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google AI Studio</a>.
      </p>
    </div>
  );
};

export default ApiKeyForm;
