
export default {
  moduleFileExtensions: [ 'ts', 'js' ],
  // moduleNameMapper: {
  //   '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  //   '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  // }
  // preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testMatch: [
  //   '**/__tests__/**/*.ts?(x)', 
  //   '**/?(*.)+(test).ts?(x)'
  // ],
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  transform: {
    // use babel for js
    '^.+\\.js?$': 'babel-jest',
    // '^.+\\.js?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.ts?$': 'ts-jest',
    // '^.+\\.ts?$': '<rootDir>/node_modules/ts-jest',
    //
    // '^.+\\.(js|ts)$': 'babel-jest',
    // '^.+\\.(js|ts)$': 'ts-jest',
  },
  // transformIgnorePatterns: [
  //   // '<rootDir>/node_modules/',
  //   '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$',
  //   '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$',
  //   '/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$',
  // ],
};
