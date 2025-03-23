module MetricsCalculator
# Our only two dependencies for now.
import CSV
import DataFrames

# Objetivo: não queremos aumentar a quantidade de créditos obrigatórios
#   necessários totais em mais do que 10%.
# Objetivo: não queremos aumentar o atraso dos alunos que estão para o
#   final do curso (X% feito).

function read_mixed_classes(csv_path)
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
		CSV.File(csv_path; classes_parse_config...)
	)
	if !all((classes[!, :creditos] .* 15) .== classes[!, :carga_horaria])
		@warn "Some values in 'carga_horaria' are not just 15 times the number in 'creditos'. CHECK. Using values in 'creditos', ignoring 'carga_horaria'."
	end
	# The column 'carga_horaria' is redundant.
	DataFrames.select!(classes, DataFrames.Not(:carga_horaria))
	# TODO: put check about the allowed values in carater here (
	# 'Obrigatória' and what else?).
	old_classes = filter(:cv => ==("velho"), classes)
	DataFrames.select!(old_classes, DataFrames.Not(:cv))
	new_classes = filter(:cv => ==("novo"), classes)
	DataFrames.select!(new_classes, DataFrames.Not(:cv))

	return old_classes, new_classes
end

# OBSOLETE: used before the csv was mixed.
function read_min_cred_opt(csv_path)
	min_cred_opt_column_typedict = Dict{Symbol, Type}(
		[ (:cv, String), (:minimo_eletivo, Int) ]
	)
	min_cred_opt_parse_config = (;
		select = collect(keys(min_cred_opt_column_typedict)),
		types = min_cred_opt_column_typedict,
		delim = ',', stripwhitespace = true,
		strict = true, validate = true)
	min_cred_opt = DataFrames.DataFrame(
		CSV.File(csv_path; min_cred_opt_parse_config...)
	)
	return min_cred_opt
end

# OBSOLETE: used before the csv was mixed.
function read_classes(csv_path)
	classes_column_typedict = Dict{Symbol, Type}(
		[
			(:carater, String), (:etapa, Int), (:codigo, String),
			(:nome, String), (:carga_horaria, Int),
			(:creditos, Int)
		]
	)
	classes_parse_config = (;
		select = collect(keys(classes_column_typedict)),
		types = classes_column_typedict,
		delim = ',', stripwhitespace = true,
		strict = true, validate = true)
	classes = DataFrames.DataFrame(
		CSV.File(csv_path; classes_parse_config...)
	)
	if !all((classes[!, :creditos] .* 15) .== classes[!, :carga_horaria])
		@warn "Some values in 'carga_horaria' are not just 15 times the number in 'creditos'. CHECK. Using values in 'creditos', ignoring 'carga_horaria'."
	end
	# The column 'carga_horaria' is redundant.
	DataFrames.select!(classes, DataFrames.Not(:carga_horaria))
	# TODO: put check about the allowed values in carater here (
	# 'Obrigatória' and what else?).

	return classes
end

function normalize_history!(history, allow_extra_info)
	if "situacao" in names(history)
		if !all(==("Aprovado"), history[!, :situacao])
			@warn "Not every row of column 'situacao' has value 'Aprovado', keeping only the ones in which 'situacao' == 'Aprovado'."
			DataFrames.filter!(:situacao => ==("Aprovado"), history)
		end
		# Drops this column in which every row has the same value.
		DataFrames.select!(history, DataFrames.Not(:situacao))
	end
	if !allow_extra_info
		DataFrames.select!(history, :cartao, :codigo)
		DataFrames.unique!(history, [:cartao, :codigo])
	end

	return history
end

function read_history(csv_path; allow_extra_info = false)
	# We do not select the semester that the student was approved by
	# design. In the future, for some codes that alternate what they refer
	# to between semesters, we will do a preprocessing and use new sentinal
	# class codes to refer to the real classes the students had.
	# Obs: validate = false because we let 'situacao' may or may not be
	# included
	history_parse_config = (;
		types = Dict{Symbol, Type}(
			[(:cartao, String), (:codigo, String),
			(:situacao, String)]
		),
		delim = ',', stripwhitespace = true,
		strict = true, validate = false)
	history = DataFrames.DataFrame(
		CSV.File(csv_path; history_parse_config...)
	)
	@assert issubset(["cartao", "codigo"], names(history))
	normalize_history!(history, allow_extra_info)

	return history
end

