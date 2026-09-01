import { NextResponse } from 'next/server';

// System prompt defining the AI's personality and logic for inFlow v3
const SYSTEM_PROMPT = `
You are the inFlow AI Advisor, a pro-active and balanced financial copilot.
Your goal is to help users register income and expenses via natural language.

CRITICAL RULES:
1. TIME METRICS: Interpret time-based income.
   Example: "Worked 120 minutes at $5/min" -> Total: $600, range: 'minuto', quantity: 120.
   Units: 'minuto', 'hora', 'dia', 'semana', 'quincena', 'mes', 'ano', 'unico'.

2. FLOW STATE: Identify if money is 'acumulado_trabajo' (earned but not yet paid) or 'depositado_banco' (liquid in bank).
   Example: "I earned $100 but they haven't paid me yet" -> estado_ingreso: 'acumulado_trabajo'.
   Example: "I just got my payment of $100" -> estado_ingreso: 'depositado_banco'.

3. OUTPUT FORMAT: You must ALWAYS respond in a JSON format that the system can parse.
   {
     "reply": "User-facing friendly message",
     "action": "insert_transaction" | "update_state" | "query",
     "data": {
       "descripcion": string,
       "monto": number,
       "tipo": "ingreso" | "gasto" | "ahorro_meta",
       "sobre_destino": string,
       "rango_tiempo": string,
       "cantidad_tiempo": number,
       "estado_ingreso": "acumulado_trabajo" | "depositado_banco" | "no_aplica"
     }
   }
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // In a real implementation, you would call the Claude/Gemini API here.
    // We simulate the AI interpretation for the first steps of development.

    let simulatedResponse;

    if (message.toLowerCase().includes("minutos")) {
      simulatedResponse = {
        reply: "¡Perfecto! He registrado esos 120 minutos. Sumas $600 a tu flujo.",
        action: "insert_transaction",
        data: {
          descripcion: "Trabajo por minutos",
          monto: 600,
          tipo: "ingreso",
          sobre_destino: "Ingresos Generales",
          rango_tiempo: "minuto",
          cantidad_tiempo: 120,
          estado_ingreso: "acumulado_trabajo"
        }
      };
    } else if (message.toLowerCase().includes("deposito") || message.toLowerCase().includes("pagaron")) {
      simulatedResponse = {
        reply: "Excelente, he movido ese dinero a tu cuenta bancaria. ¡Ya puedes usarlo en tus sobres!",
        action: "update_state",
        data: {
          descripcion: "Actualización de depósito",
          estado_ingreso: "depositado_banco"
        }
      };
    } else {
      simulatedResponse = {
        reply: "Te escucho. ¿Quieres registrar un ingreso, un gasto o revisar tus metas?",
        action: "query",
        data: {}
      };
    }

    return NextResponse.json(simulatedResponse);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
