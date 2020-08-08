#!/usr/bin/env sage
import json
import sys
import click
from copy import copy
from cysignals.alarm import alarm, cancel_alarm, AlarmInterrupt

config = None

def embedding_degree_q(q, r):
	'''returns embedding degree with respect to q'''
	return Mod(q,r).multiplicative_order()

def embedding_degree(E, r):
	'''returns relative embedding degree with respect to E'''
	q = (E.base_field()).order()
	return embedding_degree_q(q, r)

def ext_card(E, deg):
	'''returns curve cardinality over deg-th relative extension'''
	card_low = E.cardinality()
	q = (E.base_field()).order()
	tr = q + 1 - card_low
	s_old, s_new = 2, tr
	for i in [2..deg]:
		s_old, s_new = s_new, tr * s_new - q * s_old
	card_high = q^deg + 1 - s_new
	return card_high

def extend(E, deg):
	'''returns curve over deg-th relative extension'''
	q = E.base_field().order()
	R.<x> = E.base_field()[]
	pol = R.irreducible_element(deg)
	Fext = GF(q^deg, name = 'z', modulus = pol)
	EE = E.base_extend(Fext)
	return EE

def find_least_torsion(E, r):
	'''Find the minimal extension which contains Z_r'''
	for deg in divisors(r^2-1):
		if ext_card(E, deg) % r == 0:
			return deg
	return None

def is_torsion_cyclic(E, r, deg):
	card = ext_card(E, deg)
	assert card % r^2 == 0
	m = ZZ(card / r)
	EE = extend(E, deg)
	for j in [1..5]:
		P = EE.random_element()
		if m*P != EE(0):
			return True
	return False

def find_full_torsion(E, r, least):
	'''Find the minimal extension which contains the full torsion'''
	p = E.base_field().order()
	q = p^least
	k = embedding_degree_q(q, r)
	if k > 1:
		return k * least
	else:
		card = ext_card(E, least)
		if (card % r^2) == 0 and not is_torsion_cyclic(E, r, least):
			return least
		else:
			return r * least

def find_torsions(E, r):
	'''Find both minimal extensions which contain Z_r and then the full torsion'''
	least = find_least_torsion(E, r)
	if least == r^2-1:
		full = least
	else:
		full = find_full_torsion(E, r, least)
	return least, full

def get_curve_group(data):
	'''Construct an EllipticCurve and a generator from the parsed JSON.'''
	if data["field"]["type"] == "Prime":
		p = int(data["field"]["p"], 16)
		K = GF(p)
		if data["form"] == "Weierstrass":
			a = K(int(data["params"]["a"], 16))
			b = K(int(data["params"]["b"], 16))
			E = EllipticCurve(K, (a, b))
			G = E(K(int(data["generator"]["x"], 16)), K(int(data["generator"]["y"], 16)))
		elif data["form"] == "Edwards":
			c = K(int(data["params"]["c"], 16))
			if c != 1:
				raise NotImplementedError
			d = K(int(data["params"]["d"], 16))
			E = EllipticCurve(K, (0, K(2 * (1 + d)/(1 - d)^2), 0, K(1/(1 - d)^2), 0))
			G = None
		elif data["form"] == "Montgomery":
			A = K(int(data["params"]["a"], 16))
			B = K(int(data["params"]["b"], 16))
			E = EllipticCurve(K, ((3 - A^2)/(3 * B^2), (2 * A^3 - 9 * A)/(27 * B^3)))
			G = E(K(int(data["generator"]["x"], 16))/B + A/(3*B), K(int(data["generator"]["y"], 16))/B)
		elif data["form"] == "TwistedEdwards":
			a = K(int(data["params"]["a"], 16))
			d = K(int(data["params"]["d"], 16))
			E = EllipticCurve(K, (K(-1/48) * (a^2 + 14*a*d + d^2),K(1/864) * (a + d) * (-a^2 + 34*a*d - d^2)))
			x = K(int(data["generator"]["x"], 16))
			y = K(int(data["generator"]["y"], 16))
			G = E((5*a + a*y - 5*d*y - d)/(12 - 12*y), (a + a*y - d*y -d)/(4*x - 4*x*y))
		E.set_order(int(data["order"], 16) * int(data["cofactor"], 16))
		return E, G
	elif data["field"]["type"] == "Binary":
		F.<x> = GF(2)[]
		poly = sum(F(int(elem["coeff"], 16)) * x^elem["power"] for elem in data["field"]["poly"])
		K = GF(2^data["field"]["degree"], name="x", modulus=poly)
		E = EllipticCurve(K, (1, K.fetch_int(int(data["params"]["a"], 16)), 0, 0, K.fetch_int(int(data["params"]["b"], 16))))
		E.set_order(int(data["order"], 16) * int(data["cofactor"], 16))
		G = E(K.fetch_int(int(data["generator"]["x"], 16)), K.fetch_int(int(data["generator"]["y"], 16)))
		return E, G
	elif data["field"]["type"] == "Extension":
		base = int(data["field"]["base"], 16)
		F.<x> = GF(base)[]
		poly = sum(F(int(elem["coeff"], 16)) * x^elem["power"] for elem in data["field"]["poly"])
		K = GF(base^data["field"]["degree"], name="x", modulus=poly)
		a = K(sum(F(int(elem["coeff"], 16)) * x^elem["power"] for elem in data["params"]["a"]))
		b = K(sum(F(int(elem["coeff"], 16)) * x^elem["power"] for elem in data["params"]["b"]))
		E = EllipticCurve(K, (a, b))
		E.set_order(int(data["order"], 16) * int(data["cofactor"], 16))
		gx = K(sum(F(int(elem["coeff"], 16)) * x^elem["power"] for elem in data["generator"]["x"]))
		gy = K(sum(F(int(elem["coeff"], 16)) * x^elem["power"] for elem in data["generator"]["y"]))
		G = E(gx, gy)
		return E, G
	else:
		raise ValueError()

