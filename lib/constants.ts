import { ItemType } from "@/components/Common/Modals/types/modals.types";

export const INFURA_GATEWAY: string = "https://chromadin.infura-ipfs.io";
export const BASE_URL: string = "https://api-v2.lens.dev/";
export const CHROMADIN_ID: string = "0x01c6a9";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;

export const SAMPLER_CONTRACT: `0x${string}` =
  "0x948ed9CD14Ce2B60Cee4bca0BCe1a65B95BD34d2";
export const CHROMADIN_OPEN_ACTION: `0x${string}` =
  "0x9A94C316F644D10641A528904e4a030a77498160";
export const LISTENER_OPEN_ACTION: `0x${string}` =
  "0x06BB03BAe0dE9A6808cd9AF9c9C3ec8F59e6FE39";
export const COIN_OP_OPEN_ACTION: `0x${string}` =
  "0x3710f718f9E78a58FEcfF5Cd9cc41a4b7466BB14";
export const KINORA_OPEN_ACTION: `0x${string}` =
  "0x196f267A4aCA1243CCCB85AD7098D1fDA1D683CD";
export const F3M_OPEN_ACTION: `0x${string}` =
  "0xba6a85811336781Bad55E624C40Dc1D5615243C7";
export const PRINT_ACCESS_CONTROL: `0x${string}` =
  "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55";
export const LENS_HUB_PROXY_ADDRESS_MUMBAI: `0x${string}` =
  "0xC1E77eE73403B8a7478884915aA599932A677870";
export const LENS_HUB_PROXY_ADDRESS_MATIC: `0x${string}` =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";


export const MOSH_VIDEOS: string[] = [
  "QmVfPFMoTnLYWXdEfShbN6Mxfhbp8CNEFdNf7g9TEZCfjQ",
  "QmZARuqZLxqaBbF1tXBBox1tUvVzGo6gqzHgU8SSdUE4Hq",
  "QmdepEJRDmbxWaQaQzneMeDPEFRvPHy61or5fkfNom873C",
  "QmfJscBXrRD2QP44hygDusEwpejbhGGJ8jx11CQu9s4eTc",
  "QmXGSCuFDWTtaDJKgT1wg8VLooa6nLkt6sEjYqMrNpjGKW",
  "QmTH3frz1VHaUvuj1H6ve77tXWBvC2WPjiutTBbZjaFZEu",
];

export const ACCEPTED_TOKENS: string[][] = [
  [
    "WMATIC",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
  ],
  [
    "WETH",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
  ],
  [
    "USDT",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
  ],
  [
    "MONA",
    "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
  ],
];

export const LENS_CREATORS: string[] = [
  "0x84ec",
  "0x0197d6",
  "0x016305",
  "0x015ed3",
  "0x01c96b",
  "0x01c97e",
  "0x01c6a9",
  "0x01cd7c",
  "0x01cd7e",
  "0x01df77",
  "0x01dfaa",
  "0x01dfa9",
  "0x01df79",
  "0x01dfab",
  "0x01dfcb",
  "0x01dfcc",
  "0x01dfcd",
  "0x01e01d",
  "0x01e024",
  "0x01f76d",
  "0x01f76c",
  "0x01ef68",
  "0x01f55e",
  "0x020ff9",
  "0x02103f",
  "0x0210aa",
  "0x02116d",
  "0x0211f9",
  "0x069575",
  "0x069581",
  "0x0695A1",
  "0x0695B0",
];

