@echo off
set root=..
start cmd /k "cd %root% && code ."
start cmd /k "cd %root% && cd server && npm run dev"
start cmd /k "cd %root% && cd client && npm run dev"