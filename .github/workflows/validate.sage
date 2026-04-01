#!/usr/bin/env sage
import glob
import json
import sys

from cysignals.alarm import alarm, AlarmInterrupt


VARS = ["u", "v", "w", "z", "s"]
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
GREEN = '\033[0;32m'
NC = '\033[0m'

def poly_to_sage(poly, R, depth=0):
	"""Convert polynomial from JSON representation to SageMath polynomial."""
	if not isinstance(poly, list):
		return R(0)
	
	base_ring = R.base_ring()
	result = R(0)
	
	for term in poly:
		coeff = term["coeff"]
		power = term["power"]
		
		# Recursively handle nested polynomials for tower fields
		if isinstance(coeff, list):
			# Nested polynomial - the coefficient is an element of the base field
			# The base field itself is defined by a polynomial
			# We need to construct this as a field element
			coeff_poly = poly_to_list(coeff)
			coeff_val = base_ring(coeff_poly)
		else:
			# Scalar coefficient
			coeff_val = base_ring(Integer(coeff))
		
		result += coeff_val * R.gen()^power
	
	return result


def poly_to_list(poly):
	"""Convert polynomial JSON to list of coefficients for field element construction."""
	if not isinstance(poly, list):
		return []
	
	# Find the maximum power to determine list size
	max_power = max(term["power"] for term in poly) if poly else 0
	coeffs = [0] * (max_power + 1)
	
	for term in poly:
		coeff = term["coeff"]
		power = term["power"]
		
		if isinstance(coeff, list):
			# Recursively handle nested structure
			coeffs[power] = poly_to_list(coeff)
		else:
			coeffs[power] = Integer(coeff)
	
	return coeffs


def element_to_sage(element, K):
	"""Convert field element from JSON to SageMath field element."""
	if element is None:
		return K(0)
	
	if "raw" in element and element["raw"] is not None:
		# Direct integer/hex representation
		return K(Integer(element["raw"]))
	elif "poly" in element and element["poly"] is not None:
		# Polynomial representation (for extension fields)
		R = K.polynomial_ring()
		poly = poly_to_sage(element["poly"], R)
		return K(poly)
	else:
		return K(0)


def build_tower_field(field, depth=0):
	"""Recursively build tower extension field.

	Note: We assume the modulus polynomials are irreducible (from curated dataset)
	and skip irreducibility checks for performance.
	"""
	if field["type"] == "Prime":
		return GF(Integer(field["p"]))

	# Build base field first
	base_field = build_tower_field(field["base"], depth + 1)

	# Create polynomial ring over base field
	var_name = VARS[depth]
	R = PolynomialRing(base_field, var_name)

	# Get modulus polynomial
	modulus = poly_to_sage(field["poly"], R, depth)

	if modulus.degree() != field["degree"]:
		raise ValueError("Bad extension degree")

	# Create extension field using .extension(degree, ...)
	K = base_field.extension(modulus, name=var_name)

	return K


