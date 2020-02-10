export const is_nullundef = x => x === null || x === undefined;
export const is_obj = x => x !== null && typeof x === 'object';
export const is_arr = x => Array.isArray(x);

export const clean_dict = x =>
  [x]
    .map(x => Object.entries(x))
    .map(x => x.map(([k, v]) =>
        is_arr(v) ? [ k
                    , v.map(vv => is_obj(vv) ? clean_dict(vv) : vv)
                    ]
      : is_obj(v) ? [ k
                    , clean_dict(v)
                    ]
                  : [ k
                    , v
                    ]))
    .map(x => x.filter(([k, v]) => v !== null))
    .map(x => Object.fromEntries(x))
    .pop();