#!/bin/bash

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

to_bc() {
	local input

	if [ $# -ge 1 ]; then
	  input="$1"
	else
	  input=$(cat)
	fi

	echo "$input" | sed -e "s/0x//" | tr '[:lower:]' '[:upper:]'
}

trim_bc() {
	local input

	if [ $# -ge 1 ]; then
	  input="$1"
	else
	  input=$(cat)
	fi

	echo "$input" | tr -d " \n\\\\"
}

from_bc() {
	local input

	if [ $# -ge 1 ]; then
	  input="$1"
	else
	  input=$(cat)
	fi

	if [[ "$input" == "-"* ]]; then
		echo "$input" | sed -e "s/-/-0x/" 
	else
		echo "0x$input"
	fi | tr -d " \n\\\\" | tr '[:upper:]' '[:lower:]'
}

errors=0
warns=0
for directory in $(ls -d */); do
	curves="${directory}curves.json"
	if [ ! -e "$curves" ]; then
		continue
	fi
	total=$(cat "$curves" | jq ".curves | length")
	num=$(echo $total - 1 | bc)
	for i in $(seq 0 $num); do
		curve=$(cat "$curves" | jq ".curves[$i]")
		name=$(echo "$curve" | jq -r ".name")
		form=$(echo "$curve" | jq -r ".form")


		if [ -n "$1" ] && [ "$directory$name" != "$1" ]; then
			continue
		fi
		echo "Checking $directory$name"

		if [ "$form" != "Weierstrass" ]; then
			echo " -> Skipping, not Weierstrass"
			continue
		fi
		bits=$(echo "$curve" | jq -r ".field.bits")
		
		a=$(echo "$curve" | jq -r ".params.a.raw")
		b=$(echo "$curve" | jq -r ".params.b.raw")
		n=$(echo "$curve" | jq -r ".order")
		h=$(echo "$curve" | jq -r ".cofactor")
		full_order=$(echo "ibase=16;obase=10; $(to_bc $n) * $(to_bc $h)" | bc | trim_bc)

		field_type=$(echo "$curve" | jq -r ".field.type")
		case "$field_type" in

			Prime)
			p=$(echo "$curve" | jq -r ".field.p")
			# Reduce coefficients, some curves come not-reduced (BADA55...)
			a_reduced=$(echo "ibase=16;obase=10; $(to_bc $a) % $(to_bc $p)" | bc | from_bc)
			b_reduced=$(echo "ibase=16;obase=10; $(to_bc $b) % $(to_bc $p)" | bc | from_bc)
			computed_curve=$(echo -e "$p\n$a_reduced\n$b_reduced\n" | ./ecgen-static --fp --metadata $bits 2>/dev/null)
			if [ "$?" -ne 0 ]; then
				bits=$((bits+1))
				computed_curve=$(echo -e "$p\n$a_reduced\n$b_reduced\n" | ./ecgen-static --fp --metadata $bits 2>/dev/null)
			fi
			;;

			Binary)
			degree=$(echo "$curve" | jq -r ".field.degree")
			num_exps=$(echo "$curve" | jq -r ".field.poly | length")
			if [ $num_exps -ne 3 ]; then
				echo " -> Skipping, unsupported polynomial"
				continue
			fi
			e1=$(echo "$curve" | jq -r ".field.poly[0].power")
			e2=$(echo "$curve" | jq -r ".field.poly[1].power")
			e3=$(echo "$curve" | jq -r ".field.poly[2].power")
			computed_curve=$(echo -e "$degree\n$e1\n$e2\n$e3\n$a\n$b\n" | ./ecgen-static --f2m --metadata $bits 2>/dev/null)
			;;

			*)
			echo " -> Skipping, not Prime or Binary field"
			continue
			;;
		esac

		computed_full_order=$(echo "$computed_curve" | jq -r ".[0].order" | to_bc)
		res=$(echo "ibase=16;obase=10; $full_order == $computed_full_order" | bc -q)
		if [ "$res" != "1" ]; then
			echo -e "${RED}Wrong curve order! $full_order vs $computed_full_order${NC}" >&2
			errors=$((errors+1))
		fi

		characteristics=$(echo "$curve" | jq -r ".characteristics")
		declare -A var_map
		var_map[j_inv]=inv
		var_map[discriminant]=discriminant
		var_map[embedding_degree]=embedding_degree
		var_map[trace_of_frobenius]=frobenius
		var_map[cm_disc]=cm_discriminant
		var_map[conductor]=conductor
		if [ -n "$characteristics" ]; then
			for var in "${!var_map[@]}"; do
				own=$(echo "$characteristics" | jq -r ".$var")
				if [ -n "$own" -a "$own" != "null" ]; then
					computed=$(echo "$computed_curve" | jq -r ".[0].meta.${var_map[$var]}")
					res=$(echo "$own == $computed" | bc -q)
					if [ "$res" != "1" ]; then
						echo -e "${YELLOW}Bad $var! $own vs $computed${NC}" >&2
						warns=$((warns+1))
					fi
				fi
			done
		fi
	done
done

echo "-----"
if [ "$warns" != 0]; then
	echo "There were $warns warnings"
fi
if [ "$errors" != 0 ]; then
	echo "Failing due to $errors failing tests"
    exit 1
else
	echo "All OK"
fi
