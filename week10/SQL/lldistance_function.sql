CREATE OR REPLACE FUNCTION lldistance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision) RETURNS double precision AS
'SELECT 2 * 3961 * asin(sqrt((sin(radians(($3 - $1) / 2))) ^ 2 + cos(radians($1)) * cos(radians($3)) * (sin(radians(($4 - $2) / 2))) ^ 2));'
LANGUAGE sql;

commit;

--http://daynebatten.com/2015/09/latitude-longitude-distance-sql/
