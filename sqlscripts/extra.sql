
CREATE ROLE db_executor

/* GRANT EXECUTE TO THE ROLE */
GRANT EXECUTE TO db_executor

GO

create login ofer with password = 'Password1234'

GO

CREATE USER ofer FOR LOGIN ofer;

GO

GRANT EXECUTE TO ofer

GO