#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deployo - Python AI Pair-Programmer  ${NC}"
echo -e "${BLUE}  Setup Script                         ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js v18+ before continuing.${NC}"
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}Node.js version v$NODE_VERSION is not supported. Please upgrade to Node.js v18 or later.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js v$(node -v) is installed${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo -e "${RED}npm is not installed. Please install npm before continuing.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ npm v$(npm -v) is installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file...${NC}"
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file${NC}"
  echo -e "${YELLOW}! Please edit the .env file and add your Gemini API key${NC}"
else
  echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
  echo -e "${RED}Failed to install dependencies. Please try again.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup completed successfully!  ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "To start the development server:"
echo -e "  ${BLUE}npm run dev${NC}"
echo ""
echo -e "Then open your browser and navigate to:"
echo -e "  ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Remember to add your Gemini API key to the .env file.${NC}"
echo -e "You can get one from: ${BLUE}https://aistudio.google.com/app/apikey${NC}"
echo ""
