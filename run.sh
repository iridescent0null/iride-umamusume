su -
cd ~
cd web/iride-umamusume/
export PATH=$PATH:/root/.nvm/versions/node/v22.14.0/bin:/root/.local/bin:/root/bin:/usr/local/sbin
echo $PATH
ps x | grep "npm run dev" | grep -v "grep" | awk '{system("kill "$1"")}'  
nohup npm run dev >/dev/null 2>&1 &
echo done