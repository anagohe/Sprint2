CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    fecha_leida DATE NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    reseña TEXT,
    privado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita TEXT NOT NULL,
    libro_id INT,
    autor VARCHAR(100) NOT NULL,
    privado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE SET NULL
);
