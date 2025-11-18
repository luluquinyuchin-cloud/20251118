let spriteSheet;
let spriteSheet2;
let animation = [];
let animation2 = [];

// 角色 1 的設定
const numberOfFrames1 = 11;
const spriteWidth1 = 281;
const spriteHeight1 = 19;
let frameWidth;

// 角色 2 的設定
const numberOfFrames2 = 9;
const spriteWidth2 = 238;
const spriteHeight2 = 20;
let frameWidth2;

let isPlaying = false; // 動畫預設為暫停
let frameIndex1 = 0; // 角色1目前的影格
let frameIndex2 = 0; // 角色2目前的影格

let song;
let amplitude;

function preload() {
  // 確保在 setup() 和 draw() 開始前載入圖片
  spriteSheet = loadImage('1/1.all.png');
  spriteSheet2 = loadImage('2/2.all.png');
  // 載入背景音樂
  song = loadSound('Gourmet Race - Kirby Super Star.mp3');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 計算單一動畫影格的寬度
  frameWidth = spriteWidth1 / numberOfFrames1;
  frameWidth2 = spriteWidth2 / numberOfFrames2;

  // 建立一個振幅分析器
  amplitude = new p5.Amplitude();

  // 從圖片精靈中裁切出每一個影格並存入 animation 陣列
  for (let i = 0; i < numberOfFrames1; i++) {
    let frame = spriteSheet.get(i * frameWidth, 0, frameWidth, spriteHeight1);
    animation.push(frame);
  }

  // 從第二個圖片精靈中裁切出每一個影格
  for (let i = 0; i < numberOfFrames2; i++) {
    let frame = spriteSheet2.get(i * frameWidth2, 0, frameWidth2, spriteHeight2);
    animation2.push(frame);
  }
}

function draw() {
  // 設定背景顏色
  background('#457b9d');

  // 取得目前的音量大小 (0 to 1)
  let level = amplitude.getLevel();
  // 將音量大小映射到動畫速度。音量越大，animationSpeed 越小，動畫越快
  // map(value, start1, stop1, start2, stop2)
  let animationSpeed = map(level, 0, 0.4, 20, 2); // 將 0~0.4 的音量對應到 20~2 的速度

  // 如果 isPlaying 為 true，才更新動畫影格
  if (isPlaying) {
    frameIndex1 = (frameIndex1 + 1 / animationSpeed) % numberOfFrames1;
    frameIndex2 = (frameIndex2 + 1 / animationSpeed) % numberOfFrames2;
  }
  let currentFrame1 = animation[floor(frameIndex1)];
  let currentFrame2 = animation2[floor(frameIndex2)];

  // 將圖片的繪製模式設定為中心點對齊
  imageMode(CENTER);

  // --- 尺寸調整 ---
  // 在這裡調整大小！例如 2 是放大兩倍，0.5 是縮小一半
  const scaleFactor = 2; 

  const scaledWidth1 = frameWidth * scaleFactor;
  const scaledHeight1 = spriteHeight1 * scaleFactor;
  const scaledWidth2 = frameWidth2 * scaleFactor;
  const scaledHeight2 = spriteHeight2 * scaleFactor;

  // --- 位置計算 ---
  const gap = 20; // 兩個角色之間的間距
  const totalWidth = scaledWidth1 + scaledWidth2 + gap;
  const x1 = width / 2 - totalWidth / 2 + scaledWidth1 / 2;
  const x2 = width / 2 + totalWidth / 2 - scaledWidth2 / 2;

  // 繪製兩個角色，讓它們在 Y 軸上對齊
  image(currentFrame1, x1, height / 2, scaledWidth1, scaledHeight1);
  image(currentFrame2, x2, height / 2, scaledWidth2, scaledHeight2);
}
// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠被按下時，這個函式會被呼叫
function mousePressed() {
  isPlaying = !isPlaying; // 切換播放/暫停狀態

  if (isPlaying) {
    // 如果是開始播放，且音樂尚未播放
    if (!song.isPlaying()) {
      song.loop(); // 開始循環播放音樂
    }
  } else {
    song.pause(); // 如果是暫停，就暫停音樂
  }
}
