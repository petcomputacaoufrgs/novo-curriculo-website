module Migrate
# Our only two dependencies for now.
import CSV
import DataFrames

function mentioned_cred_numbers(explode_rules)
	cred_strs = filter(
		contains("CRED"),
		reduce(vcat, explode_rules[!, :liberadoras])
	)
	#@warn cred_strs
	creds = unique!(parse.(Ref(Int), chopprefix.(cred_strs, Ref("CRED"))))
	#@warn creds
	return creds
end

function get_students_over_thresholds(classes_info, old_history, creds)
	# classes_info
	# cv,carater,etapa,codigo,nome,carga_horaria,creditos,prerequisito
	# novo,Obrigatória,1,PC,Pensamento Computacional,60,4,NA
	# old_history
	# cartao,ingresso,codigo,titulo,situacao
	# 27676,1986/1,ARQ318,DESENHO TÉCNICO I-A,Aprovado
	old_obligatory_classes = filter(
		:carater => ==("Obrigatória"), classes_info
	)
	#@show names(old_history)
	#@show names(old_obligatory_classes)
	clean_history = DataFrames.innerjoin(
		DataFrames.select(old_history, :cartao, :liberadoras => :codigo),
		DataFrames.select(old_obligatory_classes, :codigo, :creditos);
		on = :codigo
	)
	student_creds = DataFrames.combine(DataFrames.groupby(
		clean_history, :cartao
	), :creditos => sum => :creditos)

	list = Tuple{String, Int}[]
	for threshold in creds
		for student in eachrow(student_creds)
			if student.creditos >= threshold
				push!(list, (student.cartao, threshold))
			end
		end
	end

	return list
end

function inject_cred_pseudo_classes!(old_history, student_and_cred_list)
	# old_history
	# cartao,ingresso,codigo,titulo,situacao
	# 27676,1986/1,ARQ318,DESENHO TÉCNICO I-A,Aprovado
	for (student, cred) in student_and_cred_list
		row = (;
			cartao      = student,
			ingresso    = "",
			liberadoras = "CRED$(cred)",
			titulo      = "ESTUDANTE COMPLETOU $cred CRÉDITOS DA CARGA OBRIGATÓRIA",
			situacao    = "Aprovado"
		)
		push!(old_history, row)
	end

	return old_history
end

# Gets the exploded rules and the old history and returns the new history.
function apply_rules(exploded_rules, old_history)
	# First, join both tables by the liberadoras. In old_history the
	# liberadoras are the classes in which the students were already approved.
	# In the new_history, the liberadoras are the old class codes that may
	# give the students approval in the new class codes.
	new_history = DataFrames.innerjoin(
		exploded_rules, old_history; on = :liberadoras
	)
	# Group by cartao (student id) and rule_name (identifier of the
	# class code equivalence rule).
	gdf = DataFrames.groupby(new_history, [:cartao, :rule_name])
	# Keeps only the student/rule pairs in which the student has been approved
	# in all the old class codes needed by the rule (i.e., the number of joined
	# rows is the same as the size of the rule).
	new_history = DataFrames.subset!(gdf,
		:rule_size => (g -> length(g) == only(unique(g)))
	)
	# Keep only the insteresting columns.
	DataFrames.select!(new_history, :cartao, :liberaveis, :rule_name)
	# Cleans the repeated rows (or not).
	DataFrames.unique!(new_history)
	# Line above: if a new class is given by more than one rule, all are shown.
	# Line below: if a new class is given by more than one rule, one is shown.
	# DataFrames.unique!(new_history, [:cartao, :liberaveis])

	# Sort first by student, so all the new class codes from the same student
	# are kept together.
	DataFrames.sort!(new_history, [:cartao, :liberaveis])
	DataFrames.rename!(new_history, :liberaveis => :codigo)

	return new_history
end

# INTERNAL FUNCTION. Breaks the cells with multiple old class codes into a
# vector.
function _break_fez_cell(s; delim = ";")
	return strip.(split(s, delim))
end

