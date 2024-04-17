/**
 * Task model
 */
class Task {
  constructor(data = {}) {
    this.id = null;
    this.title = null;
    this.description = null;
    this.price = null;
    this.address = null;
    this.date = null;
    this.duration = null;
    Object.assign(this, data);
  }
}

export default Task;
