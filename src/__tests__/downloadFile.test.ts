import { downloadFile } from '@/utils';

describe('downloadFile', () => {
  beforeEach(() => {
    URL.createObjectURL = jest.fn();
    
    document.createElement = jest.fn().mockReturnValue({
      setAttribute: jest.fn(),
      click: jest.fn(),
    });
    
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    global.Blob = jest.fn().mockImplementation((content, options) => ({
      content,
      options,
    }));
  });

  it('should use CSV as default type', () => {
    const content = 'header1,header2\nvalue1,value2';
    const filename = 'test.csv';
    
    downloadFile(content, filename);
    
    expect(global.Blob).toHaveBeenCalledWith(
      [content],
      { type: 'text/csv;charset=utf-8;' }
    );
  });

  it('should accept custom file type', () => {
    const content = '{"key": "value"}';
    const filename = 'test.json';
    const type = 'application/json';
    
    downloadFile(content, filename, type);
    
    expect(global.Blob).toHaveBeenCalledWith(
      [content],
      { type: 'application/json' }
    );
  });
});
