-- Script SQL para atualizar a tabela de usuários com campos adicionais
-- Versão compatível com todas as versões de MySQL/MariaDB

-- Adicionar coluna country se não existir
SET @query = CONCAT('SELECT COUNT(*) INTO @exists FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = "users" AND column_name = "country"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @query = IF(@exists = 0, 'ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT NULL', 'SELECT "Coluna country já existe"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna city_state se não existir
SET @query = CONCAT('SELECT COUNT(*) INTO @exists FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = "users" AND column_name = "city_state"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @query = IF(@exists = 0, 'ALTER TABLE users ADD COLUMN city_state VARCHAR(150) DEFAULT NULL', 'SELECT "Coluna city_state já existe"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna postal_code se não existir
SET @query = CONCAT('SELECT COUNT(*) INTO @exists FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = "users" AND column_name = "postal_code"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @query = IF(@exists = 0, 'ALTER TABLE users ADD COLUMN postal_code VARCHAR(20) DEFAULT NULL', 'SELECT "Coluna postal_code já existe"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna tax_id se não existir
SET @query = CONCAT('SELECT COUNT(*) INTO @exists FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = "users" AND column_name = "tax_id"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @query = IF(@exists = 0, 'ALTER TABLE users ADD COLUMN tax_id VARCHAR(30) DEFAULT NULL', 'SELECT "Coluna tax_id já existe"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Dados de exemplo para teste (insira apenas se quiser)
-- Descomente e execute apenas se quiser adicionar um usuário de teste
/*
INSERT INTO users (first_name, last_name, email, password, phone, bio, facebook, x_com, linkedin, instagram, country, city_state, postal_code, tax_id)
VALUES (
    'Usuário', 
    'Teste', 
    'teste@example.com', 
    '$2a$10$dZfkLUkDgKNmLSVNT9nxQuaQE0GhUVED9iL5U.J82GlCFYpIoGZw.', -- senha: 123456
    '(11) 98765-4321', 
    'Desenvolvedor Full Stack', 
    'https://facebook.com/usuario.teste', 
    'https://x.com/usuario_teste', 
    'https://linkedin.com/in/usuario-teste', 
    'https://instagram.com/usuario.teste',
    'Brasil',
    'São Paulo, SP',
    '01234-567',
    '123.456.789-00'
);
*/