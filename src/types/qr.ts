export interface QRCodeData {
  id: string;
  data: string;
  timestamp: Date;
  source: 'upload' | 'camera';
}

export interface QRNode {
  data: QRCodeData;
  next: QRNode | null;
}

export class QRLinkedList {
  head: QRNode | null = null;
  
  append(data: QRCodeData): void {
    const newNode: QRNode = {
      data,
      next: null
    };
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }
  
  toArray(): QRCodeData[] {
    const result: QRCodeData[] = [];
    let current = this.head;
    
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    
    return result;
  }
  
  clear(): void {
    this.head = null;
  }
}