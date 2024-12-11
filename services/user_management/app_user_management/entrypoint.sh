#!/bin/bash


sleep 5

# sleep 10



# mv default_avatar /app/media/avatars

python manage.py makemigrations

sleep 2

python manage.py migrate

# python manage.py runserver_plus   --cert-file cert.pem --key-file key.pem  127.0.0.1:8000


python manage.py runserver 0.0.0.0:8000
