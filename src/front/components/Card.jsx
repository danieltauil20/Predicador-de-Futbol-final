import { useNavigate } from "react-router-dom";

export const Card = ({ logo, title, country, slug }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => navigate(`/liga/${slug}`)}
    >
      <img src={logo} alt={title} className="league-logo" />

      <p>{title}</p>

      <span>{country}</span>
    </div>
  );
};