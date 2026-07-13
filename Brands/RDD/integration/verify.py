"""
verify.py — RDD BigCommerce connectivity smoke test (diagnostic only).

Generalized from the proven RDD Project 2 verify_bigcommerce_api.py. It is a
READ-ONLY connectivity check: it confirms the token in Brands/RDD/.env can reach
the v3 Catalog API, lists a few categories, and pulls a few products (with the
new stock/date fields) so you can confirm the credentials and scopes before
wiring product data into campaign generation.

It NEVER prints the access token or any secret. The store hash is a
non-sensitive path segment and is shown only to confirm which store is targeted.

Usage (from anywhere):
    python "Brands/RDD/integration/verify.py"
"""

import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

# Brands/RDD/.env (one brand, one credentials file).
ROOT = Path(__file__).resolve().parent
ENV_FILE = ROOT.parent / ".env"


def load_env(env_file: Path) -> dict:
    if not env_file.exists():
        print(f"Missing .env file at {env_file}", file=sys.stderr)
        print("Copy integration/.env.example to Brands/RDD/.env and fill in the values.", file=sys.stderr)
        sys.exit(1)

    raw = {}
    for line in env_file.read_text("utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":=" in line:
            key, value = line.split(":=", 1)
        elif ":" in line:
            key, value = line.split(":", 1)
        elif "=" in line:
            key, value = line.split("=", 1)
        else:
            continue
        raw[key.strip()] = value.strip()
    return raw


def pick(raw: dict, *keys):
    for key in keys:
        if key in raw and raw[key]:
            return raw[key]
    return None


def store_hash_from_api_path(api_path: str):
    if not api_path:
        return None
    parts = [p for p in urlparse(api_path.strip()).path.split("/") if p]
    if "stores" in parts:
        idx = parts.index("stores")
        if idx + 1 < len(parts):
            return parts[idx + 1]
    return None


def get_json(url: str, headers: dict):
    req = Request(url, headers=headers)
    with urlopen(req, timeout=20) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))


def main():
    raw = load_env(ENV_FILE)

    api_path = pick(raw, "API PATH", "API_PATH", "BIGCOMMERCE_API_PATH")
    token = pick(raw, "ACCESS TOKEN", "BIGCOMMERCE_ACCESS_TOKEN", "X-Auth-Token", "ACCESS_TOKEN")
    store_hash = pick(raw, "STORE HASH", "STORE_HASH", "BIGCOMMERCE_STORE_HASH") or store_hash_from_api_path(api_path)

    # Never print the token; only report whether it is present.
    print("Token present :", "yes" if token else "NO")
    print("Store hash    :", store_hash or "NOT RESOLVED")

    if not token or not store_hash:
        print("\nMissing token or store hash. Fill Brands/RDD/.env (see .env.example).", file=sys.stderr)
        sys.exit(1)

    headers = {"X-Auth-Token": token, "Accept": "application/json"}
    base = f"https://api.bigcommerce.com/stores/{store_hash}/v3"

    # 1) Categories reachable?
    cat_url = f"{base}/catalog/categories?limit=3"
    print("\nRequesting:", cat_url)
    try:
        status, data = get_json(cat_url, headers)
    except HTTPError as e:
        print("HTTPError", e.code, e.reason, file=sys.stderr)
        print("  If 401/403: token invalid or missing 'Products: read-only' scope.", file=sys.stderr)
        sys.exit(1)
    except URLError as e:
        print("URLError", e.reason, file=sys.stderr)
        sys.exit(1)

    print("Status:", status)
    print(
        "Categories sample:",
        json.dumps(
            [{"id": i.get("id"), "name": i.get("name")} for i in data.get("data", [])[:3]],
            indent=2,
        ),
    )

    # 2) Products reachable, including the new stock/date fields?
    prod_url = f"{base}/catalog/products?include=images&sort=date_modified&direction=desc&limit=3"
    print("\nRequesting:", prod_url)
    try:
        status, data = get_json(prod_url, headers)
    except HTTPError as e:
        print("HTTPError", e.code, e.reason, file=sys.stderr)
        sys.exit(1)
    except URLError as e:
        print("URLError", e.reason, file=sys.stderr)
        sys.exit(1)

    print("Status:", status)
    print(
        "Products sample:",
        json.dumps(
            [
                {
                    "id": i.get("id"),
                    "name": i.get("name"),
                    "price": i.get("price"),
                    "sale_price": i.get("sale_price"),
                    "inventory_level": i.get("inventory_level"),
                    "availability": i.get("availability"),
                    "is_visible": i.get("is_visible"),
                    "date_modified": i.get("date_modified"),
                }
                for i in data.get("data", [])[:3]
            ],
            indent=2,
        ),
    )

    print("\nConnectivity OK — read-only catalog access confirmed.")


if __name__ == "__main__":
    main()
