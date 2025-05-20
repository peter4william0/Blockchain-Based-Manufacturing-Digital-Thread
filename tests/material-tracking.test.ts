import { describe, it, expect, beforeEach } from 'vitest';

// Mock implementation for testing Clarity contracts
const mockBlockchain = {
  blockHeight: 100,
  contracts: {
    materialTracking: {
      lastBatchId: 0,
      materialBatches: new Map(),
      
      recordMaterialBatch(sender, productId, materialName, supplier, quantity, unit) {
        const newId = this.lastBatchId + 1;
        this.lastBatchId = newId;
        
        this.materialBatches.set(newId, {
          productId,
          materialName,
          supplier,
          quantity,
          unit,
          timestamp: mockBlockchain.blockHeight,
          recorder: sender
        });
        
        return { result: { value: newId } };
      },
      
      getMaterialBatch(batchId) {
        if (!this.materialBatches.has(batchId)) {
          return { result: null };
        }
        return { result: this.materialBatches.get(batchId) };
      },
      
      getLastBatchId() {
        return { result: { value: this.lastBatchId } };
      }
    }
  }
};

describe('Material Tracking Contract', () => {
  const contract = mockBlockchain.contracts.materialTracking;
  const testUser = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  
  beforeEach(() => {
    // Reset contract state before each test
    contract.lastBatchId = 0;
    contract.materialBatches = new Map();
    mockBlockchain.blockHeight = 100;
  });
  
  it('should record a new material batch', () => {
    const result = contract.recordMaterialBatch(
        testUser,
        1, // productId
        'Aluminum Sheet',
        'MetalCorp Inc.',
        500,
        'kg'
    );
    
    expect(result.result.value).toBe(1);
    expect(contract.lastBatchId).toBe(1);
    
    const batch = contract.getMaterialBatch(1).result;
    expect(batch.materialName).toBe('Aluminum Sheet');
    expect(batch.supplier).toBe('MetalCorp Inc.');
    expect(batch.quantity).toBe(500);
    expect(batch.unit).toBe('kg');
  });
  
  it('should retrieve null for non-existent batch', () => {
    const result = contract.getMaterialBatch(999);
    expect(result.result).toBe(null);
  });
  
  it('should increment batch IDs correctly', () => {
    // Record multiple batches
    contract.recordMaterialBatch(testUser, 1, 'Aluminum', 'Supplier A', 100, 'kg');
    contract.recordMaterialBatch(testUser, 1, 'Steel', 'Supplier B', 200, 'kg');
    contract.recordMaterialBatch(testUser, 1, 'Copper', 'Supplier C', 50, 'kg');
    
    expect(contract.getLastBatchId().result.value).toBe(3);
    
    // Check each batch
    expect(contract.getMaterialBatch(1).result.materialName).toBe('Aluminum');
    expect(contract.getMaterialBatch(2).result.materialName).toBe('Steel');
    expect(contract.getMaterialBatch(3).result.materialName).toBe('Copper');
  });
});
