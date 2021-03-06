nohup npx http-server -p 8090 dist > /dev/null 2>&1 &
serverPID=$!
expo export --dev --public-url http://127.0.0.1:8090
EXPO_ANDROID_KEYSTORE_PASSWORD="azertyuiop" EXPO_ANDROID_KEY_PASSWORD="azertyuiop" turtle build:android --type apk --keystore-path ./keystore.jks --keystore-alias "keyalias" --allow-non-https-public-url --public-url "http://127.0.0.1:8090/android-index.json"
kill $serverPID