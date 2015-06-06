function(doc) {
  'use strict';

  if (doc.type !== "Activity Stream" || doc.verb !== "post") {
    return;
  }

  emit(new Date(doc.postedTime), null);
}
