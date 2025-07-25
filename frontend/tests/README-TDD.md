# 🧪 Guide des tests unitaires avec Jest

---

## 📁 Structure des tests

```
frontend/tests/
├── setup.js           # Configuration globale Jest
├── utils/             # Tests des utilitaires (ex: auth)
├── services/          # Tests des services (ex: cart)
└── pages/             # Tests des pages (ex: home, products)
```
> Place chaque fichier de test dans le dossier approprié.

---

## 🚀 Commandes principales

```bash
npm test              # Lancer tous les tests
npm run test:watch    # Relancer les tests à chaque changement
npm run test:coverage # Rapport de couverture (≥ 80%)
```

---

## 🛠️ Bonnes pratiques

- **1 test = 1 fonctionnalité** (nom explicite)
- Respecter le schéma **Arrange – Act – Assert**
- Isole chaque test (mocks pour APIs, localStorage…)
- Vise **≥ 80 % de couverture** (branches, fonctions, lignes)

---

## 📝 Exemples courants

### Test simple

```js
test('should add product to cart', () => {
  const result = cartService.addItem(testProduct, 1);
  expect(result).toBe(true);
});
```

### Assertions fréquentes

```js
expect(result).toBe(true);
expect(obj).toEqual({ id: 1 });
expect(array).toHaveLength(2);
expect(fn).toHaveBeenCalled();
await expect(promise).resolves.toBe('ok');
```

### Utilisation des mocks

```js
jest.mock('../utils/api.js', () => ({
  fetchData: jest.fn()
}));
```

---

## 📊 Rapport de couverture

- Génère avec :

  ```bash
  npm run test:coverage
  ```
- Objectif : **≥ 80 %** sur l’ensemble du code.