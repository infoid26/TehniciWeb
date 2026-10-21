CREATE TYPE product_type AS ENUM ('cake', 'pastry', 'icecream');
CREATE TYPE product_category AS ENUM ('regular', 'special', 'diet');
CREATE TABLE IF NOT EXISTS products (
 id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text,
 price numeric(8,2) NOT NULL CHECK(price >= 0), weight integer NOT NULL CHECK(weight >= 0),
 type product_type DEFAULT 'cake', calories integer NOT NULL CHECK(calories >= 0),
 category product_category DEFAULT 'regular', ingredients varchar[],
 diabetic_friendly boolean NOT NULL DEFAULT false, image varchar(300),
 created_at timestamp DEFAULT current_timestamp
);
INSERT INTO products(name,description,price,weight,type,calories,category,ingredients,diabetic_friendly,image) VALUES
('Chocolate cake','Dark chocolate and a soft sponge.',12,200,'cake',400,'regular',ARRAY['flour','milk','chocolate'],false,'cake'),
('Fruit pastry','Fresh fruit on crisp pastry.',6,150,'pastry',280,'special',ARRAY['flour','fruit'],false,'tea'),
('Vanilla ice cream','A cool vanilla dessert.',8,120,'icecream',220,'regular',ARRAY['milk','vanilla'],false,'icecream'),
('Sugar-free cake','A cake made with sweetener.',10,180,'cake',250,'diet',ARRAY['flour','milk','sweetener'],true,'cake');
