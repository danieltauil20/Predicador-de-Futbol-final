import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export const WorldCupCarousel = ({ onSelect }) => {
    const grupos = [
        { nombre: "GRUPO A", equipos: [{ code: "mexico", name: "mexico" }, { code: "sudafrica", name: "sudafrica" }, { code: "corea", name: "corea" }, { code: "rep. checa", name: "rep.checa" }] },
        { nombre: "GRUPO B", equipos: [{ code: "canada", name: "canada" }, { code: "bosnia", name: "bosnia" }, { code: "qatar", name: "qatar" }, { code: "suiza", name: "suiza" }] },
        { nombre: "GRUPO C", equipos: [{ code: "brasil", name: "brasil" }, { code: "marruecos", name: "marruecos" }, { code: "haiti", name: "haiti" }, { code: "escocia", name: "escocia" }] },
        { nombre: "GRUPO D", equipos: [{ code: "usa", name: "usa" }, { code: "paraguay", name: "paraguay" }, { code: "australia", name: "australia" }, { code: "turquia", name: "turquia" }] },
        { nombre: "GRUPO E", equipos: [{ code: "alemania", name: "alemania" }, { code: "curazao", name: "curazao" }, { code: "c. de marfil", name: "c. de marfil" }, { code: "ecuador", name: "ecuador" }] },
        { nombre: "GRUPO F", equipos: [{ code: "paises bajos", name: "paises bajos" }, { code: "japon", name: "japon" }, { code: "suecia", name: "suecia" }, { code: "tunez", name: "tunez" }] },
        { nombre: "GRUPO G", equipos: [{ code: "belgica", name: "belgica" }, { code: "egipto", name: "egipto" }, { code: "iran", name: "iran" }, { code: "n. zelanda", name: "n. zelanda" }] },
        { nombre: "GRUPO H", equipos: [{ code: "espana", name: "espana" }, { code: "cabo verde", name: "cabo verde" }, { code: "arabia saudita", name: "arabia saudita" }, { code: "uruguay", name: "uruguay" }] },
        { nombre: "GRUPO I", equipos: [{ code: "francia", name: "francia" }, { code: "senegal", name: "senegal" }, { code: "iran", name: "iran" }, { code: "noruega", name: "noruega" }] },
        { nombre: "GRUPO J", equipos: [{ code: "belgica", name: "belgica" }, { code: "argelia", name: "argelia" }, { code: "austria", name: "austria" }, { code: "jordania", name: "jordania" }] },
        { nombre: "GRUPO K", equipos: [{ code: "portugal", name: "portugal" }, { code: "congo", name: "congo" }, { code: "uzbekistan", name: "uzbekistan" }, { code: "colombia", name: "colombia" }] },
        { nombre: "GRUPO L", equipos: [{ code: "inglaterra", name: "inglaterra" }, { code: "croacia", name: "croacia" }, { code: "ghana", name: "ghana" }, { code: "panama", name: "panama" }] },
    ];

    return (
        <div style={{ width: "100%", paddingTop: "40px", paddingBottom: "10px" }}>
            <div style={{
                maxWidth: "1175px", margin: "0 auto",
                background: "linear-gradient(90deg, #3CAC3B, #2A398D, #E61D25)",
                borderRadius: "12px", padding: "10px 28px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}>
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={4}
                    spaceBetween={30}
                    loop={true}
                    speed={1500} /* Transición de 1.5s para suavidad */
                    autoplay={{
                        delay: 3000, /* Espera 3 segundos antes de pasar al siguiente */
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    style={{ padding: "0 10px" }}
                >
                    {grupos.map((g, i) => (
                        <SwiperSlide key={i}>
                            <div style={{
                                background: "#E2E8F0",
                                borderRadius: "8px",
                                padding: "12px",
                                textAlign: "center",
                                height: "90px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <h5 style={{ margin: "0 0 10px 0", color: "#1E293B", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>
                                    {g.nombre}
                                </h5>

                                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                    {g.equipos.map((team, j) => (
                                        <div
                                            key={j}
                                            onClick={() => onSelect && onSelect(team)}
                                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
                                        >
                                            <img
                                                src={`/logos/${team.code.toLowerCase()}.png`}
                                                alt={team.code}
                                                style={{ width: "32px", height: "32px", objectFit: "contain" }}
                                            />
                                            <span style={{ fontSize: "10px", color: "#1E293B", fontWeight: "700" }}>
                                                {team.code.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};