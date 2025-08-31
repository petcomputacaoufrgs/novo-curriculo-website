#!/usr/bin/bash
#=
	exec bash -c 'LD_LIBRARY_PATH="" julia -O2 "$@"' Julia "${BASH_SOURCE[0]}" "$@"
	quit
=#

import Pkg
Pkg.activate(joinpath(@__DIR__, ".."))
#Pkg.instantiate() # IMPORTANT: if packages are not installed uncomment this

import PackageCompiler

function main(ARGS = ARGS)
	PRECOMPILE_STATEMENTS="precompile_statements_file.txt"
	SYSIMAGE="ClassHistoryConverter.so"
	if length(ARGS) > 0
		PRECOMPILE_STATEMENTS = ARGS[1]
	end
	if length(ARGS) > 1
		SYSIMAGE = ARGS[2]
	end

	PackageCompiler.create_sysimage(
		["ClassHistoryConverter"];
		sysimage_path = joinpath(@__DIR__, SYSIMAGE),
		precompile_statements_file = joinpath(
			@__DIR__, PRECOMPILE_STATEMENTS
		)
	)
end

main()

