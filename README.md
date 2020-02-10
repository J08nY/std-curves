# std-curves

**Standard curve database.** This repository contains a list of standardised elliptic curves, collected from many standards
by the team at [Centre for Research on Cryptography and Security](https://crocs.fi.muni.cz). For our other
projects related to elliptic curve cryptography, see:

 - [ECTester](https://github.com/crocs-muni/ECTester): A tool for testing black-box ECC implementations
 - [pyecsca](https://github.com/J08nY/pyecsca): A Python Elliptic Curve Side-Channel Analysis toolkit, focusing on
 reverse-engineering ECC implementations from devices
 - [ecgen](https://github.com/J08nY/ecgen): A tool for generating EC domain parameters

The curve listing includes its parameters, computed characteristics such as number of points or j-invariant.
New curves are currently being added, the database is definitely not complete.

## Format

The curves are stored in JSON files, grouped by category/source in directories.
See `schema.json` for the JSON schema of the files. See `analyze.sage` for a SAGE
script which parses the JSON and constructs a SAGE `EllipticCurve` object from it.