#!/usr/bin/bash
#=
	exec bash -c 'LD_LIBRARY_PATH="" julia -O2 "$@"' Julia "${BASH_SOURCE[0]}" "$@"
	quit
=#

# TODO:
# * For the summarised metrics, have the obligatory increase and the total
#   increase.
# * From where the code will get the demand for optional ones in the old and
#   in the new curriculum? (maybe two positional arguments with defaults?)
# * When accounting for the optional, there is only unnamed demand.
# * Check if things work correctly with the optional ones:
#   + The old code for Teoria dos Grafos and the two other mandatory classes
#     that are often lost (unconverted) give the new code for their optional
#     version in the new curriculum.
#   + Every old optional class (that is not used in the rules as a 1-to-1 for
#     a new mandatory class) gets a new optional code in the new curriculum.

import Pkg
Pkg.activate(joinpath(@__DIR__, ".."))
Pkg.instantiate() # IMPORTANT: if packages are not installed uncomment this

import ClassHistoryConverter
import CSV

using DataFrames

const Migrate = ClassHistoryConverter.Migrate
const MetricsCalculator = ClassHistoryConverter.MetricsCalculator

function regras_com_disciplina_inexistente(rules, old_classes, new_classes)
	df = filter(
		(row ->
			any(
				!in(old_classes.codigo),
				strip.(split(row.fez, "; "))
			) || row.obtem ∉ new_classes.codigo
		)
		, rules
	)
	if !isempty(df)
		@warn "REGRAS QUE REFENCIAM CÓDIGOS INEXISTENTES:"
		@warn repr(df)
	end

	return nothing
end

function regras_trocando_carater(rules, old_classes, new_classes)
	df = filter(
		(row ->
			unique!(filter(:codigo => in(strip.(split(row.fez, "; "))), old_classes)[!, :carater]) != filter(:codigo => ==(row.obtem), new_classes)[!, :carater]
		)
		, rules
	)
	if !isempty(df)
		@warn "REGRAS QUE MUDAM O CARATER DE DISCIPLINAS:"
		@warn repr(df)
	end

	return nothing
end

# O problema é que PROJINT é a única disciplina do novo que precisa de duas
# disciplinas do antigo para liberar, e ela não tem uma regra só, ela tem
# 4 pares possíveis de duas disciplinas que liberam (todos pares tem
# empreendimentos em informática, pelo menos). As 4 disciplinas que não
# são empreendimentos e estão nas regras são eletivas, e no momento estão
# dando duplo crédito: INF01006, INF01019, INF01022, INF01215 (pois uma
# arbitrária que o aluno fez vai ser usada tanto para liberar ProjInt quanto
# para ganhar créditos eletivos). O que essa função faz é passar pelo
# histórico novo e, caso o aluno tenha ganho ProjInt somente por meio de
# alguma dessas 4 regras (não por temporalidade) então uma disciplina eletiva
# que poderia ter sido usada tem de ter a eletiva correspondente no novo
# removida.
# NOTE: descoberto que não existe aluno nessa situação, todo aluno que
# qualificaria para ganhar pela junção das duas disciplinas já ganharia
# por Temp-7
function fix_projint_double_credit!(new_history)
	# A implementação é terrivelmente ineficiente.
	related = ["INF01006", "INF01019", "INF01022", "INF01215", "ProjInt"]
	changed = 0
	for cartao in unique(new_history[!, :cartao])
		sdf = filter(:cartao => ==(cartao), new_history)
		#filter!(:rule_name => (x -> any(contains(x), related)), sdf)
		# Se ProjInt foi obtida por temporalidade, então não há duplo
		# crédito.
		if any((x -> !isnothing(match(r"TEMP-[0-9]=ProjInt"i, x))), sdf[!, :rule_name])
			continue
		end
		if "INF01032+INF01022=ProjInt" in sdf[!, :rule_name]
			filter!(
				!(row -> row.cartao == cartao &&
					(row.rule_name == "INF01032=EmpreendimentoEletiva"
					|| row.rule_name == "INF01022=LdSdS")),
			new_history)

			changed += 1
			continue
		end
		if "INF01032+INF01019=ProjInt" in sdf[!, :rule_name]
			filter!(
				!(row -> row.cartao == cartao &&
					(row.rule_name == "INF01032=EmpreendimentoEletiva"
					|| row.rule_name == "INF01019=PeCG")),
			new_history)

			changed += 1
			continue
		end
		if "INF01032+INF01006=ProjInt" in sdf[!, :rule_name]
			filter!(
				!(row -> row.cartao == cartao &&
					(row.rule_name == "INF01032=EmpreendimentoEletiva"
					|| row.rule_name == "INF01006=PdBdD")),
			new_history)

			changed += 1
			continue
		end
		if "INF01032+INF01215=ProjInt" in sdf[!, :rule_name]
			filter!(
				!(row -> row.cartao == cartao &&
					(row.rule_name == "INF01032=EmpreendimentoEletiva"
					|| row.rule_name == "INF01215=MtdA")),
			new_history)

			changed += 1
			continue
		end
	end

	@show changed
	return
end