# Given the rule table (only "fez" and "obtem") creates a new table in which
# each class code in "fez" (delimited by ';') is its own line, that has also
# has: the "obtem" column, the name of the rule from which it has come from,
# and the number of old classes of the rule (how many old classes the student
# has to have been approved on for they to get the new class). The new name
# of the "fez" column (with only a single class per row) is "liberadoras".
# The new name of column "obtem" is "liberaveis".
function explode_rules(rules)
	rules = deepcopy(rules)
	# Breaks the "fez" cells into vectors instead of ';' delimited strings.
	DataFrames.transform!(rules, :fez => DataFrames.ByRow(_break_fez_cell) => :liberadoras)
	# Create the rule name using the format OLD0001+OLD0002=NEW0003.
	rules[!, :rule_name] = join.(rules[!, :liberadoras], Ref("+")) .*
		Ref("=") .* string.(rules[!, :obtem])
	# Only keep relevant columns, rename obtem to liberaveis.
	DataFrames.select!(rules, :rule_name, :liberadoras, :obtem => :liberaveis)
	# Computes the rule size (number of classes in which the student needs to
	# have been approved to satisfy the specific rule).
	rules[!, :rule_size] = length.(rules[!, :liberadoras])
	# Goes from having a cell with a vector to having multiple rows.
	rules = DataFrames.flatten(rules, :liberadoras)

	rules
end

function read_classes_csv(filepath)
	classes_column_typedict = Dict{Symbol, Type}(
		[
			(:cv, String), (:carater, String), (:etapa, Int),
			(:codigo, String), (:nome, String),
			(:carga_horaria, Int), (:creditos, Int),
			(:prerequisito, String)
		]
	)
	classes_parse_config = (;
		select = collect(keys(classes_column_typedict)),
		types = classes_column_typedict,
		delim = ',', stripwhitespace = true,
		strict = true, validate = true)
	classes = DataFrames.DataFrame(
		CSV.File(filepath; classes_parse_config...)
	)
	if !all((classes[!, :creditos] .* 15) .== classes[!, :carga_horaria])
		@warn "Some values in 'carga_horaria' are not just 15 times the number in 'creditos'. CHECK. Using values in 'creditos', ignoring 'carga_horaria'."
	end
	# The column 'carga_horaria' is redundant.
	DataFrames.select!(classes, DataFrames.Not(:carga_horaria))

	return classes
end

function read_rules_csv(filepath)
	rules_parse_config = (; types = [String, String],
		delim = ',', stripwhitespace = true, strict = true,
		validate = true
	)

	rules = DataFrames.DataFrame(CSV.File(filepath; rules_parse_config...))
	@assert sort(names(rules)) == sort(["fez", "obtem"])
	#@show rules
	return rules
end

function read_history_csv(filepath)
	history_parse_config = (;
		types = Dict{Symbol, Type}(
			[(:cartao, String), (:codigo, String),
			(:situacao, String)]
		),
		delim = ',', stripwhitespace = true,
		strict = true, validate = false)
	history = DataFrames.DataFrame(
		CSV.File(filepath; history_parse_config...)
	)
	#@assert sort(names(history)) == sort(["cartao", "fez"])
	#@show names(history)
	@assert issubset(["cartao", "codigo"], names(history))
	if "situacao" in names(history)
		filter!(:situacao => contains("Aprovado"), history)
	end
	#@show history
	return history
end

# Takes the input already parsed to dataframes.
function migrate(classes, rules, history)
	classes = deepcopy(classes)
	rules = deepcopy(rules)
	history = deepcopy(history)

	DataFrames.rename!(history, :codigo => :liberadoras)
	exploded_rules = explode_rules(rules)

	# The three calls below are everything that is needed to deal
	# with the CRED* pseudo-classes.
	cred_thresholds = mentioned_cred_numbers(exploded_rules)
	students_and_creds_list = get_students_over_thresholds(
		classes, history, cred_thresholds
	)
	history = inject_cred_pseudo_classes!(history, students_and_creds_list)


	new_history = apply_rules(exploded_rules, history)

	return new_history
end

function main(ARGS = ARGS)
	#@show ARGS
	if length(ARGS) != 3
		println("Usage: julia $(basename(@__FILE__)) classes.csv rules.csv history.csv")
		println("IMPORTANT: if executed as ./$(basename(@__FILE__)) the path to it and the two arguments must not have spaces.")
		exit()
	end

	classes_csv = ARGS[1]
	rules_csv = ARGS[2]
	history_csv = ARGS[3]

	classes = read_classes_csv(classes_csv)
	rules = read_rules_csv(rules_csv)
	history = read_history_csv(history_csv)

	new_history = migrate(classes, rules, history)

	CSV.write(stdout, new_history)

	return
end
end # module

