export type Prompt = {
  title: string;
  body: string;
};

export const promptsIntro =
  "Estos diez pedidos son el material gratis. Copiá uno, completá los corchetes y pegalo en el chat que uses.";

export const prompts: readonly Prompt[] = [
  {
    title: "1. La semana",
    body: "Soy docente de [MATERIA] con estudiantes de [EDAD]. Armame una planificación de una semana sobre [TEMA], con un objetivo por día, una actividad breve y un cierre. Usá un lenguaje simple y no des por hecho que tengo recursos digitales en el aula.",
  },
  {
    title: "2. El objetivo de una clase",
    body: "Escribí un objetivo observable para una clase de [DURACIÓN] sobre [TEMA] en [MATERIA], para estudiantes de [EDAD]. Evitá verbos vagos como «comprender» o «conocer». Proponé tres versiones y decime en qué se diferencian.",
  },
  {
    title: "3. Los primeros diez minutos",
    body: "Proponé un inicio de 10 minutos para enganchar a un grupo de [EDAD] con el tema [TEMA]. No uses proyector ni celular. Tiene que poder hacerse con pizarrón y cuaderno. Explicame qué mirar para saber si funcionó.",
  },
  {
    title: "4. La actividad principal",
    body: "Diseñá una actividad de [DURACIÓN] para [MATERIA], tema [TEMA], estudiantes de [EDAD]. Incluí la consigna textual que yo les diría, los materiales y un error común que debería anticipar.",
  },
  {
    title: "5. Dos ritmos",
    body: "Tomá esta consigna y armá dos variantes del mismo objetivo: una más corta y una con un paso extra para quien termina antes. Materia: [MATERIA]. Tema: [TEMA]. Edad: [EDAD]. Consigna original: [PEGÁ LA CONSIGNA].",
  },
  {
    title: "6. Una rúbrica corta",
    body: "Armá una rúbrica de cuatro criterios, con tres niveles cada uno, para evaluar [TAREA] en [MATERIA]. Escribila en una tabla que yo pueda copiar. Los criterios tienen que ser observables, no de actitud.",
  },
  {
    title: "7. Preguntas para chequear",
    body: "Escribí ocho preguntas para saber si un estudiante de [EDAD] entendió [TEMA] en [MATERIA]. Mezclá preguntas cortas y una que pida explicar con un ejemplo propio. Marcá cuál no se responde copiando una definición.",
  },
  {
    title: "8. La tarea para la casa",
    body: "Proponé una tarea de menos de 20 minutos sobre [TEMA] para [EDAD]. Tiene que poder hacerse sin internet. Decime qué miro al día siguiente para saber si la hicieron y qué aprendieron.",
  },
  {
    title: "9. Explicar un tema difícil",
    body: "Explicame [TEMA] como si se lo tuviera que contar a estudiantes de [EDAD], en [MATERIA]. Después listá tres analogías y tachá las que puedan dejar una idea equivocada. No uses tecnicismos sin decir qué significan.",
  },
  {
    title: "10. Revisar lo que escribió el chat",
    body: "Actuá como un colega docente, no como un vendedor. Revisá el texto que pegué abajo. Señalá datos que no debería dar por ciertos, un tono que no usaría con mi grupo y un paso que no entra en [DURACIÓN]. Texto: [PEGÁ EL TEXTO].",
  },
];
