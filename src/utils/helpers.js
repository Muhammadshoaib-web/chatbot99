export function isValidWebhookPayload(bodyParam) {
  return (
    bodyParam.entry &&
    bodyParam.entry[0].changes &&
    bodyParam.entry[0].changes[0].value.messages &&
    bodyParam.entry[0].changes[0].value.messages[0]
  );
}
