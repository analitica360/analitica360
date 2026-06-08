exports.handler = async (event) => {
  // Verificación inicial que pide Meta
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters;
    const VERIFY_TOKEN = 'analitica360token'; // tú lo defines
    if (params['hub.verify_token'] === VERIFY_TOKEN) {
      return {
        statusCode: 200,
        body: params['hub.challenge']
      };
    }
    return { statusCode: 403, body: 'Token inválido' };
  }

  // Mensajes entrantes — los reenvía a Make
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const mensaje = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (mensaje) {
      // Reenviar a Make via HTTP
      await fetch('TU_WEBHOOK_DE_MAKE_AQUI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: mensaje.from,       // número del paciente
          text: mensaje.text?.body, // texto del mensaje
          timestamp: mensaje.timestamp
        })
      });
    }

    return { statusCode: 200, body: 'OK' };
  }
};
