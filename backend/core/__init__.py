import pymysql
pymysql.version_info = (2, 2, 4, "final", 0) # This tricks the version check
pymysql.install_as_MySQLdb()