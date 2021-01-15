#!/usr/bin/env python3
import json
import glob
import pathlib


if __name__ == "__main__":
    for fname in glob.glob("*/curves.json"):
        fpath = pathlib.Path(fname)
        with fpath.open() as f:
            category = json.load(f)
        for curve in category["curves"]:
            if curve["field"]["type"] != "Prime":
                continue
            if curve["form"] != "Weierstrass":
                continue
            if not curve["generator"]["x"]["raw"] or not curve["generator"]["y"]["raw"]:
                continue
            name = f'"{fpath.parent}/{curve["name"]}"'
            params = f'[0,0,0,{curve["params"]["a"]["raw"]},{curve["params"]["b"]["raw"]}]'
            field = f'{curve["field"]["p"]}'
            generator = f'[Mod({curve["generator"]["x"]["raw"]},{curve["field"]["p"]}), Mod({curve["generator"]["y"]["raw"]}, {curve["field"]["p"]})]'
            order = f'{curve["order"]}'
            cofactor = f'{curve["cofactor"]}'
            print(f'[{name}, {params}, {field}, {generator}, {order}, {cofactor}]')
