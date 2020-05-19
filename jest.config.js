module.exports = {
  preset: "@shelf/jest-mongodb",

  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
  testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
};
