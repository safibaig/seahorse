#!/bin/bash

# Copyright (c) 2015, CodiLime Inc.
#
# Usage: ./publish.sh SEAHORSE_BUILD_TAG

SEAHORSE_BUILD_TAG=$1
echo "SEAHORSE_BUILD_TAG='$SEAHORSE_BUILD_TAG'"
REPOSITORY="seahorse-distribution"

BOX_NAME="seahorse-vm.box"

#Publishes file (first parameter) with given version (second parameter)
function publish() {
  artifactLocalName=$1
  artifactVersion=$2
  url=$3

  echo "** INFO: Uploading $artifactLocalName to $url **"
  md5Value="`md5sum "${artifactLocalName}"`"
  md5Value="${md5Value:0:32}"
  sha1Value="`sha1sum "${artifactLocalName}"`"
  sha1Value="${sha1Value:0:40}"

  curl -i -X PUT -u $ARTIFACTORY_USER:$ARTIFACTORY_PASSWORD \
   -H "X-Checksum-Md5: $md5Value" \
   -H "X-Checksum-Sha1: $sha1Value" \
   -T "${artifactLocalName}" \
   "$url"
}

function publishVersion() {
  artifactLocalName=$1
  artifactVersion=$2

  url="$ARTIFACTORY_URL/$REPOSITORY/io/deepsense/${artifactVersion}/vagrant/${artifactLocalName}"

  publish $artifactLocalName $artifactVersion $url
}

publishVersion "${BOX_NAME}" "${SEAHORSE_BUILD_TAG}"

URL="$ARTIFACTORY_URL/$REPOSITORY/io/deepsense/${SEAHORSE_BUILD_TAG}/vagrant/${BOX_NAME}"
sed "s#seahorsevm.vm.box_url = \"\"#seahorsevm.vm.box_url = \"${URL}\"#" Vagrantfile.template > Vagrantfile

publishVersion "Vagrantfile" "${SEAHORSE_BUILD_TAG}"
