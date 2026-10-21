CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member');
CREATE TABLE IF NOT EXISTS users (
 id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL,
 last_name varchar(100) NOT NULL, first_name varchar(100) NOT NULL,
 password_hash varchar(500) NOT NULL, role user_role NOT NULL DEFAULT 'member',
 email varchar(100) NOT NULL, chat_color varchar(50) NOT NULL,
 created_at timestamp DEFAULT current_timestamp, confirmation_code varchar(200),
 email_confirmed boolean DEFAULT false, photo varchar(200)
);
CREATE TABLE IF NOT EXISTS visits (
 id serial PRIMARY KEY, ip varchar(100) NOT NULL,
 user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL,
 visited_at timestamp DEFAULT current_timestamp
);