def construct_curve(curve):
	# Generate the SageMath curve object based on field type and curve form
	E = None
	G = None
	K = None

	try:
		alarm(60)
		field_type = curve["field"]["type"]
		curve_form = curve["form"]
		
		if field_type == "Prime":
			p = Integer(curve["field"]["p"])
			K = GF(p)
			
			if curve_form == "Weierstrass":
				a = element_to_sage(curve["params"]["a"], K)
				b = element_to_sage(curve["params"]["b"], K)
				E = EllipticCurve(K, (a, b))
				
				if "generator" in curve and curve["generator"]:
					gx = element_to_sage(curve["generator"]["x"], K)
					gy = element_to_sage(curve["generator"]["y"], K)
					G = E(gx, gy)
			
			elif curve_form == "Edwards":
				if int(curve["params"]["c"]["raw"], 16) == 1:
					d = element_to_sage(curve["params"]["d"], K)
					# Convert Edwards to Weierstrass form
					E = EllipticCurve(K, (0, K(2 * (1 + d)/(1 - d)^2), 0, K(1/(1 - d)^2), 0))
			
			elif curve_form == "Montgomery":
				A = element_to_sage(curve["params"]["a"], K)
				B = element_to_sage(curve["params"]["b"], K)
				# Convert Montgomery to Weierstrass form
				E = EllipticCurve(K, ((3 - A^2)/(3 * B^2), (2 * A^3 - 9 * A)/(27 * B^3)))
				
				if "generator" in curve and curve["generator"]:
					# Convert generator from Montgomery to Weierstrass coordinates
					mx = element_to_sage(curve["generator"]["x"], K)
					my = element_to_sage(curve["generator"]["y"], K)
					wx = mx/B + A/(3*B)
					wy = my/B
					G = E(wx, wy)
			
			elif curve_form == "TwistedEdwards":
				a = element_to_sage(curve["params"]["a"], K)
				d = element_to_sage(curve["params"]["d"], K)
				# Convert TwistedEdwards to Weierstrass form
				E = EllipticCurve(K, (K(-1/48) * (a^2 + 14*a*d + d^2), K(1/864) * (a + d) * (-a^2 + 34*a*d - d^2)))
				
				if "generator" in curve and curve["generator"]:
					# Convert generator from TwistedEdwards to Weierstrass coordinates
					tx = element_to_sage(curve["generator"]["x"], K)
					ty = element_to_sage(curve["generator"]["y"], K)
					wx = (5*a + a*ty - 5*d*ty - d)/(12 - 12*ty)
					wy = (a + a*ty - d*ty - d)/(4*tx - 4*tx*ty)
					G = E(wx, wy)
			
			if E is not None:
				order = Integer(curve["order"]) * Integer(curve["cofactor"])
				E.set_order(order)
		
		elif field_type == "Binary":
			if curve_form == "Weierstrass":
				degree = curve["field"]["degree"]
				R = PolynomialRing(GF(2), 'x')
				modulus = poly_to_sage(curve["field"]["poly"], R)
				K = GF(2^degree, name='x', modulus=modulus)
				
				if curve["field"]["basis"] == "poly":
					a_val = Integer(curve["params"]["a"]["raw"])
					b_val = Integer(curve["params"]["b"]["raw"])
					# Binary field Weierstrass: y^2 + xy = x^3 + ax^2 + b
					E = EllipticCurve(K, (1, K.from_integer(a_val), 0, 0, K.from_integer(b_val)))
					
					if "generator" in curve and curve["generator"]:
						gx = K.from_integer(Integer(curve["generator"]["x"]["raw"]))
						gy = K.from_integer(Integer(curve["generator"]["y"]["raw"]))
						G = E(gx, gy)
				
				elif curve["field"]["basis"] == "normal":
					z = K.gen()
					a_val = Integer(curve["params"]["a"]["raw"])
					b_val = Integer(curve["params"]["b"]["raw"])
					
					# Convert from normal basis representation
					def from_normal_basis(val):
						result = K(0)
						for i, bit in enumerate(Integer(val).binary()):
							result += Integer(bit) * z^(2^i)
						return result
					
					a_k = from_normal_basis(a_val)
					b_k = from_normal_basis(b_val)
					E = EllipticCurve(K, (1, a_k, 0, 0, b_k))
					
					if "generator" in curve and curve["generator"]:
						gx = from_normal_basis(Integer(curve["generator"]["x"]["raw"]))
						gy = from_normal_basis(Integer(curve["generator"]["y"]["raw"]))
						G = E(gx, gy)
				
				if E is not None:
					order = Integer(curve["order"]) * Integer(curve["cofactor"])
					E.set_order(order)
		
		elif field_type == "Extension":
			if curve_form == "Weierstrass":
				base = Integer(curve["field"]["base"])
				degree = curve["field"]["degree"]
				
				R = PolynomialRing(GF(base), 'x')
				modulus = poly_to_sage(curve["field"]["poly"], R)
				K = GF(base^degree, name='x', modulus=modulus)
				
				a = element_to_sage(curve["params"]["a"], K)
				b = element_to_sage(curve["params"]["b"], K)
				E = EllipticCurve(K, (a, b))
				
				order = Integer(curve["order"]) * Integer(curve["cofactor"])
				E.set_order(order)
				
				if "generator" in curve and curve["generator"]:
					gx = element_to_sage(curve["generator"]["x"], K)
					gy = element_to_sage(curve["generator"]["y"], K)
					G = E(gx, gy)
		
		elif field_type == "Tower":
			if curve_form == "Weierstrass":
				K = build_tower_field(curve["field"], 0)
				
				a = element_to_sage(curve["params"]["a"], K)
				b = element_to_sage(curve["params"]["b"], K)
				E = EllipticCurve(K, (a, b))
				
				order = Integer(curve["order"]) * Integer(curve["cofactor"])
				E.set_order(order)
				
				if "generator" in curve and curve["generator"]:
					gx = element_to_sage(curve["generator"]["x"], K)
					gy = element_to_sage(curve["generator"]["y"], K)
					G = E(gx, gy)
	except AlarmInterrupt:
		print(YELLOW, "-> Timed out", NC, file=sys.stderr)
	finally:
		cancel_alarm()
	return E, G


