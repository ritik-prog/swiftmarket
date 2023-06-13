#!/bin/bash

# List of folders containing the React apps
folders=("admin-dashboard" "backend" "frontend" "seller-dashboard" "ticket-master-dashboard")

# Script to run in each terminal
script_to_run="npm run start"

# Function to open a new Terminal window and run the script
open_terminal() {
    local folder=$1
    osascript -e "tell application \"Terminal\" to do script \"cd /Users/ritikmakhija/Desktop/final-year-project/swiftmarket/$folder && $script_to_run\""
}

# Loop through the folders and open a new Terminal window for each
for folder in "${folders[@]}"; do
    open_terminal "$folder"
done
