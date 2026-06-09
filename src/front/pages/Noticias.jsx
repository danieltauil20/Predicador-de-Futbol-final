import React, { useState, useEffect } from 'react';
import '../Noticias.css';


export const Noticias = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Conexión real y Auto-Actualización
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error("Error cargando noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews(); // Carga inicial

    // Configura un temporizador silencioso cada 5 minutos (300,000 milisegundos)
    const interval = setInterval(fetchNews, 300000);
    
    // Limpia el temporizador si el usuario sale de la página
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="gt-loader">Buscando las últimas exclusivas...</div>;

  return (
    <div className="gt-news-page animate-fade-in">
      <div className="gt-ranking-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="gt-ranking-title"><span>NOTICIAS</span> AL MINUTO</h1>
        <p className="gt-subtitle">La actualidad del fútbol Europeo y Mundial</p>
      </div>

      <div className="gt-news-grid">
        {news.map((item) => (
          // 🔥 Envolvemos la tarjeta en un enlace seguro hacia la web original
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="gt-news-card" 
            style={{ textDecoration: 'none' }}
          >
            <div className="gt-news-img-container">
              <span className="gt-news-tag">{item.tag}</span>
              <img src={item.image} alt={item.title} className="gt-news-img" />
            </div>
            
            <div className="gt-news-content">
              <h3 className="gt-news-title">{item.title}</h3>
              <p className="gt-news-desc">{item.description}</p>
              
              <div className="gt-news-footer">
                <span>📰 {item.source}</span>
                <span>⏱️ {item.date}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};