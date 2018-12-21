
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | xargs)

npm run build
npm pack
echo jok-${PACKAGE_VERSION}.tgz
sudo npm i -g jok-${PACKAGE_VERSION}.tgz
rm -f jok-${PACKAGE_VERSION}.tgz
rm -fr dist/
