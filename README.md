# structurre.fr

Site vitrine statique — **HTML + Tailwind CSS**, versionné sur **GitHub**, hébergé sur
**Cloudflare Pages** ou **Vercel**, formulaire de contact via **Web3Forms** ou **Formspree**.
Aucune base de données, aucun serveur : 100 % statique, 100 % gratuit.

## Structure

```
.
├── index.html              Accueil
├── services.html           Détail des prestations + FAQ
├── outils.html             Airtable et Notion, comment choisir
├── formation.html          Conception + formation des utilisateurs
├── tarifs.html             Grille tarifaire
├── contact.html            Formulaire + coordonnées
├── mentions-legales.html   Modèle à compléter
├── 404.html                Page d'erreur
├── assets/
│   ├── css/
│   │   ├── input.css       Source Tailwind (éditable)
│   │   ├── tailwind.css    GÉNÉRÉE par `npm run build` — ne pas éditer
│   │   └── site.css        CHARTE : couleurs + composants (à éditer ici)
│   ├── js/
│   │   ├── main.js         Menu mobile, apparition au scroll, lien actif
│   │   └── contact.js      Envoi du formulaire (config Web3Forms/Formspree)
│   └── img/                logo.svg, favicon.svg, og-image.svg
├── _headers, _redirects    Config Cloudflare Pages
├── vercel.json             Config Vercel
├── robots.txt, sitemap.xml SEO
└── .github/workflows/      CI : vérifie que la CSS se compile
```

## Charte d'interface

Six pages en navigation : **Accueil**, **Services**, **Outils**, **Formation**, **Tarifs**,
**Contact** (plus `mentions-legales.html` et `404.html`, accessibles par le pied de page mais
hors navigation principale). Au-delà de 1024 px la navigation est déployée ; en dessous, elle
passe dans le menu déroulant.

| | |
|---|---|
| Police principale | **Inter** (Google Fonts) |
| Fond principal | **#FFFFFF** |
| Texte principal | **#222222** |
| Couleur d'emphase | **#207DFB** |

La couleur d'emphase porte tout ce qui est interactif ou à mettre en avant : survols, état
actif, boutons, liens, icônes, chiffres clés, bande d'appel à l'action.

**Où changer quoi.** Les couleurs et les composants (boutons, cartes, champs, navigation,
messages) sont définis une seule fois dans `assets/css/site.css`, sous forme de variables CSS
et de classes maison (`.btn-primaire`, `.carte`, `.champ`, `.lien-nav`, `.surtitre`…).
Tailwind ne fournit que la mise en page (grilles, espacements, tailles de texte). Conséquence
pratique : modifier `--bleu` dans `site.css` recolore tout le site, et le rendu est identique
que la CSS Tailwind soit compilée ou non.

Le logotype (`assets/img/logo.svg`) sert d'identité dans l'en-tête, le pied de page et le
visuel d'accueil ; `favicon.svg` en reprend la silhouette, `og-image.svg` la vignette de partage.

## Le contenu

Le site présente une **agence no-code spécialisée Airtable et Notion** : conception
d'applications métier, automatisations, et formation des utilisateurs.

Le modèle tarifaire est annoncé partout de la même façon — à ne modifier qu'à un seul endroit
près, `tarifs.html`, puis à répercuter dans les rappels de `index.html`, `services.html` et
`formation.html` :

- **1 600 € HT** l'application couvrant un workflow complet, **4 heures de formation
  comprises** ;
- **100 à 150 € HT de l'heure** pour les évolutions ultérieures et les heures de formation
  supplémentaires, sans abonnement ;
- règlement : acompte de **30 % au démarrage**, solde à la mise en production.

Les trois paliers horaires (100 / 125 / 150 €) et l'unité facturée (« un workflow complet »)
sont définis sur `tarifs.html` : c'est ce qui rend le prix défendable en rendez-vous.

