# Configuration Google Vision API

## 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Vision : https://console.cloud.google.com/apis/library/vision.googleapis.com

## 2. Créer un compte de service

1. Allez dans "IAM & Admin" > "Service Accounts"
2. Cliquez sur "Create Service Account"
3. Donnez un nom à votre compte de service
4. Assignez le rôle "Cloud Vision API Service Agent"
5. Créez et téléchargez la clé JSON

## 3. Configuration des variables d'environnement

### Option A: Fichier de service account (Recommandé)
```bash
# Placez le fichier JSON dans votre projet et ajoutez à .env
GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

### Option B: Variables d'environnement directes
```bash
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
GOOGLE_CLOUD_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
```

## 4. Test de l'intégration

L'API inclut un système de fallback automatique :
- Si Google Vision fonctionne → Analyse précise avec détection d'objets
- Si Google Vision échoue → Analyse de secours basée sur les dessins utilisateur

## 5. Fonctionnalités disponibles

### Détection d'objets
- Identification automatique des objets dans l'image
- Calcul de la précision des cercles dessinés
- Feedback intelligent basé sur les objets détectés

### Analyse de texte
- Détection du texte dans l'image
- Aide à la compréhension du contexte

### Évaluation intelligente
- Score basé sur la précision des annotations
- Feedback personnalisé selon le type de question
- Tolérance configurable pour les positions

## 6. Coûts

Google Vision API facture par requête :
- 1000 premières requêtes/mois : GRATUITES
- Après : ~$1.50 pour 1000 requêtes

Pour un usage éducatif, les coûts restent très raisonnables.

## 7. Sécurité

- Les clés de service sont sécurisées côté serveur
- Aucune donnée sensible n'est exposée côté client
- Les images sont analysées temporairement et peuvent être supprimées après analyse