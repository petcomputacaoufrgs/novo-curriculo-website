#!/usr/bin/bash
#=
	exec bash -c 'LD_LIBRARY_PATH="" julia -O0 --compile=min "$@"' Julia "${BASH_SOURCE[0]}" "$@"
	quit
=#

# Code for automatically installing required packages.
import Pkg
Pkg.activate(@__DIR__)
Pkg.instantiate()

import ClassHistoryConverter

ClassHistoryConverter.MetricsCalculator.main()

