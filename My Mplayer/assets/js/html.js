const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const USER_STORAGE_KEY = "Sang-PDA"
const playlist = $(".playlist");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const progress = $(".progress");


const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config : JSON.parse(localStorage.getItem(USER_STORAGE_KEY))|| {},
    setConfig: function (key,value) {
      this.config[key]=value
      localStorage.setItem(USER_STORAGE_KEY,JSON.stringify(this.config))
    },
    loadConfig: function () {
      this.isRandom = this.config.Random
      this.isRepeat = this.config.Repeat
    },
    songs: [
        {
          name: "Ngây Thơ",
          singer: "Tăng Duy Tân",
          path: "./assets/songs/NgayTho-TangDuyTanPhongMax-6590759.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2020/09/04/f/0/b/b/1599194035938_500.jpg"
        },
        {
          name: "Vợ Người Ta",
          singer: "Phan Mạnh Quỳnh",
          path: "./assets/songs/VoNguoiTa-PhanManhQuynh-4109355.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2018/03/11/6/7/d/9/1520771354788_500.jpg"
        },
        {
          name: "Bên Trên Tầng Lầu",
          singer: "Tăng Duy Tân",
          path: "./assets/songs/BenTrenTangLau-TangDuyTan-7412012.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/06/09/d/4/5/e/1654766693061_500.jpg"
            },
        {
          name: "Khi Người Mình Yêu Khóc",
          singer:"Phan Mạnh Quỳnh",
          path: "./assets/songs/Khinguoiminhyeukhoc.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/playlist/2016/01/13/8/1/5/5/1452661529166_500.jpg"
        },
        {
          name: "Ngây Thơ",
          singer: "Tăng Duy Tân",
          path: "./assets/songs/NgayTho-TangDuyTanPhongMax-6590759.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2020/09/04/f/0/b/b/1599194035938_500.jpg"
            },
        {
            name: "Waiting For You",
            singer: "MONO",
            path: "./assets/songs/WaitingForYou-MONOOnionn-7733882.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2022/08/10/4/8/b/1/1660104031203_500.jpg"
        },
        {
            name: "Đế Vương",
            singer: "Đình Dũng",
            path: "./assets/songs/DeVuong-DinhDungACV-7121634.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2021/11/29/a/9/5/0/1638180197658_500.jpg"
        },
        {
          name: "Vẫn Chờ Em",
          singer: "MONO",
          path: "./assets/songs/WaitingForYou-MONOOnionn-7733882.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/08/10/4/8/b/1/1660104031203_500.jpg"
      },
      {
          name: "Phụ Vương",
          singer: "Đình Dũng",
          path: "./assets/songs/DeVuong-DinhDungACV-7121634.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2021/11/29/a/9/5/0/1638180197658_500.jpg"
      }
      ],
      defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
          get: function () {
                    return this.songs[this.currentIndex]
                  }
          })
        },
      //render song in playlist
      render: function() {
        const htmls = this.songs.map((song, index) => {
          return `
                <div class="song ${index==this.currentIndex? "active":""}" data-index = ${index}>
                  <div class="thumb" style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
                </div>`
        })
        playlist.innerHTML = htmls.join("")
      },
      // handlerEvents
      handlerEvents: function () {
        const cdWidth = cd.offsetWidth;
        const player = $(".player");
        const playBtn = $(".btn-toggle-play");
        const nextBtn = $(".btn-next");
        const prevBtn = $(".btn-prev");
        const randomBtn = $(".btn-random");
        const repeatBtn = $(".btn-repeat");
        const songActive = $(".song.active")
        
        const _this = this;
      // cd-thumb rotate
        const cdThumbRotate = cdThumb.animate ([
          {transform: "rotate(360deg)"}
        ],{
          duration: 10000,
          iterations: Infinity
        } )
        cdThumbRotate.pause()

      // hide cd thumb if scroll up
        document.onscroll = function () {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const newCdWidth = cdWidth - scrollY;
          if (newCdWidth > 0) {
            cd.style.width = newCdWidth + 'px';
          }else {
            cd.style.width = 0 + 'px';
          }
          cd.style.opacity = newCdWidth/cdWidth
        },
        //when on click play button
        playBtn.onclick = function () {
          if (_this.isPlaying) {
            audio.pause();
          } else {
            audio.play();
          }
        },
        //handler when audio is playing
        audio.onplay = function () {
          _this.isPlaying = true
          player.classList.add('playing')
          cdThumbRotate.play()
        },
        //handler when audio is pause
        audio.onpause = function () {
          _this.isPlaying = false
          player.classList.remove('playing')
          cdThumbRotate.pause()
        },
        //progress time current
        audio.ontimeupdate = function () {
          let progressPecent = Math.floor((this.currentTime/this.duration)*100)
          if (progressPecent) {
            progress.value = progressPecent
          }
        },
        // handler seek position
        progress.oninput = function () {
          audio.currentTime = progress.value/100*audio.duration
          },
        // DOM next button click handler
        nextBtn.onclick = function () {
          if (_this.isRandom) {
            _this.randomSong()
            } else {
              _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollInterView()
        },
        prevBtn.onclick = function () {
          if (_this.isRandom) {
            _this.randomSong()
            } else {
              _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollInterView()
          },
        //DOM random button click handler
        randomBtn.onclick = function () {
          _this.isRandom = !_this.isRandom
          _this.setConfig("Random", _this.isRandom)
          randomBtn.classList.toggle("active", _this.isRandom)
        },
        //DOM repeat button click handler
        repeatBtn.onclick = function () {
          _this.isRepeat = !_this.isRepeat
          _this.setConfig("Repeat", _this.isRepeat)
          repeatBtn.classList.toggle("active", _this.isRepeat)
        },
        // DOM next song when ended
        audio.onended = function () {
          if (_this.isRepeat) {
            audio.play()
          }else {
            nextBtn.click()
          }
        },
        playlist.onclick = function (e) {
          const songElement = e.target.closest(".song:not(.active)")
          if (songElement || e.target.closest(".option")) {
            if (songElement) {
              _this.currentIndex = songElement.dataset.index
              _this.loadCurrentSong()
              _this.render()
              audio.play()
            }
          }
        }

      },
      // load current Song
      loadCurrentSong: function () {
        const songName = $("header h2");
        songName.textContent = `${this.currentSong.name}`
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
      },
      nextSong: function () { 
        this.currentIndex++
        if (this.currentIndex > this.songs.length-1) {
          this.currentIndex = 0
        }
        this.loadCurrentSong()
        },
      prevSong: function () { 
        this.currentIndex--
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
        },
      randomSong: function () {
        let randomIndex
        do {
          randomIndex = Math.floor(Math.random() * this.songs.length)
        } while (randomIndex === this.currentIndex)
        this.currentIndex = randomIndex
        this.loadCurrentSong()
        },
      scrollInterView: function () {
        $(".song.active").scrollIntoView({behavior: "smooth", block: "end"})
      },
      start: function () {
        this.loadConfig();
        this.defineProperties();
        this.render();
        this.handlerEvents();
        this.loadCurrentSong();
        // load repeat button and random button user
        repeatBtn.classList.toggle("active", this.isRepeat)
        randomBtn.classList.toggle("active", this.isRandom)

      }
}

app.start()

