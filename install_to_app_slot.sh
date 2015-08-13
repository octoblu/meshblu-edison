#!/bin/bash

cp ./command.js ./main.js && mv ../../node_modules/ ../../hold && mv ./* ../.. && rm -rf ../../hold/ && exit 0
