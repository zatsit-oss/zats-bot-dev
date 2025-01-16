#!/bin/bash

# Variables de configuration
PROJECT_ID="zatsit-dsi-sandbox-dev"        
REGION="europe-west9"                
FUNCTION_NAME="zatsbot"   
ENTRY_POINT="handler"                
RUNTIME="nodejs22"                   
MEMORY="256MB"                       
TIMEOUT="60s"                        
TRIGGER="--trigger-http"             
ALLOW_UNAUTH="true"                  

# Définir le projet GCP
echo "Définition du projet GCP..."
gcloud config set project $PROJECT_ID

# Déployer la fonction
echo "Déploiement de la fonction Cloud Functions..."
gcloud functions deploy $FUNCTION_NAME \
  --region=$REGION \
  --runtime=$RUNTIME \
  --memory=$MEMORY \
  --timeout=$TIMEOUT \
  --entry-point=$ENTRY_POINT \
  $TRIGGER \

# Vérifier le statut du déploiement
if [ $? -eq 0 ]; then
  echo "Déploiement réussi ! 🚀"
else
  echo "Le déploiement a échoué. Veuillez vérifier les logs."
fi
