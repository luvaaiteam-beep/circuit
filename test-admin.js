import admin from 'firebase-admin';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

admin.initializeApp({
  projectId: config.projectId
});
console.log('App initialized with projectId:', config.projectId);