def find_curve(json_path, curve_name):
	# Read JSON file
	with open(json_path, 'r') as f:
		data = json.load(f)
	
	# Find the curve by name
	curve = None
	for c in data["curves"]:
		if c["name"] == curve_name:
			curve = c
			break
	
	if curve is None:
		raise ValueError(f"Curve '{curve_name}' not found in {json_path}")

	return curve


def verify_curve(curve, E, G):
	errors = 0
	if "characteristics" in curve:
		chars = curve["characteristics"]
		
		disc = E.discriminant()
		j_inv = E.j_invariant()
		t = E.trace_of_frobenius()
		p = E.base_field().characteristic()
		q = E.base_field().order()
		r = int(curve["order"], 16)
		anomalous = E.order() == q
		supersingular = E.is_supersingular()
		cm_disc = ZZ(t^2 - 4*q)
		fundamental_disc = ZZ(QuadraticField(cm_disc).discriminant())
		conductor = (cm_disc // fundamental_disc).isqrt()
   
		if "discriminant" in chars:
			if int(chars["discriminant"]) != disc:
				errors += 1
				print(YELLOW, "-> Bad disc", chars["discriminant"], disc, NC, file=sys.stderr)
		if "anomalous" in chars:
			if chars["anomalous"] != anomalous:
				errors += 1
				print(YELLOW, "-> Bad anomalous", chars["anomalous"], anomalous, NC, file=sys.stderr)
		if "supersingular" in chars:
			if chars["supersingular"] != supersingular:
				errors += 1
				print(YELLOW, "-> Bad supersingular", chars["supersingular"], supersingular, NC, file=sys.stderr)
		if "j_invariant" in chars:
			if int(chars["j_invariant"]) != j_inv:
				errors += 1
				print(YELLOW, "-> Bad j-invariant", chars["j_invariant"], j_inv, NC, file=sys.stderr)
		if "trace_of_frobenius" in chars:
			if int(chars["trace_of_frobenius"]) != t:
				errors += 1
				print("-> Bad trace of frobenius", chars["trace_of_frobenius"], t, NC, file=sys.stderr)
		if "cm_disc" in chars:
			if int(chars["cm_disc"]) != fundamental_disc:
				errors += 1
				print(YELLOW, "-> Bad cm_disc", chars["cm_disc"], fundamental_disc, NC, file=sys.stderr)
		if "conductor" in chars:
			if int(chars["conductor"]) != conductor:
				errors += 1
				print(YELLOW, "-> Bad conductor", chars["conductor"], conductor, NC, file=sys.stderr)
		if "embedding_degree" in chars:
			k = int(chars["embedding_degree"])
			if not (all(Mod(q, r)^d != 1 for d in divisors(k)[:-1]) and Mod(q, r)^k == 1):
				errors += 1
				print(YELLOW, "-> Bad embedding degree", NC, file=sys.stderr)
	return errors


def verify_curves(json_path):
	errors = 0
	with open(json_path, 'r') as f:
		data = json.load(f)
	for c in data["curves"]:
		print(c["name"], file=sys.stderr)
		E, G = construct_curve(c)		
		errors += verify_curve(c, E, G)
	return errors


if __name__ == "sage.all" or __name__ == "__main__":
	errors = 0
	if len(sys.argv) == 1:
		for category in sorted(glob.glob("*/curves.json")):
			errors += verify_curves(category)
	elif len(sys.argv) == 2:
		errors += verify_curves(sys.argv[1])
	elif len(sys.argv) == 3:
		curve = find_curve(sys.argv[1], sys.argv[2])
		E, G = construct_curve(curve)
		errors += verify_curve(curve, E, G)
	else:
		print(f"Usage: {sys.argv[0]} (json path) (curve name)", file=sys.stderr)
		exit(2)
	if errors != 0:
		exit(1)
