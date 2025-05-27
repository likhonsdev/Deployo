#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deployo - Python AI Pair-Programmer  ${NC}"
echo -e "${BLUE}  With Code Execution                  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env file exists and has API key
if [ ! -f .env ]; then
  echo -e "${RED}ERROR: .env file is missing. Please create it from .env.example.${NC}"
  exit 1
fi

# Check if API key is set
API_KEY=$(grep VITE_GEMINI_API_KEY .env | cut -d '=' -f2)
if [ -z "$API_KEY" ]; then
  echo -e "${YELLOW}WARNING: No Gemini API key found in .env file.${NC}"
  echo -e "${YELLOW}You need to add your API key to the .env file:${NC}"
  echo -e "VITE_GEMINI_API_KEY=your_api_key_here"
  echo -e "Get a key from: ${BLUE}https://aistudio.google.com/app/apikey${NC}"
  echo ""
  read -p "Do you want to continue without an API key? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo -e "${GREEN}Starting Deployo development server...${NC}"
echo -e "The application will be available at ${BLUE}http://localhost:3000${NC}"
echo -e "Press Ctrl+C to stop the server."
echo ""

# Start the development server
npm run dev
