import { query } from './founder_os_db.js';

/**
 * Log an event to the Founder OS activity/audit trail.
 * @param {string} userName - The name or username of the user performing the action.
 * @param {string} entityType - Entity type: 'Lead', 'Project', 'Task', 'Revenue', 'Expense', 'Person', 'SOP', 'Security', 'Proposal', 'Call', 'Backup', 'Settings'.
 * @param {number|null} entityId - Optional ID of the affected record.
 * @param {string} action - Action performed: 'Created', 'Updated', 'Deleted', 'Status Changed', 'Exported', 'Restored', 'Reset'.
 * @param {string} details - Human-readable description of the event (e.g., 'Added expense ₹4,500 for Hosting').
 */
export async function logActivity(userName = 'Founder', entityType, entityId, action, details) {
  try {
    await query(
      `INSERT INTO founder_os_activity_logs (user_name, entity_type, entity_id, action, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userName || 'Founder', entityType, entityId || null, action, details]
    );
  } catch (err) {
    console.error('Failed to write to audit log:', err.message);
  }
}
