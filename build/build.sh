mkdir -p ./dist/common/
cp ./node_modules/traceur/bin/traceur-runtime.js ../dist/common/traceur-runtime.js
cp ./node_modules/es6-module-loader/dist/es6-module-loader.js ../dist/common/es6-module-loader.js
cp ./node_modules/systemjs/dist/system.js ../dist/common/system.js
traceur --out ./dist/main.js ./src/tatty.js --modules=instantiate
