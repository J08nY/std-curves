def curve_order: ["name","category","desc","oid","sources","field","form","params","generator","order","cofactor","aliases","characteristics"];
def category_order: ["name","desc","curves"];

def reorder_obj($order):
  . as $o
  | ($order | map(. as $k | select($o | has($k)))) as $ordered_present
  | ($o | keys_unsorted - $ordered_present) as $rest
  | reduce ($ordered_present + $rest)[] as $k ({}; . + { ($k): $o[$k] });

.curves |= map(reorder_obj(curve_order))
| reorder_obj(category_order)
