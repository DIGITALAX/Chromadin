import escapeHtml from "./escapeHtml";
import safeExternalUrl from "./safeExternalUrl";

const descriptionRegex = (description: string, messages?: boolean) => {
  const replacedDescription = description?.replace(/\n\n/g, "\n \n");
  const lines = replacedDescription?.split(/[\r\n]+/);
  const color = messages ? "#ff494a" : "#81A8F8";
  const styledLines = lines?.map((line: string) => {
    const words = line.split(" ");
    const styledWords = words.map((word: string) => {
      const safeWord = escapeHtml(word);
      if (word[0] === "#") {
        return `<em id="hashtags" style="color: ${color}; cursor: pointer; font-style: normal;">${safeWord}</em>`;
      } else if (word[0] === "@") {
        const href = escapeHtml(
          `https://www.chromadin.xyz/?option=history&profile=${encodeURIComponent(
            word?.replace("@lens/", "")?.replace("@", "")
          )}`
        );
        return `
            <a href="${href}" rel="noreferrer" target="_blank" style="margin-right: 4px;">
              <span style="color: ${color};">${safeWord}</span>
            </a>
          `;
      } else if (
        (word[0] === "h" &&
          word[1] === "t" &&
          word[2] === "t" &&
          word[3] === "p") ||
        (word[0] === "w" &&
          word[1] === "w" &&
          word[2] === "w" &&
          word[3] === ".")
      ) {
        const url = safeExternalUrl(word);
        if (!url) {
          return safeWord;
        }
        return `
            <a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">
              <span style="color: ${color};">${safeWord}</span>
            </a>
          `;
      } else {
        return safeWord;
      }
    });
    const styledLine = `<span>${styledWords?.join(" ")}</span>`;
    return styledLine;
  });
  const formattedDescription = styledLines?.join("<br />");
  return `<div>${formattedDescription}</div>`;
};

export default descriptionRegex;
