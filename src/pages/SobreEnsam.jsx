import React from 'react';
import { BookOpen, Users, MapPin, Award, History, Music } from 'lucide-react';

const SobreEnsam = () => {
    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>Sobre el ENSAM</h1>
                <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Conocé la historia, identidad y trayectoria de la Escuela Normal Superior "Antonio Mentruyt".
                </p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <History size={28} style={{ marginRight: '1rem' }} />
                    <h2 style={{ marginBottom: 0 }}>Los Orígenes</h2>
                </div>
                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <p>
                        La historia del ENSAM se remonta a comienzos del siglo XX. El 7 de junio de 1909, por iniciativa de los vecinos y ante la necesidad de dar instrucción a la creciente población escolar de Lomas de Zamora, Don Antonio Mentruyt fundó la Sociedad Popular de Educación de Lomas de Zamora. Su propósito fue abrir las puertas del saber a todos los niños que carecían de escuela. De esa iniciativa nació la Sociedad Popular Modelo, ubicada en la calle España, que contó con el reconocimiento oficial del Instituto Nacional, otorgándole validez nacional a los estudios primarios por Decreto del 15 de junio de 1909.
                    </p>
                    <p>
                        En 1910, la escuela pasó a funcionar en la Quinta "Las Golondrinas", ubicada en las actuales calles Las Heras y Sáenz, en terrenos donados por la Sociedad Popular de Educación. Finalmente, el 11 de diciembre de 1911, la Sociedad donó al Supremo Gobierno de la Nación el edificio, el terreno y el mobiliario en pleno funcionamiento, con el objetivo de crear una Escuela Normal Nacional.
                    </p>
                    <p>
                        Así, el 23 de abril de 1912 quedó inaugurada oficialmente la Escuela Normal de Lomas de Zamora, que marcó el inicio de una larga tradición formadora de docentes en el sur del Gran Buenos Aires.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                        <MapPin size={28} style={{ marginRight: '1rem' }} />
                        <h2 style={{ marginBottom: 0, fontSize: '1.5rem' }}>Ubicación</h2>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: '2' }}>
                        <li><strong>Provincia:</strong> Buenos Aires</li>
                        <li><strong>Ciudad:</strong> Lomas de Zamora</li>
                        <li><strong>Dirección:</strong> Italia Nº 44</li>
                        <li><strong>Declaratoria:</strong> <a href="https://www.argentina.gob.ar/normativa/nacional/decreto-1592-2008-145525/texto" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Decreto N° 1.592/2008</a></li>
                        <li><strong>Categoría:</strong> Monumento Histórico Nacional</li>
                    </ul>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        <BookOpen size={28} style={{ marginRight: '1rem' }} />
                        <h2 style={{ marginBottom: 0, fontSize: '1.5rem' }}>Consolidación Institucional</h2>
                    </div>
                    <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                        El actual edificio de Manuel Castro 990 fue inaugurado en mayo de 1948, con la presencia del entonces presidente Juan Domingo Perón. A partir de entonces, la institución pasó a llamarse Escuela Normal Mixta de Lomas de Zamora, convirtiéndose un referente educativo y cultural del distrito.
                    </p>
                    <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                        La Biblioteca "Antonio Mentruyt", que comenzó como la biblioteca de la Sociedad Popular Modelo, fue reconocida oficialmente en 1931 como Biblioteca de la Nación, siendo considerada una de las mejores bibliotecas escolares de la zona sur.
                    </p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <Award size={28} style={{ marginRight: '1rem' }} />
                    <h2 style={{ marginBottom: 0 }}>Formación Docente</h2>
                </div>
                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <p>
                        Durante la primera mitad del siglo XX, la escuela formó Maestros Normales Nacionales. En 1970, por Resolución Ministerial, se creó el Profesorado para la Enseñanza Primaria, y la institución pasó a denominarse Escuela Nacional Normal Superior "Antonio Mentruyt" (ENSAM). En 1978, se sumó el Profesorado para la Enseñanza Preescolar, respondiendo a la demanda de la comunidad.
                    </p>
                    <p>
                        En 1986, el profesorado se trasladó al turno vespertino, hecho que permitió el ingreso de varones por primera vez. Dos años después, en 1988, se implementó el Magisterio de Educación Básica (M.E.B.), que tuvo una breve duración con dos promociones.
                    </p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <Users size={28} style={{ marginRight: '1rem' }} />
                    <h2 style={{ marginBottom: 0 }}>De la Nacionalización a la Unidad Académica</h2>
                </div>
                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <p>
                        En 1994, con la transferencia del sistema educativo nacional a las provincias, la escuela fue incorporada a la Provincia de Buenos Aires. Este proceso trajo nuevos desafíos: la institución se dividió en cuatro escuelas —el Jardín Nº 933, la E.G.B. Nº 91, la Escuela Media Nº 21 y el Instituto Superior de Formación Docente Nº 102 (ISFD 102)—, cada una bajo distinta supervisión.
                    </p>
                    <p>
                        Aun así, el espíritu de la Normal se mantuvo. En 1997, por Resolución Nº 8533, el ENSAM fue reconocido como Unidad Académica, reafirmando su identidad y su proyecto educativo integral. Con la creación del ISFD Nº 102, continuaron dictándose las carreras de Profesorado en Educación Inicial y Profesorado en Educación Primaria. En los años siguientes se incorporaron los profesorados de Lengua y Literatura, Biología, Matemática y Economía y Gestión.
                    </p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '2rem', borderLeft: '4px solid var(--secondary)' }}>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Memoria</h2>
                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <p>
                        Durante los años de la dictadura cívico-militar (1976-1983), el ENSAM fue atravesado por la violencia del terrorismo de Estado. Se persiguió a estudiantes, docentes y militantes sociales, convirtiéndose las escuelas en sitios de silencios impuestos.
                    </p>
                    <p>
                        En ese contexto, el ENSAM sufrió la desaparición de varios de sus estudiantes y profesores. Con los años, la comunidad educativa los reunió simbólicamente bajo el nombre de <strong>"La División Perdida"</strong>, rescatando la idea de que ningún compañero desaparecido pertenece al olvido. Hoy, la "División Perdida" no es solo un homenaje: es una lección viva de memoria que forma parte de la identidad del ENSAM y de su misión educativa.
                    </p>
                </div>
            </div>

        <div className="card" style={{ marginBottom: '2rem', padding: '2rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#0369a1' }}>
                <Music size={28} style={{ marginRight: '1rem' }} />
                <h2 style={{ marginBottom: 0 }}>Himno a la Escuela</h2>
            </div>
            <div style={{ fontStyle: 'italic', textAlign: 'center', color: '#0f172a', lineHeight: '2' }}>
                <p>
                    "Compañeros, sepamos vivir el momento feliz que hoy nos une.<br />
                    Que tu mano estreche la mía en un gesto de amor maternal.<br />
                    Que tu canto y mi canto sean himno a la escuela que es patria y hogar."
                </p>
                <p>
                    "Por la patria, hogar y escuela, por la dicha y amistad.<br />
                    Avancemos bien alta la frente, avancemos gozando de paz."
                </p>
                <p style={{ fontSize: '0.85rem', marginTop: '1rem', marginBottom: '2rem', color: '#475569' }}>
                    Letra: Prof. Osvaldo Abruzzetti y Prof. María Luisa Tersano | Música: Prof. Aderm Lemos
                </p>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '0.5rem' }}>
                <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src="https://www.youtube.com/embed/4CI6BPkip5U" 
                    title="Himno ENSAM" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen>
                </iframe>
            </div>
        </div>

            <div className="text-center text-secondary" style={{ marginTop: '3rem', fontSize: '0.9rem' }}>
                <p>Esta información fue reconstruida gracias a el libro histórico del ENSAM, testimonios de ex-alumnos, docentes y no docentes.</p>
            </div>
        </div>
    );
};

export default SobreEnsam;
