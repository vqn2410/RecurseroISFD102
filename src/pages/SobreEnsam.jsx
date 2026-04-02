import { BookOpen, History, MapPin, Award, Heart, Shield, Calendar, Music, Users, Instagram } from 'lucide-react';
import { LandingFooter } from '../components/LandingUI';
import useReveal from '../hooks/useReveal';
import '../styles/sobre-ensam.css';

export default function SobreEnsam() {
    useReveal();

    const timelineEvents = [
        { year: "1909", title: "Fundación", desc: "Don Antonio Mentruyt funda la Sociedad Popular de Educación de Lomas de Zamora." },
        { year: "1912", title: "Inauguración Oficial", desc: "Apertura de la Escuela Normal de Lomas de Zamora en la Quinta Las Golondrinas." },
        { year: "1931", title: "Reconocimiento Biblioteca", desc: "La Biblioteca Antonio Mentruyt es reconocida oficialmente como Biblioteca de la Nación." },
        { year: "1948", title: "Edificio Actual", desc: "Inauguración de la sede en Manuel Castro 990 con la presencia de Juan Domingo Perón." },
        { year: "1970", title: "Formación Docente", desc: "Se crea el Profesorado para la Enseñanza Primaria; la escuela pasa a llamarse ENSAM." },
        { year: "1986", title: "Apertura de Turnos", desc: "El profesorado se traslada al turno vespertino, permitiendo el ingreso de varones." },
        { year: "1994", title: "Provincialización", desc: "Transferencia del sistema nacional a la Provincia de Buenos Aires." },
        { year: "1997", title: "Unidad Académica", desc: "Reconocimiento como Unidad Académica, integrando todos los niveles educativos." }
    ];

    return (
        <div style={{ background: 'var(--white)' }}>            <header className="hero main-hero-ensam">
                <div className="hero-content reveal" style={{ textAlign: 'center', margin: '0 auto', zIndex: 2 }}>
                    <h1 className="hero-title ensam-title-main">Nuestra Historia</h1>
                    <p className="hero-description" style={{ color: '#cbd5e1' }}>Identidad, trayectoria y memoria de la Escuela Normal Superior "Antonio Mentruyt".</p>
                </div>
            </header>

            <section className="section" style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem' }}>

                {/* Origins with Image */}
                <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', marginBottom: '8rem', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <History size={32} color="var(--color-primary)" />
                            <h2 style={{ fontSize: '2.25rem' }}>Los Orígenes</h2>
                        </div>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            La historia del ENSAM se remonta a comienzos del siglo XX. El 7 de junio de 1909, por iniciativa de los vecinos y ante la necesidad de dar instrucción a la creciente población escolar de Lomas de Zamora, <strong>Don Antonio Mentruyt</strong> fundó la Sociedad Popular de Educación.
                        </p>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            De esa iniciativa nació la <strong>Sociedad Popular Modelo</strong>, inaugurada oficialmente en 1912, iniciando una tradición formadora de docentes que ha marcado a generaciones de profesionales en la región.
                        </p>
                    </div>
                    <div className="reveal reveal-delay-1">
                        <img
                            src="https://lh3.googleusercontent.com/sitesv/APaQ0STSxisFix1TicRdHVY2wFuyZBVtKrOzTZi6s-5mAOjP_LGVkNnPS_5PSFbLBRp3ZNOR0d3-I2cDe72-4RcTIJdCzqXBh8lOIZuFjSJS3c3cKKNK2Lj_2MO0KuM5xvnLjJ0jgG0fhRVQO3EKQ_dgs84TvJ6OnyeuDnt4sivHUlDKRc6XuRfOjpJYP0MIirulvarfFBvxN1LC50WGR5WbfHDNlZIN7vw1kiJedQ8=w1280"
                            alt="Don Antonio Mentruyt"
                            style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-hover)', border: '1px solid var(--border)' }}
                        />
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="reveal" style={{ marginBottom: '8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <Calendar size={32} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '2.25rem' }}>Línea del Tiempo</h2>
                    </div>

                    <div className="container">
                        <div className="timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                            <div className="reveal reveal-delay-1">
                                {timelineEvents.slice(0, 4).map((event, idx) => (
                                    <div key={idx} style={{ position: 'relative', marginBottom: '2.5rem', paddingLeft: '1.5rem' }}>
                                        <div style={{ position: 'absolute', left: '-0.5rem', top: '5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-primary)', border: '4px solid white', boxShadow: '0 0 0 1px var(--color-primary)' }}></div>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-secondary)' }}>{event.year}</span>
                                        <h4 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{event.title}</h4>
                                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{event.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="reveal reveal-delay-2">
                                {timelineEvents.slice(4).map((event, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-dot"></div>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-secondary)' }}>{event.year}</span>
                                        <h4 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{event.title}</h4>
                                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{event.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consolidación and Formación */}
                <div className="reveal container-grid-ensam">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <BookOpen size={32} color="var(--color-primary)" />
                            <h2 style={{ fontSize: '1.8rem' }}>Consolidación Institucional</h2>
                        </div>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                            El actual edificio de Manuel Castro 990 fue inaugurado en mayo de 1948, con la presencia del entonces presidente Juan Domingo Perón. A partir de entonces, la institución pasó a llamarse <strong>Escuela Normal Mixta de Lomas de Zamora</strong>, convirtiéndose un referente educativo y cultural del distrito.
                        </p>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                            La Biblioteca "Antonio Mentruyt", que comenzó como la biblioteca de la Sociedad Popular Modelo, fue reconocida oficialmente en 1931 como Biblioteca de la Nación, siendo considerada una de las mejores bibliotecas escolares de la zona sur.
                        </p>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Award size={32} color="var(--color-secondary)" />
                            <h2 style={{ fontSize: '1.8rem' }}>Formación Docente</h2>
                        </div>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1rem' }}>
                            Durante la primera mitad del siglo XX, la escuela formó <strong>Maestros Normales Nacionales</strong>. En 1970, se creó el Profesorado para la Enseñanza Primaria, y la institución pasó a denominarse ENSAM.
                        </p>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1rem' }}>
                            En 1978, se sumó el Profesorado para la Enseñanza Preescolar. En 1986, el profesorado se trasladó al turno vespertino, permitiendo el ingreso de varones.
                        </p>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                            Dos años después, en 1988, se implementó el Magisterio de Educación Básica (M.E.B.), con una trayectoria de dos promociones.
                        </p>
                    </div>
                </div>

                {/* Unidad Académica */}
                <div className="reveal card" style={{ padding: '3rem', marginBottom: '8rem', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Users size={32} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '1.8rem' }}>De la Nacionalización a la Unidad Académica</h2>
                    </div>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                        En 1994, la escuela fue incorporada a la Provincia de Buenos Aires. Este proceso dividió la institución en cuatro escuelas: el <strong>Jardín Nº 933</strong>, la <strong>E.G.B. Nº 91</strong>, la <strong>Escuela Media Nº 21</strong> y el <strong>Instituto Superior de Formación Docente Nº 102 (ISFD 102)</strong>.
                    </p>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                        En 1997, el ENSAM fue reconocido como <strong>Unidad Académica</strong>, reafirmando su identidad integral. Con el tiempo, el ISFD 102 incorporó profesorados de Lengua y Literatura, Biología, Matemática y Economía y Gestión, además de los originales de Inicial y Primaria.
                    </p>
                </div>

                {/* Building & Library with Images */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
                    <div className="card reveal reveal-delay-1" style={{ padding: 0, overflow: 'hidden' }}>
                        <img src="https://lh3.googleusercontent.com/sitesv/APaQ0SSGGAqH2IeHnxVB1QG1Is77iMztJcgye_dI79IqokLMxuUFBFTE_RYtI8OAv_WGkDoNyWISOxh5FJrUJfIZ718hWMex8J-trN3wC7Bd0DHRqs0fCOg_L1w6Yu5bAiHyRk8D6GkJBkUkhSH5IBt7cGjgcldb55nJHnSkspmKHNJMtyB39F5-TgmUoWZDMPZerIF6LaeDCi9KH5b6ZgDEw5elCXCSXbPcV8k5zUo=w1280" style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt="Quinta Las Golondrinas" />
                        <div style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <MapPin size={24} color="var(--color-secondary)" />
                                <h3 style={{ fontSize: '1.4rem' }}>Quinta Las Golondrinas</h3>
                            </div>

                        </div>
                    </div>
                    <div className="card reveal reveal-delay-2" style={{ padding: 0, overflow: 'hidden' }}>
                        <img src="https://lh3.googleusercontent.com/sitesv/APaQ0STurGWbt9eHdHWFoVbhc_9QyvLrJSEQRJhriAhXfIllDO14dnu9AsU0WAC79FVL4BJFbd_HyuKLFNCmpJiMpVK144sALrT-K8Glckb5ne-HQUaQNDLVSl_GXFrYoFUR_nzSjVmXOKBeIi9MhQOpl3TZ7L08XNKXyniAmIs5ZA2ZjkMTyy6LwVWVHRKdQTZa2RuXBoVHMpJMqRxaY1IRfhVBOzh0i9NAN-1QL4U=w1280" style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt="Biblioteca Mentruyt" />
                        <div style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Award size={24} color="var(--color-primary)" />
                                <h3 style={{ fontSize: '1.4rem' }}>Sede de la Biblioteca Antonio Mentruyt</h3>
                            </div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                <strong>Dirección:</strong> Italia Nº 44 - Lomas de Zamora
                            </p>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                                <li><strong>Provincia:</strong> Buenos Aires</li>
                                <li><strong>Ciudad:</strong> Lomas de Zamora</li>
                                <li><strong>Declaratoria:</strong> Decreto N° 1.592/2008</li>
                                <li><strong>Categoría:</strong> Monumento Histórico Nacional</li>
                            </ul><br />
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong>Redes Sociales:</strong> 
                                <a href="https://www.instagram.com/bibliotecamentruyt/?hl=es" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Instagram size={16} /> @bibliotecamentruyt
                                </a>
                            </p>

                        </div>
                    </div>
                </div>
            </section>

            <section className="reveal" style={{
                background: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))',
                color: 'white',
                padding: '12rem 5%',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid #1e293b'
            }}>
                {/* Background Overlay Image */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(https://cdn.phototourl.com/member/2026-04-01-bc845a0b-c16a-42c3-b2a7-c7d43e2fbbf8.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: '0.15',
                    filter: 'grayscale(1)',
                    zIndex: 1
                }}></div>

                <div style={{ maxWidth: '950px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: 'white' }}>Memoria, Verdad y Justicia <br /><span style={{ color: '#f87171' }}>La División Perdida</span></h2>
                        <div style={{ width: '80px', height: '2px', background: 'var(--color-secondary)' }}></div>
                        <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#cbd5e1', maxWidth: '800px' }}>
                            "La División Perdida" rinde homenaje a estudiantes y docentes desaparecidos, rescatando la idea de que ningún compañero desaparecido pertenece al olvido.
                        </p>
                        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#94a3b8', maxWidth: '700px', lineHeight: '1.6' }}>
                            Hoy, no es solo un homenaje: es una lección viva de memoria que forma parte de la identidad de la ENSAM y de su misión educativa.
                        </p>
                    </div>
                </div>
            </section>

            {/* Himno section */}
            <section className="reveal" style={{ padding: '8rem 2rem', background: '#f1f5f9' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '3.5rem' }}>
                        <Music size={40} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '2.5rem' }}>Himno a la Escuela</h2>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--text-primary)', textAlign: 'left', background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
                            <p>"Compañeros, sepamos vivir el momento feliz que hoy nos une.<br />
                                Que tu mano estreche la mía en un gesto de amor maternal.<br />
                                Que tu canto y mi canto sean himno a la escuela que es patria y hogar."</p>
                            <br />
                            <p>"Por la patria, hogar y escuela, por la dicha y amistad.<br />
                                Avancemos bien alta la frente, avancemos gozando de paz."</p>
                            
                            <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid var(--border)', opacity: 0.5 }} />
                            
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500', fontStyle: 'normal' }}>
                                Letra: Prof. Osvaldo Abruzzetti y Prof. María Luisa Tersano <br />
                                Música: Prof. Aderm Lemos
                            </p>
                        </div>

                        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', aspectRatio: '16/9' }}>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src="https://www.youtube.com/embed/4CI6BPkip5U" 
                                title="Himno ENSAM" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                    Esta información fue reconstruida gracias a el libro histórico del ENSAM, testimonios de ex-alumnos, docentes y no docentes.
                </p>
            </section>

            <LandingFooter />
        </div>
    );
}