function class_demand(classes, history)
	# We only take into account the classes that are obligatory
	# and the students that took at least one obligatory class.
	classes = filter(:carater => ==("Obrigatória"), classes)
	history = filter(:codigo => in(classes[!, :codigo]), history)

	# Total of students that were approved in at least one obligatory
	# class.
	qt_students = length(unique(history[!, :cartao]))

	# Computes the number of students approved in each obligatory class
	# to then compute the number that still need to do it.
	demand = DataFrames.combine(
		DataFrames.groupby(history, :codigo),
		:cartao => length => :qt_students_approved
	)
	demand = DataFrames.leftjoin(classes, demand; on = :codigo)
	demand[!, :qt_students_approved] = coalesce.(demand[!, :qt_students_approved], 0)
	demand[!, :qt_students_needing_it] = qt_students .-
		demand[!, :qt_students_approved]
	DataFrames.select!(demand, :etapa, :codigo, :nome, :qt_students_needing_it)
	sort!(demand, [:etapa, :qt_students_needing_it])

	return demand
end

# NOTE: this is just for the mandatory classes for now
function total_credit_demand(classes, demand)
	classes = DataFrames.select(classes, :codigo, :creditos)
	demand = DataFrames.leftjoin(demand, classes; on = :codigo)
	@assert all(!ismissing, demand[!, :creditos])
	tcd = sum(demand[!, :creditos] .* demand[!, :qt_students_needing_it])
	return tcd
end

function keep_only_required(classes, history)
	classes = filter(:carater => ==("Obrigatória"), classes)
	history = filter(:codigo => in(classes[!, :codigo]), history)

	return classes, history
end

function unconverted_required_classes(
	old_classes, old_history, new_history_with_rules;
	discard_arbitrary_redundant_rules = false
)
	old_classes, old_history = keep_only_required(old_classes, old_history)
	#println(old_history)
	new_history_with_rules = deepcopy(new_history_with_rules)
	#println(new_history_with_rules)
	if discard_arbitrary_redundant_rules
		new_history_with_rules = unique(
			new_history_with_rules, [:cartao, :codigo]
		)
	end
	# Creates a dataframe in which each student is a row and all_rows
	# has the concatenation of all the rows.
	gdf = DataFrames.combine(
		DataFrames.groupby(new_history_with_rules, :cartao),
		:rule_name => (s -> join(s, ';')) => :all_rules
	)
	#@show gdf
	# Transforms the dataframe into a dict (using student id as a key).
	cartao2rules = Dict{String, String}(
		gdf[!, :cartao] .=> gdf[!, :all_rules]
	)
	#@show cartao2rules
	# Gets only the old history rows (student id/class id) in which the
	# old class was not employed in any rule for the new student.
	unconverted = filter(
		(row -> !contains(get!(cartao2rules, row.cartao, "PERDIDO"), row.codigo)),
		old_history
	)
	#@show unconverted
	summary = DataFrames.combine(
		DataFrames.groupby(unconverted, :codigo),
		:cartao => length => :qt_students
	)

	enriched_summary = sort!(DataFrames.select!(
		DataFrames.leftjoin(summary, old_classes; on = :codigo),
		:etapa, :codigo, :nome, :creditos, :qt_students
	))


	return enriched_summary
end

# NOTE: as the name says, this is only for obligatory/mandatory classes
function required_credit_losses_per_student(
	old_classes, old_history, new_classes, new_history
)
	# Get only the required classes, and only the id and the credits.
	old_classes, old_history = keep_only_required(old_classes, old_history)
	new_classes, new_history = keep_only_required(new_classes, new_history)
	DataFrames.select!(old_classes, :codigo, :creditos)
	DataFrames.select!(new_classes, :codigo, :creditos)

	# Enrich the history with the amount of credits.
	old_history = DataFrames.leftjoin(
		old_history, old_classes; on = :codigo
	)
	new_history = DataFrames.leftjoin(
		new_history, new_classes; on = :codigo
	)

	#@show old_history
	#@show new_history

	# Group by student, sum the credits, discard the specific classes.
	old_gdf = DataFrames.combine(
		DataFrames.groupby(old_history, :cartao),
		:creditos => sum => :old_credits
	)
	new_gdf = DataFrames.combine(
		DataFrames.groupby(new_history, :cartao),
		:creditos => sum => :new_credits
	)

	# Combine old and new, computing the difference between them
	# for each student.
	diff = DataFrames.outerjoin(old_gdf, new_gdf; on = :cartao)
	DataFrames.transform!(
		diff, [:new_credits, :old_credits] => (-) => :diff_credits
	)
	sort!(diff, [:diff_credits, :old_credits])

	return diff
end

# INTERNAL FUNCTION. Breaks the cells with multiple class codes into a
# vector.
function _break_prereq_cell(s; delim = ";")
	return string.(strip.(split(s, delim)))
