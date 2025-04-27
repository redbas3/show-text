const fs = require('fs');
const path = require('path');

// 파일 읽기
const filePath = path.join(__dirname, 'public', 'data2.txt');
const text = fs.readFileSync(filePath, 'utf8');

// 단어들을 배열로 분리
const words = text.split('、');

// Fisher-Yates 알고리즘으로 섞기
for (let i = words.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [words[i], words[j]] = [words[j], words[i]];
}

// 다시 문자열로 합치기
const shuffledText = words.join('、');

// 파일에 쓰기
fs.writeFileSync(filePath, shuffledText, 'utf8');

console.log('단어들이 랜덤으로 섞였습니다.'); 