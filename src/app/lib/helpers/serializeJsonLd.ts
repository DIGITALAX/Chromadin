const serializeJsonLd = (data: unknown): string => {
  return JSON.stringify(data).replace(/</g, "\\u003c");
};

export default serializeJsonLd;
