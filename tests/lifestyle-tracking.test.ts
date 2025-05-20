import { describe, it, expect, beforeEach } from 'vitest';

// Mock implementation for testing Clarity contracts
const mockBlockchain = {
  blockHeight: 100,
  contracts: {
    lifecycleTracking: {
      lastLifecycleEventId: 0,
      lifecycleEvents: new Map(),
      
      recordLifecycleEvent(sender, productId, eventType, location, description) {
        const newId = this.lastLifecycleEventId + 1;
        this.lastLifecycleEventId = newId;
        
        this.lifecycleEvents.set(newId, {
          productId,
          eventType,
          location,
          description,
          timestamp: mockBlockchain.blockHeight,
          recorder: sender
        });
        
        return { result: { value: newId } };
      },
      
      getLifecycleEvent(eventId) {
        if (!this.lifecycleEvents.has(eventId)) {
          return { result: null };
        }
        return { result: this.lifecycleEvents.get(eventId) };
      },
      
      getLastLifecycleEventId() {
        return { result: { value: this.lastLifecycleEventId } };
      }
    }
  }
};

describe('Lifecycle Tracking Contract', () => {
  const contract = mockBlockchain.contracts.lifecycleTracking;
  const testUser = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  
  beforeEach(() => {
    // Reset contract state before each test
    contract.lastLifecycleEventId = 0;
    contract.lifecycleEvents = new Map();
    mockBlockchain.blockHeight = 100;
  });
  
  it('should record a lifecycle event', () => {
    const result = contract.recordLifecycleEvent(
        testUser,
        1, // productId
        'Manufacturing',
        'Factory A, Line 3',
        'Initial production completed'
    );
    
    expect(result.result.value).toBe(1);
    expect(contract.lastLifecycleEventId).toBe(1);
    
    const event = contract.getLifecycleEvent(1).result;
    expect(event.eventType).toBe('Manufacturing');
    expect(event.location).toBe('Factory A, Line 3');
    expect(event.description).toBe('Initial production completed');
  });
  
  it('should retrieve null for non-existent event', () => {
    const result = contract.getLifecycleEvent(999);
    expect(result.result).toBe(null);
  });
  
  it('should track a product through its entire lifecycle', () => {
    // Record multiple lifecycle events
    contract.recordLifecycleEvent(
        testUser, 1, 'Manufacturing', 'Factory A', 'Production completed'
    );
    contract.recordLifecycleEvent(
        testUser, 1, 'Quality Control', 'QC Department', 'Passed all tests'
    );
    contract.recordLifecycleEvent(
        testUser, 1, 'Packaging', 'Packaging Dept', 'Packaged for shipping'
    );
    contract.recordLifecycleEvent(
        testUser, 1, 'Shipping', 'Distribution Center', 'Shipped to retailer'
    );
    contract.recordLifecycleEvent(
        testUser, 1, 'Retail', 'Store #123', 'Sold to customer'
    );
    contract.recordLifecycleEvent(
        testUser, 1, 'Maintenance', 'Service Center', 'Routine maintenance'
    );
    contract.recordLifecycleEvent(
        testUser, 1, 'Disposal', 'Recycling Center', 'Recycled'
    );
    
    expect(contract.getLastLifecycleEventId().result.value).toBe(7);
    
    // Check first and last events
    expect(contract.getLifecycleEvent(1).result.eventType).toBe('Manufacturing');
    expect(contract.getLifecycleEvent(7).result.eventType).toBe('Disposal');
  });
});
