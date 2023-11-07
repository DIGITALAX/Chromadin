export const chunkString = (str: string, length: number) => {
    const chunks = [];
    let index = 0;
    while (index < str.length) {
      chunks.push(str.substring(index, index + length));
      index += length;
    }
    return chunks;
  };
  