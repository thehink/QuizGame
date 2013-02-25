echo "" > client/client.build.js
echo "" > server.build.js

cd .\client_js\
copy /b ^
.\lib\*.js + ^
client.js + ^
client.*.js + ^
init.js ^
.\..\client\client.build.js


cd ..\server\
copy /b ^
server.js + ^
server.*.js + ^
init.js ^
.\..\server.build.js