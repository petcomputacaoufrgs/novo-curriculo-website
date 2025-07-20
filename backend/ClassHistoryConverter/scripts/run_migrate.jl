#!/usr/bin/bash
#=
	exec bash -c 'LD_LIBRARY_PATH="" julia -O0 --compile=min "$@"' Julia "${BASH_SOURCE[0]}" "$@"
	quit
=#
# The above is necessary to run without calling "julia" before the filename.

# The outline (pre-requisites, not implementation details):
# * Takes three parameters: csv with classes info (to know which ones are
#   obligatory and inject the CRED* pseudo-classes), csv with the conversion
#   rules (to apply to the history) and another with the history of all
#   the students.
# * Check the rules for mentions to CRED* in the required old classes, if
#   those exist, for each different number (e.g., 152) we need to add such
#   class in the history for every student that has that number of obligatory
#   credits done (or above).
# * For each student, check each rule, adds the equivalent class if it exists.
# * Each rule has two parts "fez" (old finished) and "obtem" (new given).
# * The "fez" part can have one or more classes, ALL must have been done
#   by the student for them to receive the ones in "obtem".
# * The new classes in "obtem" can appear in multiple lines/rules, but the
#   new history is a set, so does not matter if the student got some
#   class by means of one, two, or more rules. One satisfied rule suffices.

# Implementation details:
# * Probably the best plan is to keep everything in dataframe format.
# * The first table need to be exploded: we need to "name" each rule and
#   create a distinct line for each code in the "fez" field so the "fez"
#   field only have one code and can be joined to other tables.
# * Then comes the "harder" part: is each rule a subset of the student's
#   history? We probably should join by the old class code, and then only
#   consider satisfied the rules for which we have all the exploded
#   clauses joined. If some join is partial, then some of the AND rules
#   is not respected, and, therefore, the student will not get the
#   class.
# * From this combined table we reduce to a small table, the best would
#   be if we can keep the rule names together with the new classes so
#   the student know what rules granted them that class.

# Code for automatically installing required packages.
import Pkg
Pkg.activate(joinpath(@__DIR__, ".."))
#Pkg.instantiate()

import ClassHistoryConverter

ClassHistoryConverter.Migrate.main()

