/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.phoneNumber = null;
    this.address = null;
    this.longitude = null;
    this.latitude= null;
    this.token = null;
    this.status = null;
    this.radius = null;
    Object.assign(this, data);
  }
}

export default User;