function students_with_projint_double_credit(new_history)
	qt_temp_and_another = 0
	qt_another = 0
	qt_temp = 0
	for cartao in unique(new_history[!, :cartao])
		sdf = filter(:cartao => ==(cartao), new_history)
		temp = another = false
		if any(in(sdf[!, :rule_name]), ["INF01032+INF01022=ProjInt", "INF01032+INF01019=ProjInt", "INF01032+INF01006=ProjInt", "INF01032+INF01215=ProjInt"])
			qt_another += 1
			another = true
		end
		if "Temp-7=ProjInt" in sdf[!, :rule_name]
			qt_temp += 1
			temp = true
		end
		if another && temp
			qt_temp_and_another += 1
		end
	end
	println("STUDENTS OBTAINING PROJINT BY TEMP AND ANOTHER RULE: $qt_temp_and_another")
	println("STUDENTS OBTAINING PROJINT BY TEMP: $qt_temp")
	println("STUDENTS OBTAINING PROJINT BY ANOTHER RULE: $qt_another")
end

function count_temps(old_history)
	@show length(unique(old_history[!, :cartao]))
	@show count(==("Temp-4"), old_history[!, :codigo])
	@show count(==("Temp-5"), old_history[!, :codigo])
	@show count(==("Temp-6"), old_history[!, :codigo])
	@show count(==("Temp-7"), old_history[!, :codigo])
end

function main(ARGS = ARGS)

	if !(length(ARGS) ∈ (2, 6, 7))
		println("Usage: julia $(basename(@__FILE__)) classes.csv flexible_rules.csv orthodox_rules.csv history.csv [minimo_eletivo.csv]")
		println("IMPORTANT: if executed as ./$(basename(@__FILE__)) the path to the script and each of its arguments must not have spaces.")
		exit()
	end

	OUTPUT_DIR = ARGS[1]
	INPUT_DIR = ARGS[2]

	HISTORY_CSV        = joinpath(OUTPUT_DIR, "historico.csv")



	CLASSES_CSV        = joinpath(@__DIR__, "INF_UFRGS_DATA", INPUT_DIR, "disciplinas.csv")
	FLEXIBLE_RULES_CSV = joinpath(@__DIR__, "INF_UFRGS_DATA", INPUT_DIR, "cenario_flexivel.csv")
	ORTHODOX_RULES_CSV = joinpath(@__DIR__, "INF_UFRGS_DATA", INPUT_DIR, "cenario_ortodoxo.csv")
	MIN_CRED_OPT_CSV   = joinpath(@__DIR__, "INF_UFRGS_DATA", INPUT_DIR, "minimo_eletivo.csv")

	if length(ARGS) >= 6
		CLASSES_CSV = ARGS[3]
		FLEXIBLE_RULES_CSV = ARGS[4]
		ORTHODOX_RULES_CSV = ARGS[5]
		HISTORY_CSV = ARGS[6]
	end
	if length(ARGS) >= 7
		MIN_CRED_OPT_CSV = ARGS[7]
	end


	
	old_classes, new_classes = MetricsCalculator.read_mixed_classes(
		CLASSES_CSV
	)

	flexible_rules = Migrate.read_rules_csv(FLEXIBLE_RULES_CSV)
	orthodox_rules = Migrate.read_rules_csv(ORTHODOX_RULES_CSV)
	old_history    = Migrate.read_history_csv(HISTORY_CSV)

	count_temps(old_history)

	regras_com_disciplina_inexistente(
		flexible_rules, old_classes, new_classes
	)
	regras_com_disciplina_inexistente(
		orthodox_rules, old_classes, new_classes
	)
	regras_trocando_carater(
		flexible_rules, old_classes, new_classes
	)
	regras_trocando_carater(
		orthodox_rules, old_classes, new_classes
	)

	new_flexible_history = Migrate.migrate(
		old_classes, flexible_rules, old_history
	)
	students_with_projint_double_credit(new_flexible_history)
	#fix_projint_double_credit!(new_flexible_history)
	new_orthodox_history = Migrate.migrate(
		old_classes, orthodox_rules, old_history
	)
	students_with_projint_double_credit(new_orthodox_history)
	#fix_projint_double_credit!(new_orthodox_history)



	if(!isdir(OUTPUT_DIR))
		mkdir(OUTPUT_DIR)
	end


	flexible_suffix = "novo_historico_flexivel"
	orthodox_suffix = "novo_historico_ortodoxo"


	CSV.write(joinpath(OUTPUT_DIR, "$flexible_suffix.csv"), new_flexible_history)
	CSV.write(joinpath(OUTPUT_DIR, "$orthodox_suffix.csv"), new_orthodox_history)

	normalized_old_history = MetricsCalculator.normalize_history!(
		deepcopy(old_history), false
	)
	new_flexible_history_with_rules = MetricsCalculator.normalize_history!(
		deepcopy(new_flexible_history), true
	)
	new_orthodox_history_with_rules = MetricsCalculator.normalize_history!(
		deepcopy(new_orthodox_history), true
	)
	new_flexible_history_no_rules = MetricsCalculator.normalize_history!(
		deepcopy(new_flexible_history), false
	)
	new_orthodox_history_no_rules = MetricsCalculator.normalize_history!(
		deepcopy(new_orthodox_history), false
	)

	min_cred_opt = MetricsCalculator.read_min_cred_opt(MIN_CRED_OPT_CSV)
	MetricsCalculator.calculate_all_metrics(
		OUTPUT_DIR,
		flexible_suffix, old_classes, normalized_old_history,
		new_classes, new_flexible_history_no_rules,
		new_flexible_history_with_rules, min_cred_opt
	)
	MetricsCalculator.calculate_all_metrics(
		OUTPUT_DIR,
		orthodox_suffix, old_classes, normalized_old_history,
		new_classes, new_orthodox_history_no_rules,
		new_orthodox_history_with_rules, min_cred_opt
	)
end

main()

