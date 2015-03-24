#!/bin/sh

DIR="$( cd "$( dirname "$0" )" && pwd )"

rsync -avz --delete $DIR/../ deploy@relations.nkb:/srv/extraneous/
