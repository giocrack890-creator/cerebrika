# Manuscritos

Acá van los textos completos de los ebooks, uno por archivo (`<slug>.ts`, con el tipo `Manuscript` de `src/content/ebooks/types.ts`).

**Esta carpeta está ignorada por git.** El repositorio es público: si un manuscrito se commitea, cualquiera puede leer el libro gratis. Guardá una copia de respaldo fuera del repo (Drive, Dropbox).

Para generar el PDF:

```bash
npm run ebook:pdf -- ia-para-docentes
```

Sale en `dist-ebooks/ia-para-docentes.pdf`. Subilo al bucket privado `ebooks` de Supabase con el nombre `ia-para-docentes.pdf`.
