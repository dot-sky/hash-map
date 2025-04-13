import { LinkedList } from "./LinkedList.js";
export class HashMap {
  constructor() {
    this.capacity = 16;
    this.loadFactor = 0.75;
    this.buckets = [];
    this.#init();
  }

  #init() {
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = new LinkedList();
    }
    this.elements = 0;
  }

  hash(key) {
    let hashCode = 0;
    const primeFactor = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeFactor * hashCode + key.charCodeAt(i);
      hashCode = hashCode % this.capacity;
    }
    return hashCode;
  }

  set(key, value) {
    const hash = this.hash(key);
    this.#validateIndex(hash);
    const list = this.buckets[hash];

    let node = list.getHead();
    while (node !== null) {
      if (node.value.key === key) {
        node.value.value = value;
        return;
      }
      node = node.nextNode;
    }
    list.prepend({ key, value });
    this.elements++;
    if (this.#capacityOverload()) {
      this.resizeArray();
    }
  }

  get(key) {
    const hash = this.hash(key);
    this.#validateIndex(hash);
    const list = this.buckets[hash];

    let node = list.getHead();
    while (node !== null) {
      if (node.value.key === key) {
        return node.value.value;
      }
      node = node.nextNode;
    }
    return null;
  }

  has(key) {
    const hash = this.hash(key);
    this.#validateIndex(hash);
    const list = this.buckets[hash];

    let node = list.getHead();
    while (node !== null) {
      if (node.value.key === key) {
        return true;
      }
      node = node.nextNode;
    }
    return false;
  }

  remove(key) {
    const hash = this.hash(key);
    this.#validateIndex(hash);
    const list = this.buckets[hash];

    let prev = null;
    let curr = list.getHead();
    while (curr !== null) {
      if (curr.value.key === key) {
        if (curr === list.getHead()) {
          list.shift();
        } else {
          prev.next = curr.next;
        }
        this.elements--;
        return true;
      }
      prev = curr;
      curr = curr.nextNode;
    }
    return false;
  }

  length() {
    return this.elements;
  }

  clear() {
    this.#init();
    this.elements = 0;
  }

  entries() {
    const arr = [];
    for (let i = 0; i < this.capacity; i++) {
      let node = this.buckets[i].getHead();
      while (node !== null) {
        arr.push([node.value.key, node.value.value]);
        node = node.nextNode;
      }
    }
    return arr;
  }

  keys() {
    const keys = [];
    for (let i = 0; i < this.capacity; i++) {
      let node = this.buckets[i].getHead();
      while (node !== null) {
        keys.push(node.value.key);
        node = node.nextNode;
      }
    }
    return keys;
  }

  values() {
    const values = [];
    for (let i = 0; i < this.capacity; i++) {
      let node = this.buckets[i].getHead();
      while (node !== null) {
        values.push(node.value.value);
        node = node.nextNode;
      }
    }
    return values;
  }

  resizeArray() {
    console.log("resizing");
    const entries = this.entries();
    this.capacity *= 2; // double array length
    this.#init();
    for (let i = 0; i < entries.length; i++) {
      this.set(entries[i][0], entries[i][1]);
    }
  }

  #validateIndex(index) {
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bonds");
    }
  }

  #capacityOverload() {
    return this.elements > this.capacity * this.loadFactor;
  }
}