Le site précise explicitement que les heures de formation relèvent de la mission de conception
et **ne sont pas finançables par un OPCO** (`tarifs.html`, `formation.html`). Ne modifiez cette
formulation que si vous obtenez la certification Qualiopi.

## 1. Développer en local

Le site fonctionne **sans rien installer** : ouvrez `index.html` dans un navigateur, ou
servez le dossier :

```bash
python3 -m http.server 3000
```

puis http://localhost:3000

Tant que `assets/css/tailwind.css` n'a pas été généré, `main.js` charge automatiquement le
compilateur Tailwind navigateur pour que le rendu reste correct. C'est pratique en local,
mais **il faut compiler la CSS avant la mise en production** (voir ci-dessous).

## 2. Compiler la CSS (production)

Nécessite Node.js ≥ 18 ([nodejs.org](https://nodejs.org) ou `brew install node`).

```bash
npm install
npm run build     # génère assets/css/tailwind.css minifiée
npm run watch     # recompile à chaque modification pendant le développement
```

Cloudflare Pages et Vercel exécutent cette commande automatiquement au déploiement
(voir étape 4), donc vous pouvez aussi ne jamais compiler en local.

## 3. Versionner sur GitHub

Le dépôt Git est déjà initialisé avec un premier commit.

```bash
git remote add origin https://github.com/<votre-compte>/structurre.fr.git
git push -u origin main
```

## 4. Déployer

### Option A — Cloudflare Pages (recommandé pour un domaine .fr)

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Sélectionnez le dépôt, puis :
   - Framework preset : `None`
   - Build command : `npm run build`
   - Build output directory : `/`
3. **Save and Deploy**
4. Onglet **Custom domains** → ajoutez `structurre.fr` et `www.structurre.fr`

### Option B — Vercel

1. [vercel.com/new](https://vercel.com/new) → importez le dépôt
2. La configuration est déjà dans `vercel.json` — cliquez sur **Deploy**
3. **Settings → Domains** → ajoutez `structurre.fr`

Chaque `git push` sur `main` redéploie le site ; chaque pull request obtient une preview.

## 5. Activer le formulaire de contact

Le formulaire est inactif tant qu'aucune clé n'est renseignée.

### Web3Forms (par défaut, aucun compte à créer)

1. Sur [web3forms.com](https://web3forms.com), saisissez votre e-mail → vous recevez une
   **Access Key**
2. Dans `assets/js/contact.js`, remplacez `VOTRE_CLE_WEB3FORMS` par cette clé
3. Commitez et poussez

### Formspree (alternative)

1. Créez un formulaire sur [formspree.io](https://formspree.io) → URL `https://formspree.io/f/xxxxxxxx`
2. Dans `assets/js/contact.js` : `PROVIDER = "formspree"` et collez l'URL dans `ENDPOINT`

La clé Web3Forms est publique par nature (elle est visible dans le JS) : elle ne permet que
d'envoyer un message vers **votre** adresse. Le formulaire embarque un pot de miel anti-spam.

## 6. Avant la mise en ligne — check-list

- [ ] Remplacer les textes de démonstration (chiffres clés de l'accueil, témoignage)
- [ ] Téléphone `01 00 00 00 00`, e-mail et adresse — présents dans le header, le footer,
      `contact.html` et le bloc JSON-LD de `index.html`
- [ ] Compléter `mentions-legales.html` (SIRET, éditeur, hébergeur réellement utilisé)
- [ ] Renseigner la clé du formulaire
- [ ] **Tarifs** : vérifier que le décompte des 4 heures de formation décrit sur
      `formation.html` (2 h de prise en main + 1 h administrateur + 1 h de reprise) correspond
      bien à votre pratique
- [ ] Exporter `assets/img/og-image.svg` en PNG 1200 × 630 et pointer `og:image` dessus :
      LinkedIn, Facebook et X n'affichent pas les vignettes SVG
- [ ] Vérifier `sitemap.xml` si vous ajoutez des pages
