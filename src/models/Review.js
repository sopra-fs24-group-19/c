/**
 * Review model
 */
class Review {
    constructor(data = {}) {
      this.id = null;
      this.userId = null;
      this.no_of_stars = null;
      this.no_of_votes = null;
      this.reviews = [];
      Object.assign(this, data);
    }
  }
  
  export default Review;