const express = require('express');
const router = express.Router();
const { getAuditLedgerFromGatekeeper } = require('../services/gatekeeperService');

router.get('/', async (req, res) => {
  try {
    const auditLogs = await getAuditLedgerFromGatekeeper();
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
