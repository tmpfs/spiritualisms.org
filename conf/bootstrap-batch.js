/**
 *  1. Create all the required databases.
 *
 *  2. Create the user for the application.
 *
 *  3. Add the design documents and quote documents.
 */
module.exports = {
  exec: [
    'db add _users',
    'db add _replicator',
    'db add _global_changes',
    'db add quotes',
    'user add spiritualisms-appuser',
    'security set -d quotes -f conf/roles.json',
    'app push --no-auto-id -d quotes -i app ./db/app'
  ]
}
