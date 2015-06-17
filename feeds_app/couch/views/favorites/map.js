function(doc) {
  'use strict';

  if (doc.type !== "favorite") {
    return;
  }

  emit(doc.articleDate, null);
}
