# std-curves

See our [website](https://neuromancer.sk/std/).

**Standard curve database.** This repository contains a list of standardised elliptic curves, collected from many standards
by the team at [Centre for Research on Cryptography and Security](https://crocs.fi.muni.cz). For our other
projects related to elliptic curve cryptography, see:

 - [ECTester](https://github.com/crocs-muni/ECTester): A tool for testing black-box ECC implementations
 - [pyecsca](https://github.com/J08nY/pyecsca): A Python Elliptic Curve Side-Channel Analysis toolkit, focusing on
 reverse-engineering ECC implementations from devices
 - [ecgen](https://github.com/J08nY/ecgen): A tool for generating EC domain parameters

The curve listing includes its parameters, computed characteristics such as number of points or j-invariant as
well as SAGE code which can be used to instantiate the curve and a JSON export of all of the curve data.
New curves are currently being added, the database is definitely not complete.

The presence of a certain curve in this database does not mean that the curve is secure, only that it is notable
enough or that someone suggested its use in a publication or a standard. We made a best effort attempt to make 
sure all parameters presented here are correct, however mistakes could have happened on data import and thus 
double-checking with the source document is recommended.

## Format

The curves are stored in JSON files, grouped by category/source in directories.
See `schema.json` for the JSON schema of the files.

## Website

The website is hosted at <https://neuromancer.sk/std/>, its sources
are available in the `page` branch.