end

# The structure we use to represent the prerequisites: a directed graph
# in which a class code gives us the list of the disciplines necessary
# to unlock it (its prerequisites).
const PrereqsGraph = Dict{String, Vector{String}}

# Different from findmax, returns only one value, and it is the element
# of the vector BEFORE applying f.
max_arg(f, xs) = xs[last(findmax(f, xs))]

# Given the pre-requisites graph, consider that the critical_path_size has
# zero for the classes the student has already been approved, and that if
# a not-yet-done class has zero pre-reqs then it will be done at the next
# semester. The remaining classes will recursively check the critical path
# size of their pre-reqs and take one more semester than the largest of them.
function recursive_critical_path(
	prereqs_graph, paths, starting_node
)
	if !haskey(paths, starting_node)
		if isempty(prereqs_graph[starting_node])
			paths[starting_node] = String[starting_node]
		else
			paths[starting_node] = push!(max_arg(length, [
				recursive_critical_path(
					prereqs_graph, paths, prereq
				) for prereq in prereqs_graph[starting_node]
			]), starting_node)
		end
	end

	return deepcopy(paths[starting_node])
end

function critical_path(prereqs_graph, accredited_classes)
	paths = Dict{String, Vector{String}}(
		accredited_classes .=>
		(String[] for _ in 1:length(accredited_classes))
	)
	for class in keys(prereqs_graph)
		if !haskey(paths, class)
			recursive_critical_path(prereqs_graph, paths, class)
		end
	end

	return max_arg(length, collect(values(paths)))
end

function create_prereqs_graph(classes)
	classes = DataFrames.select(classes, :codigo, :prerequisito)
	DataFrames.transform!(
		classes,
		:prerequisito => DataFrames.ByRow(_break_prereq_cell) => :prerequisito
	)
	replace!(e -> (e == ["NA"] ? String[] : e), classes[!, :prerequisito])
	# We do not take into account the minimum number of obligatory
	# credits for this computation.
	filter!.(e -> !contains(e, "OBRIGA"), classes[!, :prerequisito])
	filter!.(e -> !contains(e, "CRED"), classes[!, :prerequisito])
	filter!.(e -> !contains(e, "#cred"), classes[!, :prerequisito])

	g = PrereqsGraph(classes[!, :codigo] .=> classes[!, :prerequisito])

	return g
end

function semesters_remaining_by_student(classes, history)
	g = create_prereqs_graph(classes)
	history = DataFrames.select(history, :cartao, :codigo)
	gdf = DataFrames.groupby(history, :cartao)
	df = DataFrames.combine(gdf,
		:codigo => (accredited_classes -> Ref(critical_path(g, accredited_classes))) => :critical_path
	)
	df[!, :path_size] = length.(df[!, :critical_path])
	df[!, :critical_path] = join.(df[!, :critical_path], Ref(">"))

	return df
end

# TODO: this should probably filter to only take into account the obligatory
# classes (in the future it may consider the amount of minimum credits of
# optional classes).
function semesters_remaining_by_student_comparison(
	old_classes, old_history, new_classes, new_history
)
	old_classes, old_history = keep_only_required(old_classes, old_history)
	new_classes, new_history = keep_only_required(new_classes, new_history)
	old_plan = semesters_remaining_by_student(old_classes, old_history)
	DataFrames.rename!(old_plan, :critical_path => :old_path)
	DataFrames.rename!(old_plan, :path_size => :old_size)
	new_plan = semesters_remaining_by_student(new_classes, new_history)
	DataFrames.rename!(new_plan, :critical_path => :new_path)
	DataFrames.rename!(new_plan, :path_size => :new_size)

	plan_comparison = DataFrames.outerjoin(old_plan, new_plan; on = :cartao)
	DataFrames.transform!(plan_comparison,
		[:new_size, :old_size] => (-) => :diff
	)
	#filter!(:diff_path_size => !=(0), plan_comparison)
	DataFrames.select!(plan_comparison,
		:cartao, :diff, :old_size, :old_path, :new_size, :new_path
	)
	sort!(plan_comparison,
		[
			DataFrames.order(:diff; rev = true), :old_size,
			DataFrames.order(:new_size; rev = true)
		]
	)

	return plan_comparison
end

