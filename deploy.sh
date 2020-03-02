#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then 
    echo "Triggers build for PR:  ${TRAVIS_PULL_REQUEST_SLUG}";
    echo "UPSTREAM REPO: ${TRAVIS_REPO_SLUG} PR: ${TRAVIS_PULL_REQUEST}";
    echo "PR AGAINST ${TRAVIS_BRANCH}";
    repo_owner="$(cut -d'/' -f1 <<<"$TRAVIS_PULL_REQUEST_SLUG")"

    if ! [ -z "$GITLAB_PIPELINE_TRIGGER_TOKEN" ]; then
        ./scripts/build-and-deploy.sh -p ${TRAVIS_PULL_REQUEST} -d ${repo_owner};
    fi
fi


if [ "$TRAVIS_PULL_REQUEST" = "false" ];
    then echo "NOT PULL_REQUEST - > inside script"; 
fi