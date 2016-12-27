/**
 *  1. Create all the required databases.
 *
 *  2. Create the user for the application.
 *
 *  3. Add the design documents and quote documents.
 */
module.exports = {
  user: 'spiritualisms',
  exec: [
    'login',
    'user rm spiritualisms-appuser --no-interactive',
    'db rm _users --no-interactive',
    'db rm _replicator --no-interactive',
    'db rm _global_changes --no-interactive',
    'db rm quotes --no-interactive'
  ]
}
