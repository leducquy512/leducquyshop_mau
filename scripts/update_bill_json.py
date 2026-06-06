import json
from pathlib import Path

path = Path(__file__).resolve().parent.parent / 'public' / 'bill.json'
with path.open('r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    item.setdefault('status', 'delivered')
    item.setdefault('paymentMethod', 'cash')
    item.setdefault('discount', 0)
    item.setdefault('note', '')

with path.open('w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f'Updated {len(data)} bill entries in {path}')
