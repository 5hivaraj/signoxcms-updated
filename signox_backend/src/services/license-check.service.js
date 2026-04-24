const cron = require('node-cron');
const licenseExpiryService = require('./license-expiry.service');

let cronJob = null;

/**
 * Hourly license sweep (USER_ADMIN / UserAdminProfile).
 * ClientProfile no longer has licenseExpiry; expiry logic lives in license-expiry.service.
 */
const checkExpiredLicenses = async () => {
  try {
    await licenseExpiryService.checkAndSuspendExpiredLicenses();
  } catch (error) {
    console.error('❌ Error checking expired licenses:', error);
  }
};

/**
 * Start the license check cron job
 * Runs every hour at minute 0
 */
const start = () => {
  if (cronJob) {
    console.log('⚠️  License check service already running');
    return;
  }

  cronJob = cron.schedule('0 * * * *', async () => {
    await checkExpiredLicenses();
  });

  console.log('🚀 License check service started (runs every hour)');

  checkExpiredLicenses();
};

/**
 * Stop the license check cron job
 */
const stop = () => {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('🛑 License check service stopped');
  }
};

/**
 * Manually trigger license check (for testing or admin actions)
 */
const checkNow = async () => {
  console.log('🔄 Manual license check triggered');
  await checkExpiredLicenses();
};

module.exports = {
  start,
  stop,
  checkNow,
};
