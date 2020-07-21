module.exports = {
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['<rootDir>/tests/**/*spec.(ts|js)'],
    testPathIgnorePatterns: ['/node_modules/'],
    rootDir: __dirname,
};
