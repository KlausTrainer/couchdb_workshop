function(doc) {
  'use strict';

  if (doc.type !== "Activity Stream" || doc.verb !== "post") {
    return;
  }

  emit([doc.provider.id, new Date(doc.postedTime)], null)
}
