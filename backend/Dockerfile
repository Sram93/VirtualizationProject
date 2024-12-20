# Utiliser une image Python comme base
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier le contenu du backend dans l'image Docker
COPY . /app

# Installer les dépendances nécessaires
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port sur lequel Flask fonctionne
EXPOSE 5000

# Lancer l'application Flask
CMD ["flask", "run", "--host=0.0.0.0"]