def info(msg, level, **kwargs):
	if config["verbose"] >= level:
		click.secho(msg, **kwargs)

def to_int(felement):
	if felement.base_ring().characteristic() == 2:
		c = reversed(felement.polynomial().coefficients(sparse=False))
		s = "".join(map(str, c))
		return int(s, 2)
	else:
		return int(felement)

def analyze(data):
	if config["curves"] and data["name"] not in config["curves"]:
		return data
	info(f"[{data['name']}] * Start * ", 0, fg="green", bold=True, err=True)
	try:
		curve, generator = get_curve_group(data)
	except ValueError as err:
		click.secho("Invalid input!", fg="red", err=True)
		click.secho(str(err), fg="red", err=True)
		return data
	except NotImplementedError:
		click.secho("Support for Edwards curves not yet implemented.", fg="red", err=True)
		return data
	if "characteristics" not in data:
		data["characteristics"] = {}
	chars = data["characteristics"]
	try:
		if config["timeout"]:
			alarm(config["timeout"])

		if ("discriminant" not in chars or config["recompute"]) and (not config["only"] or "discriminant" in config["only"]):
			info("Computing discriminant...", 1, err=True)
			chars["discriminant"] = str(to_int(curve.discriminant()))

		if ("j_invariant" not in chars or config["recompute"]) and (not config["only"] or "j_invariant" in config["only"]):
			info("Computing j-invariant...", 1, err=True)
			chars["j_invariant"] = str(to_int(curve.j_invariant()))

		if ("trace_of_frobenius" not in chars or config["recompute"]) and (not config["only"] or "trace_of_frobenius" in config["only"]):
			info("Computing trace of Frobenius...", 1, err=True)
			chars["trace_of_frobenius"] = str(int(curve.trace_of_frobenius()))

		if ("embedding_degree" not in chars or config["recompute"]) and curve.base_field().characteristic() != 2 and (not config["only"] or "embedding_degree" in config["only"]):
			info("Computing embedding degree...", 1, err=True)
			chars["embedding_degree"] = str(int(GF(generator.order())(curve.base_field().characteristic()).multiplicative_order()))

		if ("anomalous" not in chars or config["recompute"]) and (not config["only"] or "anomalous" in config["only"]):
			info("Checking anomalous condition...", 1, err=True)
			chars["anomalous"] = curve.base_field().characteristic() == generator.order()

		if ("supersingular" not in chars or config["recompute"]) and (not config["only"] or "supersingular" in config["only"]):
			info("Checking supersingular condition...", 1, err=True)
			chars["supersingular"] = curve.is_supersingular()

		if ("cm_disc" not in chars or config["recompute"]) and (not config["only"] or "cm_disc" in config["only"]):
			info("Computing CM-discriminant...", 1, err=True)
			chars["cm_disc"] = str(int(squarefree_part(4 * curve.base_field().order() - curve.trace_of_frobenius())))

		if ("conductor" not in chars or config["recompute"]) and (not config["only"] or "conductor" in config["only"]):
			info("Computing conductor...", 1, err=True)
			chars["conductor"] = str(int(sqrt((4 * curve.base_field().order() - curve.trace_of_frobenius())/squarefree_part(4 * curve.base_field().order() - curve.trace_of_frobenius()))))

		if ("torsion_degrees" not in chars or config["recompute"]) and curve.base_field().characteristic() != 2 and (not config["only"] or "torsion_degrees" in config["only"]):
			info("Computing torsion extension degrees...", 1, err=True)
			degs = []
			chars["torsion_degrees"] = degs
			for r in primes(20):
				info(f"\t r={r}", 2, err=True)
				least, full = find_torsions(curve, r)
				degs.append({"r": int(r), "least": int(least), "full": int(full)})
		cancel_alarm()
	except AlarmInterrupt:
		click.secho("! Timeout reached !", fg="red", err=True)
	info(f"[{data['name']}] * End * ", 0, fg="green", bold=True, err=True) 
	return data


@click.command(help="Elliptic Curve analysis script. Computes various interesting characteristics of elliptic curves over finite fields.",
			   epilog="© 2020 Jan Jancar, Vladimir Sedlacek: MIT licensed")
@click.option('-v', '--verbose', count=True, help="Set the verbosity of output. Can be used multiple times to increase verbosity.")
@click.option('-o', '--only', multiple=True, type=str, help="Only compute a particular characteristic and skip others.")
@click.option('-r', '--recompute', is_flag=True, help="Force recomputation of characteristics present in input.")
@click.option('-c', '--curves', multiple=True, type=str, help="Only compute characteristics for curves which match the name.")
@click.option('-t', '--timeout', type=int, help="Limit computation time to a given value in seconds, will output partial results.")
def main(**kwargs):
	global config
	config = copy(kwargs)
	data = json.load(sys.stdin)
	if "curves" in data:
		data["curves"] = [analyze(curve) for curve in data["curves"]]
	else:
		data = analyze(data)
	click.echo(json.dumps(data, indent=2))


if __name__ == "__main__":
	main()
