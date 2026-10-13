from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
root = Path(__file__).resolve().parents[2]
games = {'alien', 'dune-arcanum', 'find-the-animal', 'pearls', 'photon', 'swipe'}
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = urlsplit(path).path.lstrip('/')
        base = root if clean.split('/')[0] in games else root / 'ummahgames.github.io'
        result = (base / clean).resolve()
        return str(result if result.is_relative_to(base) else base / '__not_found__')
if __name__ == '__main__':
    print('Ummah Games preview: http://127.0.0.1:8000/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8000), Handler).serve_forever()