function both_negatives_student_grouping(
	semesters_remaining_by_student, credit_losses_by_student
)
	unified = DataFrames.outerjoin(
		semesters_remaining_by_student, credit_losses_by_student;
		on = :cartao
	)
	DataFrames.select!(unified,
		:cartao, :diff => :atraso,
		:old_size => :old_path,
		:new_size => :new_path,
		:diff_credits => :diff_cred,
		:old_credits => :old_cred,
		:new_credits => :new_cred,
	)

	sort!(unified, [
		DataFrames.order(:atraso; rev = true),
		:old_path, DataFrames.order(:new_path; rev = true), :diff_cred,
		DataFrames.order(:old_cred; rev = true),
		DataFrames.order(:new_cred; rev = true),
	])

	return unified
end

function summarise(
	old_classes, new_classes, old_class_demand, new_class_demand,
	old_opt_creds_needed_per_student, new_opt_creds_needed_per_student
)
	df = DataFrames.DataFrame(
		name = String[],
		value = Number[],
	)

	old_obl_total = total_credit_demand(old_classes, old_class_demand)
	new_obl_total = total_credit_demand(new_classes, new_class_demand)
	obl_ratio = new_obl_total/old_obl_total

	push!(df, ("old_obligatory_credit_demand", old_obl_total))
	push!(df, ("new_obligatory_credit_demand", new_obl_total))
	push!(df, ("new_to_old_obligatory_demand_ratio", obl_ratio))

	old_opt_total = sum(old_opt_creds_needed_per_student[!, :creditos])
	new_opt_total = sum(new_opt_creds_needed_per_student[!, :creditos])
	opt_ratio = new_opt_total/old_opt_total

	push!(df, ("old_optional_credit_demand", old_opt_total))
	push!(df, ("new_optional_credit_demand", new_opt_total))
	push!(df, ("new_to_old_optional_demand_ratio", opt_ratio))

	old_total = old_obl_total + old_opt_total
	new_total = new_obl_total + new_opt_total
	ratio = new_total/old_total

	push!(df, ("old_total_credit_demand", old_total))
	push!(df, ("new_total_credit_demand", new_total))
	push!(df, ("new_to_old_demand_ratio", ratio))

	return df
end

function opt_creds_needed_per_student(classes, history, min_cred_opt)
	opt_classes = filter(:carater => ==("Eletiva"), classes)
	opt_history = DataFrames.innerjoin(opt_classes, history; on = :codigo)
	opt_creds = DataFrames.combine(
		DataFrames.groupby(opt_history, :cartao),
		:creditos => sum => :creditos
	)
	DataFrames.select!(opt_creds, :cartao, :creditos)
	# puts back the students without any optional classes done
	all_students = unique!(DataFrames.select(history, :cartao))
	#@show all_students
	#@show opt_creds
	opt_creds = DataFrames.leftjoin(all_students, opt_creds; on = :cartao)
	opt_creds[!, :creditos] = coalesce.(opt_creds[!, :creditos], Ref(0))
	DataFrames.transform!(
		opt_creds,
		:creditos => DataFrames.ByRow(done -> max(0, min_cred_opt - done)) => :creditos
	)
	sort!(opt_creds, [:creditos, :cartao])

	return opt_creds
end

function diff_opt_creds_needed_per_student(old_opt_cred, new_opt_cred)
	old_opt_cred = DataFrames.rename(old_opt_cred, :creditos => :old_opt_cred)
	new_opt_cred = DataFrames.rename(new_opt_cred, :creditos => :new_opt_cred)
	jdf = DataFrames.innerjoin(old_opt_cred, new_opt_cred; on = :cartao)
	jdf[!, :diff] = jdf[!, :new_opt_cred] .- jdf[!, :old_opt_cred]
	sort!(jdf, [:diff, :new_opt_cred, :old_opt_cred, :cartao])

	return jdf
end