export const VIDEO_COVERS: {
  poster: string;
  id: string;
}[] = [
  // {
  //   poster: "QmS7dgntwZKvvBqDqFtij3pBoynFjUjMGBWEePakDnLm8k",
  //   id: "0x01c6a9-0x4d",
  // },
  {
    poster: "QmVu3BgNHbr3SHuork9hESWD5sNGX8MuKE1fTnUH5bTvBJ",
    id: "0x01c6a9-0x4c",
  },
  {
    poster: "QmS7hfXnMVccophqKwGtfVyxUtGCa6a2SLr14iF8X5RFX8",
    id: "0x01c6a9-0x4b",
  },
  {
    poster: "QmZUhd8RVwict7UXkfbm9bAcE8fZSZnVHKanorG9jSSaFz",
    id: "0x01c6a9-0x4a",
  },
  {
    poster: "Qmcxv5AN2TrpoYFk1rr81Z3Mh2eCD97Xnj5ejSL71DK7k5",
    id: "0x01c6a9-0x49",
  },
  {
    poster: "Qmb2M48ZEZKgCjwebnp13Heojyi59aa71Hc9ZWG9o9BXWr",
    id: "0x01c6a9-0x48",
  },
  {
    poster: "QmbQULaFbsMjMUief92Mk13aKPpyebi7T45ksVJC1xr8sb",
    id: "0x01c6a9-0x47",
  },
  {
    poster: "QmRfARHWd3qHQJsK792xubzd8oyFfcvgRn8FhQbT1UB24D",
    id: "0x01c6a9-0x46",
  },
  {
    poster: "QmYi3vVchUbzfn7fYd1Fq2rddn3Y9odyw7pdkuAU7zqUTi",
    id: "0x01c6a9-0x45",
  },
  {
    poster: "QmaemK3e6sTQfXvYRaJQvQ876eCTWB1tuN3F8L7uZyj1va",
    id: "0x01c6a9-0x44",
  },
  {
    poster: "QmSa5RQnPe1PFXKHmgc6Fin83jh6GLYDTBt8GCRhPehq5y",
    id: "0x01c6a9-0x43",
  },
  {
    poster: "QmcLqMmiFRD5HuUXiiQWSRrEjvmY8yNGzLzSN8mWD4ge4X",
    id: "0x01c6a9-0x42",
  },
  {
    poster: "QmenggnmziozxNAazvbPH7Dafh2MxT87DqXiYiykRgDJm2",
    id: "0x01c6a9-0x41",
  },
  {
    poster: "Qmere72oocLsuqvJEH8bXXaJkmRtin9x2yeU7YC5td634E",
    id: "0x01c6a9-0x40",
  },
  {
    poster: "QmeYnKbmtKRsTGvC8qz84zpBYwLbntKPLoqazHzMoBaNQu",
    id: "0x01c6a9-0x3f",
  },
  {
    poster: "QmUwrqyBHR7uVwyhjPuWgxX9xwRXABymqoP2ntvNXeDQvP",
    id: "0x01c6a9-0x3e",
  },
  {
    poster: "QmSZB5xkNxRXts3wAKPzxmiyP5PsMUR4bonuBSwgGvXWaJ",
    id: "0x01c6a9-0x3d",
  },
  {
    poster: "QmVRamWK2NM25Pr5fEHHSNxHYn6koHnegWdC6VS7m4w2s3",
    id: "0x01c6a9-0x3c",
  },
  {
    poster: "QmY8gb1njewrR2MnFppvPnQYcjXxhb8HakgQbb97LRyTg1",
    id: "0x01c6a9-0x3b",
  },
  {
    poster: "QmekcGwMX91WeC1XS7uT5wCPWuoBV1JeiRwFZbpcQwHRCt",
    id: "0x01c6a9-0x3a",
  },
  {
    poster: "QmNPU2Pz69LXcgaMj1if4iz4C2GEyW9DfAfFWs9shWGfZn",
    id: "0x01c6a9-0x39",
  },
  {
    poster: "QmaLJVdMzWBQ9VsrZGDauurmG6YTBLTcWHPZSiEggMehuW",
    id: "0x01c6a9-0x38",
  },
  {
    poster: "QmTXyQZEsbXPQ9D2SqWhhmwUNtDNoH2C7wn3YveHG5riTP",
    id: "0x01c6a9-0x37",
  },
  {
    poster: "QmXHyNQaAdLDUJugkTC2m8n6EHU8aTTCqWFZLGBu1apc1h",
    id: "0x01c6a9-0x36",
  },
  {
    poster: "Qmcyt14mQHosHY8N9gFUv9Q83ngxGjZemYztZXyJKcEV22",
    id: "0x01c6a9-0x35",
  },
  {
    poster: "Qmaa6J96Zjy5uBrf1Tkq9m1q7yMpHViX8tcpub3p5LPstg",
    id: "0x01c6a9-0x34",
  },
  {
    poster: "QmdxZUgKbAhCZQkPjQWsx5aX7h9amTEPPUtfaURZDEZDYx",
    id: "0x01c6a9-0x33",
  },
  {
    poster: "QmNzHweRmBKfcCv4ZjS8SLuKX8Yz67i91MK6GbaqiQbAmH",
    id: "0x01c6a9-0x31",
  },
  {
    poster: "QmRYHUScCPiNRBaR3fgzXqrMXtuVBkWWrv2dZLNc8Un9vj",
    id: "0x01c6a9-0x2e",
  },
  {
    poster: "QmVBXA6me9WXMAjjA18wuz2DSvt7Lfxyh98UWJBM55X4oK",
    id: "0x01c6a9-0x2d",
  },
  {
    poster: "QmcqjrnUR7x46Tjeas3oYvzVokYRnyntNapHqECPEPa9iL",
    id: "0x01c6a9-0x2c",
  },
  {
    poster: "QmZGdVS5RBDDNUJ7xJmiarVuXFsMd5wB9YYGHpAY9U3bnf",
    id: "0x01c6a9-0x2a",
  },
  {
    poster: "QmNVyvZUPBRubF6HsziE4ab9ayzXYbV5CFjxRdovLGbnDC",
    id: "0x01c6a9-0x26",
  },
  {
    poster: "Qmaa7vRdYVgdMuNjuYAk9fDehd2Z6BfUJvSTrj5SBNXTnM",
    id: "0x01c6a9-0x25",
  },
  {
    poster: "QmTLAdk4zWwXtMWVTCATaqJA33NewMQypKiQWke3JnwfUC",
    id: "0x01c6a9-0x24",
  },
  {
    poster: "QmQFh4W5edc8xpdyaAnPYMWcbSyEqDtEVUKtonrZLKqLx1",
    id: "0x01c6a9-0x22",
  },
  {
    poster: "QmYXPC1TTNbFNt94M8DydzQLac7jPq8A8aXSSY7mbUZgt8",
    id: "0x01c6a9-0x21",
  },
  {
    poster: "Qmcmpnpw1usdxGtnxhweb7C1TEYvrce6QkE8wHRZmsfKop",
    id: "0x01c6a9-0x1e",
  },
  {
    poster: "QmRh7c4RBdEBoJp5Tvx3QuzNmqK3s41JHTMDFXjYKmLE1s",
    id: "0x01c6a9-0x1d",
  },
  {
    poster: "QmeJHxqCuhybe6AH9fBQ9WKknWJuBYJWz1gPq8DQaVQJyp",
    id: "0x01c6a9-0x1a",
  },
  {
    poster: "QmZU9TZ9jJV7cCEn7yUDBFQG9jjgKkuufRptQcr9gMKftA",
    id: "0x01c6a9-0x19",
  },
  {
    poster: "QmYpZAjT3J7NypHEDrQbC9w1Xe3GFHXJvZfs9JHQLH7Fce",
    id: "0x01c6a9-0x18",
  },
  {
    poster: "Qmb97LGhJnjKu2BhXYwuJbccV7HE9Fv8Gnjq6yW7QYLCrT",
    id: "0x01c6a9-0x17",
  },
  {
    poster: "QmbAYst9KnFG6qfPGq8RuyvierzsxkJ4xrbUCv2FMvvXuR",
    id: "0x01c6a9-0x16",
  },
  {
    poster: "QmahRCpydveLcPq7hCn1CB3xVxn9hat9NAoxUghCDFvmaN",
    id: "0x01c6a9-0x15",
  },
  {
    poster: "QmdtGp5MoPWWN3FtqCs2UfCJxsvKUoY826ckHNByj8F1X7",
    id: "0x01c6a9-0x14",
  },
  {
    poster: "Qmacyapa6i6eRTBYLYEYud2RS6w48JeG2PV7ovZJ3F8qvP",
    id: "0x01c6a9-0x13",
  },
  {
    poster: "QmTUkqDVHhS5ZD3Kowvv29ks1sFxxgFZqWTPuyAhUVYaVR",
    id: "0x01c6a9-0x12",
  },
  {
    poster: "Qmf2f8ZkQFponnCZNdW7sctU6FjS95Vvi6Y5v3Z9DPFKe1",
    id: "0x01c6a9-0x11",
  },
  {
    poster: "QmeoV9nxjvQavFVfWJpwZdDnuEJ9JwtUUtbkiTQfoiVNjB",
    id: "0x01c6a9-0x10",
  },
  {
    poster: "QmVLD5GmiC8WYp7bE1YAHy2dotksBN2aRGXT3XjcG29juP",
    id: "0x01c6a9-0x0f",
  },
  {
    poster: "QmZPbLG6DxjCWkrvgAisfPc9yV9VaXsijqaGB96WnF7xdq",
    id: "0x01c6a9-0x0e",
  },
  {
    poster: "QmWMeVWidKkZ3xHD3KDvmedeqt1Dq3SxZQQWSCmXFabPEi",
    id: "0x01c6a9-0x0d",
  },
  {
    poster: "QmeFsHjRAD3kGYNkqEtuF2j173pjdhA17KSVYjxoLsGHTo",
    id: "0x01c6a9-0x0c",
  },
  {
    poster: "QmQLawNquz9n9vNhaaJCMmo8DjMtDV4PZKzWMTsDLqZrWp",
    id: "0x01c6a9-0x0b",
  },
  {
    poster: "QmYcFrxavY9hqTN8T1BVboCYb8jWa7D41GwG9hPe5u84mp",
    id: "0x01c6a9-0x0a",
  },
  {
    poster: "QmWhZ9ekPrJn4D643t3gjK3KeErcXELuh6mDJPXT6BXtS8",
    id: "0x01c6a9-0x09",
  },
  {
    poster: "QmanG9iKR1bNgLHDeUpe428893cahr1TB77GsbYB8Ski4o",
    id: "0x01c6a9-0x08",
  },
  {
    poster: "QmYUL2J1GF8YXXz8kCxQm8qFdpEjZPv5VoXCjdBsvA3VDV",
    id: "0x01c6a9-0x07",
  },
  {
    poster: "QmYHB94DFeroh4FUfJ1Tr7jVCFZd1ssux3WVmrMA6uv79x",
    id: "0x01c6a9-0x06",
  },
  {
    poster: "QmWBkq32nwkGeYtcKLExaabBoQhPB4wUQ9SUWjZBCJsxZk",
    id: "0x01c6a9-0x05",
  },
  {
    poster: "QmNVGSryrrF76nfZU7dtGiQr7Jvw5ygwkbp2r9CrwfYmrR",
    id: "0x01c6a9-0x04",
  },
  {
    poster: "QmTvBiJLh1QtFLU9UJRq1nKDgQgvCvktauCZC6k6hMhGXA",
    id: "0x01c6a9-0x03",
  },
  {
    poster: "QmdafbuWTNANrmNHs2T8kdn6qeWriXQLrqNPT7GZ7utb6B",
    id: "0x01c6a9-0x02",
  },
  {
    poster: "QmU15zV7uQoxX3HkMbpgEyMU2mcj7yxFqX5rDQjLAMHcHr",
    id: "0x01c6a9-0x01",
  },
];

export const KINORA_QUEST_DATA: `0x${string}` =
  "0xB638b8e910f5852d9B2b69D250883EB3E8575092";
export const KINORA_METRICS: `0x${string}` =
  "0x97B8B90458616f3680f1A17941C0F33E22CD2C60";

export const numberToItemTypeMap: { [key: number]: ItemType } = {
  0: ItemType.CoinOp,
  1: ItemType.Chromadin,
  2: ItemType.Legend,
  3: ItemType.Listener,
  4: ItemType.F3M,
  5: ItemType.Other,
};
