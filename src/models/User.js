/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.birthdayDate = null;
    this.creationDate = null;
    this.status = null;
    Object.assign(this, data);
  }
}

export default User;
