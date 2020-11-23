#!/usr/bin/env python3
import glob
import json
import sys
import os.path
import requests

if __name__ == "__main__":
    result = 0
    for curves_json in glob.glob("*/curves.json"):
        category = os.path.dirname(curves_json)
        with open(curves_json) as f:
            curves = json.load(f)
        for curve in curves["curves"]:
            if "oid" not in curve:
                continue
            oid = curve["oid"]
            if not oid:
                print(f"Curve {category}/{curve['name']} has empty OID value.")
                continue
            url = f"http://oid-info.com/get/{oid}"
            r = requests.get(url)
            if r.status_code != 200:
                print(f"Curve {category}/{curve['name']} has bad OID, return code {r.status_code}!")
                result = 1
    sys.exit(result)
