# Étape 1 : Choisir une image PHP avec Apache
FROM php:8.2-apache

# Étape 2 : Installer les extensions nécessaires et Composer
RUN apt-get update && \
    apt-get install -y libzip-dev unzip curl && \
    docker-php-ext-install zip && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Étape 3 : Copier les fichiers de ton projet dans le dossier web d’Apache
COPY . /var/www/html/

# Étape 4 : Définir le dossier de travail
WORKDIR /var/www/html/

# Étape 5 : Installer les dépendances PHP avec Composer
RUN composer install

# Étape 6 : Donner les bons droits à Apache
RUN chown -R www-data:www-data /var/www/html

# Port d'écoute
EXPOSE 80

# Commande de démarrage du serveur
CMD ["apache2-foreground"]
