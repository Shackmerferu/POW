# phpMyAdmin MySQL-Dump
# version 2.3.2
# http://www.phpmyadmin.net/ (download page)
#
# servidor: localhost
# Tiempo de generación: 02-02-2004 a las 00:40:31
# Versión del servidor: 4.00.12
# Versión de PHP: 4.3.1
# Base de datos : `lindavista`
# --------------------------------------------------------

#
# Estructura de tabla para la tabla `votos`
#

CREATE TABLE votos (
  id tinyint(3) unsigned NOT NULL auto_increment,
  votos1 int(10) unsigned NOT NULL default '0',
  votos2 int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (id)
) TYPE=MyISAM COMMENT='Votos registrados en la encuesta';

#
# Volcar la base de datos para la tabla `votos`
#

INSERT INTO votos VALUES (1, 49, 12);

    

    
