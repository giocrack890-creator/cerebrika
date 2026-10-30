import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const doc = await PDFDocument.create();
const font = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);

function drawPage(title, lines) {
  const page = doc.addPage([595.28, 841.89]);
  page.drawRectangle({ x: 0, y: 780, width: 595.28, height: 62, color: rgb(0.216, 0.192, 0.639) });
  page.drawText("PLACEHOLDER", {
    x: 48,
    y: 804,
    size: 18,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(title, { x: 48, y: 720, size: 22, font: bold, color: rgb(0.07, 0.07, 0.07) });
  let y = 680;
  for (const line of lines) {
    page.drawText(line, { x: 48, y, size: 12, font, color: rgb(0.12, 0.12, 0.12) });
    y -= 22;
  }
  page.drawText("BORRADOR - NO ES EL EBOOK FINAL", {
    x: 48,
    y: 72,
    size: 14,
    font: bold,
    color: rgb(0.86, 0.15, 0.15),
  });
}

drawPage("Cerebrika", [
  "Este PDF es un marcador de posicion.",
  "Cerebrika vende ebooks cortos de IA.",
  "El primero, IA para docentes, todavia no esta escrito.",
  "No es el material final y no incluye el metodo.",
  "",
  "Cuando el texto este listo, reemplaza este archivo",
  "por el PDF real en el bucket privado de Supabase.",
]);

drawPage("Indice en borrador", [
  "01  Para que sirve la IA en el aula, y para que no",
  "02  Tu primera conversacion con un chat",
  "03  El dato que la IA no tiene: tu grupo",
  "04  De la planificacion anual a la semana",
  "05  Armar una clase que entra en el modulo",
  "06  Actividades para ritmos distintos",
  "07  Revisar lo que escribio la IA",
  "08  Una rutina de una hora para toda la semana",
  "",
  "Cada linea es un titulo pendiente de redaccion.",
]);

const target = path.join(process.cwd(), "private/ebook/placeholder.pdf");
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, await doc.save());
console.log(target);
