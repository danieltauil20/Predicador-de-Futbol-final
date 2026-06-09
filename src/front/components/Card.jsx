import { useNavigate } from "react-router-dom";

export const Card = ({ logo, title, country, slug }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    
    navigate(`/partidos?liga=${country}&temp=2024-2025&jornada=1`);
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <img src={logo} alt={title} className="league-logo" />

      <p>{title}</p>

      <span>{country}</span>
    </div>
  );
};