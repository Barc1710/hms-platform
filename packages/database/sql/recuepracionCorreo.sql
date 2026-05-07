--para poder recuperar contrasena
ALTER TABLE usuarios 
ADD COLUMN recovery_token TEXT,
ADD COLUMN recovery_token_expires TIMESTAMP WITH TIME ZONE;