const mongoose = require('mongoose');

function collectionModel(modelName, collectionName) {
  const schema = new mongoose.Schema({}, {
    strict: false,
    versionKey: false,
    minimize: false,
  });

  return mongoose.models[modelName] || mongoose.model(modelName, schema, collectionName);
}

module.exports = {
  Assignment: collectionModel('Assignment', 'assignments'),
  Category: collectionModel('Category', 'categories'),
  ReportPhoto: collectionModel('ReportPhoto', 'report_photos'),
  Report: collectionModel('Report', 'reports'),
  StatusLog: collectionModel('StatusLog', 'status_logs'),
  User: collectionModel('User', 'users'),
  Verification: collectionModel('Verification', 'verifications'),
};