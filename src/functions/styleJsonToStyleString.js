// style用jsonを文字列に変換
export default (jsonString) => {
  return JSON.stringify(jsonString)
    .slice(1, -1)
    .replace(/,/g, ';')
    .replace(/"/g, '');
};