function calculate_all_metrics(
	output_dir,
	suffix, old_classes, old_history, new_classes, new_history,
	new_history_with_rules,
	min_cred_opt = DataFrames.DataFrame(; cv = ["novo", "velho"], minimo_eletivo = [24, 24])
)
	old_class_demand = class_demand(old_classes, old_history)
	#@show total_credit_demand(old_classes, old_class_demand)
	#@show old_class_demand

	if(!isdir(output_dir))
		mkdir(output_dir)
	end
	
	CSV.write(joinpath(output_dir, "old_class_demand.csv"), old_class_demand)

	new_class_demand = class_demand(new_classes, new_history)
	#@show total_credit_demand(new_classes, new_class_demand)
	#@show new_class_demand
	CSV.write(joinpath(output_dir, "new_class_demand_from_$suffix.csv"), new_class_demand)

	unconverted_required_classes_redundant = unconverted_required_classes(
		old_classes, old_history, new_history_with_rules
	)
	#@show unconverted_required_classes_redundant
	CSV.write(
		joinpath(output_dir, "unconverted_required_classes_redundant_from_$suffix.csv"),
		unconverted_required_classes_redundant
	)

	unconverted_required_classes_no_redundancy = unconverted_required_classes(
		old_classes, old_history, new_history_with_rules;
		discard_arbitrary_redundant_rules = true
	)
	#@show unconverted_required_classes_no_redundancy
	CSV.write(
		joinpath(output_dir, "unconverted_required_classes_no_redundancy_from_$suffix.csv"),
		unconverted_required_classes_no_redundancy
	)

	required_credit_losses_per_student_df = required_credit_losses_per_student(
		old_classes, old_history, new_classes, new_history
	)
	#@show required_credit_losses_per_student_df
	CSV.write(
		joinpath(output_dir, "required_credit_losses_per_student_from_$suffix.csv"),
		required_credit_losses_per_student_df
	)

	semesters_remaining = semesters_remaining_by_student_comparison(
		old_classes, old_history, new_classes, new_history
	)
	#@show semesters_remaining
	CSV.write(
		joinpath(output_dir, "semesters_remaining_by_student_comparison_from_$suffix.csv"),
		semesters_remaining
	)

	both_negatives = both_negatives_student_grouping(
		semesters_remaining, required_credit_losses_per_student_df
	)
	#@show both_negatives
	CSV.write(
		joinpath(output_dir, "both_negatives_from_$suffix.csv"),
		both_negatives
	)

	old_min_cred_opt = only(filter(:cv => ==("velho"), min_cred_opt)[!, :minimo_eletivo])
	new_min_cred_opt = only(filter(:cv => ==("novo"), min_cred_opt)[!, :minimo_eletivo])
	old_opt_creds_needed_per_student =
		opt_creds_needed_per_student(old_classes, old_history, old_min_cred_opt)
	#CSV.write(
	#	"old_opt_creds_needed_per_student.csv",
	#	old_opt_creds_needed_per_student
	#)
	new_opt_creds_needed_per_student =
		opt_creds_needed_per_student(new_classes, new_history, new_min_cred_opt)
	#CSV.write(
	#	"new_opt_creds_needed_per_student_from_$suffix.csv",
	#	new_opt_creds_needed_per_student
	#)
	diff_opt = diff_opt_creds_needed_per_student(
		old_opt_creds_needed_per_student,
		new_opt_creds_needed_per_student
	)
	CSV.write(
		joinpath(output_dir, "diff_opt_creds_needed_per_student_from_$suffix.csv"),
		diff_opt
	)

	summarised_metrics = summarise(
		old_classes, new_classes, old_class_demand, new_class_demand,
		old_opt_creds_needed_per_student, new_opt_creds_needed_per_student
	)
	#@show summarised_metrics
	CSV.write(
		joinpath(output_dir, "summarised_metrics_from_$suffix.csv"),
		summarised_metrics
	)
end

# Obsolete, and not supported anymore.
#function main(ARGS = ARGS)
#	#@show ARGS
#	if length(ARGS) != 3 && length(ARGS) != 4
#		println("Usage: julia $(basename(@__FILE__)) new_and_old_classes_information.csv old_history.csv new_history.csv")
#		println("Usage: julia $(basename(@__FILE__)) old_classes_info.csv old_history.csv new_classes_info.csv new_history.csv")
#		println("IMPORTANT: if executed as ./$(basename(@__FILE__)) the path to the julia file and to each of the arguments must not have spaces.")
#		exit()
#	end
#
#	if length(ARGS) == 4
#		path_to_old_classes = ARGS[1]
#		path_to_old_history = ARGS[2]
#		path_to_new_classes = ARGS[3]
#		path_to_new_history = ARGS[4]
#		new_suffix = first(splitext(basename(path_to_new_history)))
#
#		old_classes = read_classes(path_to_old_classes)
#		new_classes = read_classes(path_to_new_classes)
#	elseif length(ARGS) == 3
#		path_to_classes = ARGS[1]
#		path_to_old_history = ARGS[2]
#		path_to_new_history = ARGS[3]
#		new_suffix = first(splitext(basename(path_to_new_history)))
#
#		old_classes, new_classes = read_mixed_classes(path_to_classes)
#	else
#		error("invalid amount of parameters: $(length(ARGS))")
#	end
#	old_history = read_history(path_to_old_history)
#	new_history = read_history(path_to_new_history)
#	new_history_with_rules = read_history(
#		path_to_new_history; allow_extra_info = true
#	)
#
#	calculate_all_metrics(
#		new_suffix, old_classes, old_history, new_classes, new_history,
#		new_history_with_rules
#	)
#
#	return
#end
end # module

