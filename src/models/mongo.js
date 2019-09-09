'use strict';

/** Class representing a generic mongo model. */
class Model {

  /**
   * Model Constructor
   * @param schema {object} - mongo schema
   */
  constructor(schema) {
    this.schema = schema;
  }


  /**
   *
   * @param _id
   * @returns {Promise|*|PromiseLike<{count: *, results: *}>|Promise<{count: *, results: *}>|Query|void}
   */
  get(_id) {
    // Call the appropriate mongoose method to get
    if(_id) {
      // If 1, return it as a plain object
      return this.schema.findOne({_id});
    } else {
      // If 2, return it as an object like this:
      return  this.schema.find({})
        .then((foundItems) => {
          // { count: ##, results: [{}, {}] }
          return { count: foundItems.length, results: foundItems};
        });
    }
  }

  /**
   * Create a new record
   * @param record {object} matches the format of the schema
   * @returns {*}
   */
  create(record) {

    const newRecord = this.schema(record);
    return newRecord.save();
  }

  /**
   * Replaces a record in the database
   * @param _id {string} Mongo Record ID
   * @param record {object} The record data to replace. ID is a required field
   * @returns {*}
   */
  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {new: true});
  }

  /**
   * Deletes a recod in the model
   * @param _id {string} Mongo Record ID
   * @returns {*}
   */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

}

module.exports = Model;
