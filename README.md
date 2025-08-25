# Mentor

Platformă de pregătire construită cu [Vite](https://vitejs.dev) și React.

## Rulare

```bash
npm install
npm run dev
```

Pentru build de producție:

```bash
npm run build
```

## Surse de date

Fișierele JSON se află în `public/data`. Poți înlocui oricare dintre ele sau schimba locația lor din aplicație folosind registrul de surse expus în `src/data/loader.ts`.
Schema unei întrebări este validată cu [Zod](https://zod.dev) și arată astfel:

```ts
{
  id: number;
  categorie: string;
  intrebare: string;
  variante: string[];
  raspunsCorect: string;
  sursa?: string;
}
```

## Cheia GEMINI_API_KEY

Pentru funcționalități AI opționale setează variabila de mediu `GEMINI_API_KEY` înainte de rularea serverului.

## Icon-uri PWA

Icon-urile PWA se află în `public/`. Poți genera altele noi cu instrumente precum [pwa-asset-generator](https://github.com/electerious/pwa-asset-generator).

## Shortcut-uri de tastatură

- **N** – întrebare următoare
- **R** – revizuiește răspunsurile greșite
