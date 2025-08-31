#!/bin/bash

TRIED_FILE=precompile_statements_file.txt
READY_FILE=ClassHistoryConverter.so

SCRIPT_DIR="`dirname "$(realpath "${BASH_SOURCE[0]}")"`"
TRIED_PATH="${SCRIPT_DIR%%/}/$TRIED_FILE"
READY_PATH="${SCRIPT_DIR%%/}/$READY_FILE"

if [ -f "$READY_PATH" ]; then
	echo "Sysimage found. Using it."
	julia -O1 -J$READY_PATH "${SCRIPT_DIR%%/}/update.jl" "$@"
elif [ -f "$TRIED_PATH" ]; then
	echo "Sysimage not found, but there was an attempt. Will not attempt again."
	julia -O1 "${SCRIPT_DIR%%/}/update.jl" "$@"
else
	echo "Sysimage not found, nor evidence of an attempt. Will try to create a sysimage."
	touch $TRIED_PATH
	julia -O1 --trace-compile=$TRIED_PATH "${SCRIPT_DIR%%/}/update.jl" "$@" ||{
		# Only keep the trace compile file if the run did not error.
		rm $TRIED_PATH
	}

	julia -O1 "${SCRIPT_DIR%%/}/create_sysimage.jl" $TRIED_FILE $READY_FILE
fi

