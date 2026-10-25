// Ejercicio 2: Calculadora por consola
// Uso: node 02_calculadora_cli.js sumar 12 5


const [operacion, primerTexto, segundoTexto] = process.argv.slice(2);
const primerNumero = Number(primerTexto);
const segundoNumero = Number(segundoTexto);


if (
  !operacion ||
  !Number.isFinite(primerNumero) ||
  !Number.isFinite(segundoNumero)
) {
  console.log("Uso: node 02_calculadora_cli.js <operacion> <numero1> <numero2>");
  process.exit(1);
}


let resultado;


switch (operacion.toLowerCase()) {
  case "sumar":
    resultado = primerNumero + segundoNumero;
    break;
  // TODO: agregar restar, multiplicar y dividir.
  default:
    console.log("Operación pendiente: completar el switch.");
    process.exit(1);
}


console.log("Resultado: " + resultado);