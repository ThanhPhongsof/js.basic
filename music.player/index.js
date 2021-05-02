const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const header = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const progress = $('#progress');
const playBtn = $('.btn-toggle-play');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeateBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
        name: 'Ánh nắng của anh',
        singer: 'Vợ bong',
        path: './assests/music/anhnangcuaem.mp3',
        image: './assests/img/bong4.jpg',
    },            
    {
        name: 'Nàng thơ',
        singer: 'Vợ bong',
        path: './assests/music/nangtho.mp3',
        image: './assests/img/bong1.jpg',
    },      
    {
      name: 'Missing you',
      singer: 'Vợ bong',
      path: './assests/music/missing-you.mp3',
      image: './assests/img/bong2.jpg',
    },
    {
      name: 'Ngày giận nhau',
      singer: 'Vợ bong',
      path: './assests/music/ngaygiannhau.mp3',
      image: './assests/img/bong3.jpg',
    },
    {
        name: 'Sài gòn đau lòng quá',
        singer: 'Hứa Kim Tuyền',
        path: './assests/music/saigondaulongqua.mp3',
        image: './assests/img/saigondaulongqua.jpg',
    }    
  ],
  render: function () {
    const htmls = this.songs.map((p,index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${p.image}');"></div>
                <div class="body">
                    <h3 class="title">${p.name}</h3>
                    <p class="author">${p.singer}</p>
                </div>
            </div>          
          `;
    });
    $('.playlist').innerHTML = htmls.join('');
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handerEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay tròn và dừng
    const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)'}
    ], {
        duration: 10000,
        iterations: Infinity   
    })
    cdThumbAnimate.pause();

    // Xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.opacity = newCdWidth / cdWidth;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
        if(_this.isPlaying){
            audio.pause();
        }else{
            audio.play();
        }
    }

    // Khi bài hát được chạy (play)
    audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
    }

    // Khi song ngưng chạy (pause)
    audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThumbAnimate.pause();
    }

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
        }
    }

    // Xử lý khi tua nhanh
    progress.onchange = function (e) {
        const seekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime;
    }

    // Khi next Song
    nextBtn.onclick = function () {
        if(_this.isRandom){
            _this.playRandomSong();
        }else{
            _this.nextSong();
        }
        audio.play();
        _this.render();
    }

    // Khi prev Song
    prevBtn.onclick = function () {
        if(_this.isRandom){
            _this.playRandomSong();
        }else{
            _this.prevSong();
        }
        audio.play();
        _this.render();
    }

    // Khi ranbom bài hát
    randomBtn.onclick = function () {
        _this.isRandom = !_this.isRandom; 
        randomBtn.classList.toggle('active',_this.isRandom);

        _this.isRepeat = false;
        repeateBtn.classList.remove('active'); 
    }

    // Khi lặp lại 1 bài hát
    repeateBtn.onclick = function () {
        _this.isRepeat = !this.isRepeat;
        repeateBtn.classList.toggle('active',_this.isRepeat);

        _this.isRandom = false;
        randomBtn.classList.remove('active'); 
    }

    // Xử lý chạy bài hát kế tiếp khi bài hiện tại kết thúc
    audio.onended = function () {
        if(_this.isRepeat){
            audio.play();
        }else{
            nextBtn.click();
        }
    }

    // Lắng nge hành vi click vào playlist
    playlist.onclick = function (e) {
        const songNode = e.target.closest('.song:not(.active)');
        if (songNode) {
            // Xử lý khi click vào song
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
            }
        }
    }
  },
  loadCurrentSong: function () {
    header.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  prevSong: function () {
      this.currentIndex--;
      if(this.currentIndex < 0){
          this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
  },
  nextSong: function () {
      this.currentIndex++;
      if(this.currentIndex >= this.songs.length){
          this.currentIndex = 0;
      }
      this.loadCurrentSong();
  },
  playRandomSong: function () {
      let newIndex = 0;
      do {
          newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex);
      this.currentIndex = newIndex;
      this.loadCurrentSong();
  },
  start: function () {
    this.defineProperties(); // Định nghĩa các thuộc tính cho object
    this.handerEvents(); // Lắng nghe / xử lý các sự kiện (DOM events)
    this.loadCurrentSong(); // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.render(); // Render playlist
  },
};

app.start();
