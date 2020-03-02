#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then 
    echo "./scripts/helpers/check_commit_subject.sh -r  $TRAVIS_COMMIT_RANGE"
fi