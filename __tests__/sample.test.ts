describe('Sample Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify array operations', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should verify object properties', () => {
    const obj = { name: 'Sea Strike', team: 'cat' };
    expect(obj).toHaveProperty('name');
    expect(obj.team).toBe('cat');
  });
});
