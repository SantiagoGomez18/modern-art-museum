SELECT COUNT(*) FROM museum_entity;

SELECT * FROM museum_entity ORDER BY name ASC LIMIT 20;

SELECT * 
FROM museum_entity
ORDER BY name ASC
LIMIT 10 OFFSET 10;

SELECT *
FROM museum_entity
ORDER BY name ASC
LIMIT 10 OFFSET 0;

SELECT *
FROM museum_entity
WHERE name ILIKE '%oro%'
ORDER BY name;

SELECT *
FROM museum_entity
WHERE city ILIKE '%Bogotá%';

SELECT *
FROM museum_entity
WHERE "foundedBefore" < 1900;

SELECT *
FROM museum_entity
WHERE name ILIKE '%oro%'
  AND city ILIKE '%Bogotá%'
  AND "foundedBefore" < 1900
ORDER BY name
LIMIT 5 OFFSET 0;

SELECT *
FROM museum_entity
ORDER BY name ASC
LIMIT 10 OFFSET 0;


