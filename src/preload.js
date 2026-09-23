const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Patients
  createPatient: (patient) => ipcRenderer.invoke('db:createPatient', patient),
  getPatients: () => ipcRenderer.invoke('db:getPatients'),
  searchPatients: (query) => ipcRenderer.invoke('db:searchPatients', query),

  // Appointments
  createAppointment: (appointment) => ipcRenderer.invoke('db:createAppointment', appointment),
  getAppointmentsByDate: (date) => ipcRenderer.invoke('db:getAppointmentsByDate', date),

  // Clinical Notes
  createNote: (note) => ipcRenderer.invoke('db:createNote', note),
  updateNote: (id, content) => ipcRenderer.invoke('db:updateNote', id, content),
  addAddendum: (addendum) => ipcRenderer.invoke('db:addAddendum', addendum),
  getNotesForPatient: (patientId) => ipcRenderer.invoke('db:getNotesForPatient', patientId),

  // PT Programs
  saveProgramTemplate: (template) => ipcRenderer.invoke('db:saveProgramTemplate', template),
  getProgramTemplates: () => ipcRenderer.invoke('db:getProgramTemplates'),
  savePatientProgram: (patientId, programData) => ipcRenderer.invoke('db:savePatientProgram', patientId, programData),
  getPatientPrograms: (patientId) => ipcRenderer.invoke('db:getPatientPrograms', patientId),

  // Invoices
  createInvoice: (invoice) => ipcRenderer.invoke('db:createInvoice', invoice),
  getInvoicesForPatient: (patientId) => ipcRenderer.invoke('db:getInvoicesForPatient', patientId),

  // Auto-Text Templates
  getAutoTextTemplates: () => ipcRenderer.invoke('db:getAutoTextTemplates'),
  createAutoTextTemplate: (template) => ipcRenderer.invoke('db:createAutoTextTemplate', template),

  // Clinic Settings
  getSettings: () => ipcRenderer.invoke('db:getSettings'),
  updateSettings: (settings) => ipcRenderer.invoke('db:updateSettings', settings),

  // File System
  readImageAsBase64: (filePath) => ipcRenderer.invoke('fs:readImageAsBase64', filePath),

  // Exports
  generatePDF: (htmlContent, prefix) => ipcRenderer.invoke('pdf:generate', htmlContent, prefix)
});