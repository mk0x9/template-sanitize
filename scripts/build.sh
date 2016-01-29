#!/usr/bin/env bash

JAVA=$(which java)
GOOGLE_CLOSURE_DIR=../node_modules/google-closure-compiler
CLOSURE_COMPILER=$GOOGLE_CLOSURE_DIR/compiler.jar
CLOSURE_OPTS="--compilation_level=ADVANCED --create_source_map=kek.js.map --js_output_file=../build.js --language_in=ECMASCRIPT6_STRICT --language_out=ES5 --warning_level=VERBOSE" # --formatting=PRETTY_PRINT"

if [ ! -e "$CLOSURE_COMPILER" ]; then
    echo "Can't find google closure compiler, perhaps you forgot npm install."
    exit 1
fi

if [ ! -x "$JAVA" ]; then
    echo "Can't find Java."
    exit 1
fi

SOURCE_FILES="../src/*.js"

for file in $SOURCE_FILES
do
    CLOSURE_OPTS="$CLOSURE_OPTS --js=$file"
done

$JAVA -jar $CLOSURE_COMPILER $CLOSURE_OPTS
