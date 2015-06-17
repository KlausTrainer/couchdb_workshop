function(newDoc, oldDoc, userCtx, secObj) {
  // allow admins to do anything
  if (userCtx.roles.indexOf('_admin') !== -1) {
    return;
  }

  // don't allow normal users to delete documents
  if (newDoc._deleted === true) {
    throw({forbidden: 'Only admins may delete documents.'});
  }
}
