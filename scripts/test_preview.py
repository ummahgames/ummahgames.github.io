"""Code-only routing checks; no browser or listening socket is required."""
import unittest
from preview import root, landing, games, missing, resolve_route


class PreviewRoutes(unittest.TestCase):
    def test_landing_and_assets(self):
        self.assertEqual(resolve_route('/'), landing)
        self.assertEqual(resolve_route('/styles.css?v=1'), landing / 'styles.css')
        self.assertTrue(resolve_route('/game-meta.js').is_file())

    def test_all_public_game_urls_and_assets(self):
        self.assertEqual(len(games), 53)
        for slug, folder in games.items():
            with self.subTest(slug=slug):
                self.assertEqual(resolve_route(f'/{slug}/'), folder)
                self.assertEqual(resolve_route(f'/{slug}/index.html?level=1#save=keep-me'), folder / 'index.html')
                self.assertTrue(resolve_route(f'/{slug}/screen.js').is_file())

    def test_all_categorized_game_urls(self):
        for slug, folder in games.items():
            with self.subTest(slug=slug):
                route = f'/{folder.parent.name}/{slug}/'
                self.assertEqual(resolve_route(route), folder)
                self.assertEqual(resolve_route(route + 'index.html'), folder / 'index.html')
                self.assertTrue((folder / 'index.html').is_file())

    def test_wrong_category_is_not_an_alias(self):
        self.assertEqual(resolve_route('/action/alien/'), missing)
        self.assertEqual(resolve_route('/matching/photon/index.html'), missing)

    def test_internal_files_and_traversal_are_not_served(self):
        for route in ['/alien/.git/config', '/puzzles/alien/.git/config',
                      '/.git/config', '/alien/../categories.json',
                      '/alien/%2e%2e/.git/config', '/alien/%2f../.git/config',
                      '/alien/..%5c.git/config']:
            with self.subTest(route=route):
                self.assertEqual(resolve_route(route), missing)


if __name__ == '__main__':
    unittest.main()
