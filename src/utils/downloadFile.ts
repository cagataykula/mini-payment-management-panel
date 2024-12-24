export const downloadFile = (
  content: string, 
  filename: string, 
  type: string = 'text/csv;charset=utf-8;'
) => {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};