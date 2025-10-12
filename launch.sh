#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

loco_admin="$SCRIPT_DIR/Locotrip-Admin"
loco_front="$SCRIPT_DIR/Locotrip-Front" 
loco_api="$SCRIPT_DIR/Locotrip-Api"

# Pull all the repos
echo "Press 1 to pull Locotrip-Admin"
echo "Press 2 to pull Locotrip-Front"
echo "Press 3 to pull Locotrip-Api"
echo "Press 4 to pull all"
echo "Press 5 to skip pull"
read -p "Enter your choice: " choice

case $choice in
    1)
        echo "Pulling Locotrip-Admin..."
        cd "$loco_admin" && git pull origin master
        echo "Install dependencies..."
        npm install
        cd "$SCRIPT_DIR"
        ;;
    2)
        echo "Pulling Locotrip-Front..."
        cd "$loco_front" && git pull origin master
        echo "Install dependencies..."
        npm install
        cd "$SCRIPT_DIR"
        ;;
    3)
        echo "Pulling Locotrip-Api..."
        cd "$loco_api" && git pull origin master
        echo "Install dependencies..."
        npm install
        cd "$SCRIPT_DIR"
        ;;
    4)
        echo "Pulling all repositories..."
        
        echo "Pulling Locotrip-Admin..."
        cd "$loco_admin" && git pull origin master
        echo "Install dependencies..."
        npm install
        cd "$SCRIPT_DIR"

        echo "Pulling Locotrip-Front..."
        cd "$loco_front" && git pull origin master
        echo "Install dependencies..."
        npm install
        cd "$SCRIPT_DIR"
        
        echo "Pulling Locotrip-Api..."
        cd "$loco_api" && git pull origin master
        echo "Install dependencies..."
        npm install 
        cd "$SCRIPT_DIR"
        ;;
    5)
        echo "Skipping pull..."
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "Choose server to launch..."
echo "Press 1 to launch Locotrip-Admin"
echo "Press 2 to launch Locotrip-Front"
echo "Press 3 to launch Locotrip-Api"
echo "Press 4 to launch all (separate windows)"
read -p "Enter your choice: " choice

# TODO
# Tester si le fichier .next existe pour le front et l'admin et .dist pour l'API
# Si non existant lancer un npm run build 

case $choice in
    1)
        echo "Launching Locotrip-Admin..."
        cmd.exe //c start cmd //k "npm run start:admin -p 3001"
        ;;
    2)
        echo "Launching Locotrip-Front..."
        cmd.exe //c start cmd //k "npm run start:front"
        ;;
    3)
        echo "Launching Locotrip-Api..."
        cmd.exe //c start cmd //k "npm run start:api"
        ;;
    4)
        echo "Launching all servers in separate terminals..."
        cmd.exe //c start cmd //k "npm run start:admin"
        sleep 1
        cmd.exe //c start cmd //k "npm run start:front"
        sleep 1
        cmd.exe //c start cmd //k "npm run start:api"
        ;;

    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

# TOADD
# Ajouter les variables d'environnements directement dans un .env à partir du model de .env.sample

# Lancer les migrations de l'API ? 
# echo "Choose if migrations"
# echo "Press 1 to launch migrations"
# echo "Press 2 to skip migrations"
# read -p "Enter your choice" choice
# case $choice in 
#     1)
#         echo "Lauching migrations ..."
#         # Commande de lancement des migrations
#         ;;
#     2)  
#         echo "Skipping migrations"
#         ;;
#     *)
#         echo "Invalid choice. Skipping migrations"
#         ;;
# esac


# Lancer le style s'il ne s'actualise pas tout seul