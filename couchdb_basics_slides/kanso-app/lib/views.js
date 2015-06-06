exports.views = {
  attendees: {
    map: function (doc) {
      emit([doc.first_name, doc.last_name], doc.coding_skills);
    }
  }
};