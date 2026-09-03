import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const SYSTEM_PROMPT = `
You are the inFlow AI Advisor, a high-end financial copilot for a luxury wealth management app.
Your tone is professional, precise, and proactive. You speak in the user's language (likely Spanish).

CORE MISSION:
Interpret natural language to manage a user's financial flow. You must return a JSON object.

FINANCIAL LOGIC:
1. TIME METRICS: Handle inputs like "Worked 2 hours at $20/hr" -> monto: 40, rango_tiempo: 'hora', cantidad_tiempo: 2.
2. FLOW STATE:
   - 'acumulado_trabajo': Money earned but not yet received (accrued).
   - 'depositado_banco': Money actually in the bank (liquid).
3. ACTIONS:
   - "insert_transaction": Create a new record.
   - "update_state": Change accrued money to liquid.
   - "query": Answer a question about their capital.

OUTPUT FORMAT (Strict JSON):
{
  "reply": "Your professional response to the user",
  "action": "insert_transaction" | "update_state" | "query",
  "data": {
    "descripcion": string,
    "monto": number,
    "tipo": "ingreso" | "gasto" | "ahorro_meta",
    "sobre_destino": string,
    "rango_tiempo": "minuto" | "hora" | "dia" | "semana" | "quincena" | "mes" | "ano" | "unico",
    "cantidad_tiempo": number,
    "estado_ingreso": "acumulado_trabajo" | "depositado_banco" | "no_aplica"
  }
}
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const cookieHeader = req.headers.get('cookie');
    const username = cookieHeader?.split('; ').find(row => row.startsWith('inflow_user='))?.split('=')[1];

    if (!username) {
      return NextResponse.json({ reply: "No he podido identificar tu sesión. Por favor, inicia sesión nuevamente.", action: "query" });
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
    const { data: txs } = await supabase.from('transactions').select('*').eq('username', username).order('created_at', { ascending: false }).limit(10);

    const context = `
      User Profile: ${JSON.stringify(profile)}
      Recent Transactions: ${JSON.stringify(txs)}
    `;

    let aiResponse;
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: SYSTEM_PROMPT + "\n\nUser Context:\n" + context,
        messages: [
          ...history.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
          { role: 'user', content: message }
        ],
      });

      try {
        const firstBlock = response.content[0];
        if (firstBlock.type === 'text') {
          aiResponse = JSON.parse(firstBlock.text);
        } else {
          throw new Error("AI response was not text");
        }
      } catch {
        aiResponse = { reply: "Lo siento, tuve un problema procesando la respuesta. ¿Podrías repetirlo?", action: "query" };
      }
    } else {
      aiResponse = simulateAdvancedAI(message, profile);
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ reply: "El núcleo financiero ha encontrado un error. Reintentando...", action: "query" }, { status: 500 });
  }
}

function simulateAdvancedAI(message: string, profile: any) {
  const msg = message.toLowerCase();
  const currency = profile?.moneda_preferida || "USD";

  if (msg.includes("gané") || msg.includes("gané") || msg.includes("ingreso")) {
    const amount = msg.match(/\d+/)?.[0] || "100";
    return {
      reply: `¡Excelente noticia, ${profile?.nombre_usuario || 'usuario'}! He registrado un ingreso de ${amount} ${currency} en tu flujo.`,
      action: "insert_transaction",
      data: {
        descripcion: "Ingreso registrado vía AI",
        monto: parseFloat(amount),
        tipo: "ingreso",
        sobre_destino: "Ingresos Generales",
        rango_tiempo: "unico",
        cantidad_tiempo: 1,
        estado_ingreso: "acumulado_trabajo"
      }
    };
  }

  if (msg.includes("gasté") || msg.includes("gasto")) {
    const amount = msg.match(/\d+/)?.[0] || "20";
    return {
      reply: `Entendido. He registrado el gasto de ${amount} ${currency}. Recuerda mantener el equilibrio de tus sobres.`,
      action: "insert_transaction",
      data: {
        descripcion: "Gasto registrado vía AI",
        monto: parseFloat(amount),
        tipo: "gasto",
        sobre_destino: "Gastos Varios",
        rango_tiempo: "unico",
        cantidad_tiempo: 1,
        estado_ingreso: "no_aplica"
      }
    };
  }

  if (msg.includes("saldo") || msg.includes("cuánto")) {
    return {
      reply: `Actualmente tienes un flujo activo. Puedes revisar el detalle exacto en tu Panel de Control.`,
      action: "query"
    };
  }

  return {
    reply: `Te escucho, ${profile?.nombre_usuario || 'usuario'}. ¿Deseas registrar un nuevo flujo, actualizar un depósito o analizar tu capital?`,
    action: "query"
  };
}
