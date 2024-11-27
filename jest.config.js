module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000,
  roots: ['<rootDir>/backend/tests'],
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Reporte de Pruebas',
      outputPath: './test-report.html',
    }],
  ],
};
