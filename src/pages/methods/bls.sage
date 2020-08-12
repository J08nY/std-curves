class BLS(object):
    @classmethod
    def generate_prime_order(cls, zbits):
        while True:
            z = random_int(2^(zbits - 1), 2^zbits)
            pz = int(cls.p(z))
            if not is_prime(pz):
                continue
            rz = int(cls.r(z))
            if not is_prime(rz):
                continue
            break
        K = GF(pz)
        b = 1
        while True:
            curve = EllipticCurve(K, [0, b])
            card = curve.cardinality()
            if card % rz == 0:
                break
        return curve


class BLS12(BLS):
    @staticmethod
    def p(z):
        return (z - 1)^2 * (z^4 - z^2 + 1)/3 + z
    @staticmethod
    def r(z):
        return z^4 - z^2 + 1
    @staticmethod
    def t(z):
        return z + 1


class BLS24(BLS):
    @staticmethod
    def p(z):
        return (z - 1)^2 * (z^8 - z^4 + 1)/3 + z
    @staticmethod
    def r(z):
        return z^8 - z^4 + 1
    @staticmethod
    def t(z):
        return z + 1