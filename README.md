# Paris Zombie Walk

Site de la Paris Zombie Walk : toutes les infos sur la zombie walk de Paris.

**Production : https://pariszombie.com/**

## Un site statique

Le site est entièrement statique : du HTML, du CSS, du JavaScript et des images, sans étape de build, sans dépendances et sans base de données.

```
index.html             page unique du site
styles.css             feuille de style principale
small-device*.css      styles responsive (1024 px et 640 px)
ie.css, poll.css       styles complémentaires
js/                    scripts (carte, vidéo, défilement…)
images/                images du site
parcour*.jpg           plans des parcours
.htaccess              redirection HTTP → HTTPS (Apache OVH)
```

Pour travailler en local, il suffit d'ouvrir `index.html` dans un navigateur.

## Déploiement

Le site est hébergé sur un mutualisé **OVH Perso** et déployé automatiquement par GitHub Actions ([`.github/workflows/deploy-ovh.yml`](.github/workflows/deploy-ovh.yml)).

**Tout ce qui arrive sur la branche `main` part en production.** Pour mettre le site à jour :

1. Travailler sur une branche dédiée.
2. Ouvrir une pull request vers `main`.
3. Merger la pull request : le workflow **Deploy OVH** se lance et envoie les fichiers sur le serveur en environ 30 secondes.
4. Vérifier le résultat sur https://pariszombie.com/.

On peut aussi relancer un déploiement à la main depuis l'onglet **Actions → Deploy OVH → Run workflow**.

### Fonctionnement

- L'envoi se fait par **FTP** dans le dossier `www/` de l'hébergement.
- Seuls les fichiers modifiés depuis le dernier déploiement sont envoyés. L'état est conservé sur le serveur dans `www/.ftp-deploy-sync-state.json` : **ne pas supprimer ce fichier**, sinon le déploiement suivant renverra tout le site.
- Un fichier supprimé du dépôt est aussi supprimé du serveur.
- Ne sont pas envoyés : `.git*`, `.github/`, `.DS_Store`, `README*`.
- Les fichiers modifiés directement sur le serveur (par FTP à la main) ne sont pas détectés et peuvent être écrasés au déploiement suivant : toujours passer par le dépôt.
