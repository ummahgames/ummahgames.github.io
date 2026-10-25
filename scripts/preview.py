"""Serve categorized source folders at stable public game URLs."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parents[2]
landing = root / 'ummahgames.github.io'
categories = json.loads((root / 'game-kit/categories.json').read_text())
games = {slug: root / category['folder'] / slug
         for category in categories for slug in category['games']}
folders = {category['folder'] for category in categories}
missing = landing / '__not_found__'


def resolve_route(url):
    parts = unquote(urlsplit(url).path).lstrip('/').split('/')
    # Never serve repository internals or traverse outside a selected game.
    if any(part.startswith('.') or '\\' in part for part in parts):
        return missing
    if parts[0] in games:
        base, tail = games[parts[0]], parts[1:]
    elif len(parts) > 1 and parts[0] in folders and parts[1] in games:
        base, tail = games[parts[1]], parts[2:]
        if base.parent.name != parts[0]:
            return missing
    else:
        base, tail = landing, parts
    result = base.joinpath(*tail).resolve()
    return result if result.is_relative_to(base.resolve()) else missing


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        return str(resolve_route(path))


if __name__ == '__main__':
    print('Ummah Games preview: http://127.0.0.1:8000/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8000), Handler).serve_forever()
