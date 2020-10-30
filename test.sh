#!/usr/bin/env bash

echo "Hello there, $1"
echo "My name is $(whoami)"
echo "Nice to meet you, $1"

cd ../..
cd work
cd habanero
ls

yarn storybook
