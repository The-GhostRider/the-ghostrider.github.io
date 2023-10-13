



flowplayer('#player', {
  src: { type: "flowplayer/playlist",
        items: [
    { src: "https://streamtape.com/v/949WV2GmpMHZR4/Docu_Zoo_Low.mp4",
      title: "Docu-Zoo",
      description: "Docu-Zoo #1"
    },
    { src: "https://streamtape.com/v/6kX1mMYM3yFxWd/Zoo-_Pino_MasterFlash.mp4", 
      title: "Pino MasterFlash",
      description: "Pino MasterFlash #2"
    },
    { src: "//edge.flowplayer.org/night3.mp4",
      title: "Helsinki / Night 3",
      description: "Helsinki at Night #3"
    },
    { src: "//edge.flowplayer.org/night5.mp4",
      title: "Helsinki / Night 5",
      description: "Helsinki at Night #5"
    }
  ]},
  playlist: {advance: true, // Whether to auto-advance playlist,
  delay: 0 // 15 seconds between clips} 
            }
  ,token:"eyJraWQiOiJ0QTB3ZXhqODhrUHciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjIjoie1wiYWNsXCI6NixcImlkXCI6XCJ0QTB3ZXhqODhrUHdcIixcImRvbWFpblwiOltcInMuY29kZXBlbi5pb1wiXX0iLCJpc3MiOiJGbG93cGxheWVyIn0.PB25ufW_Kuuf7otErbIK50Q8N73TbP5F8qeCBUbJNqiq81yxjbLUgYkdkyNSRosGRAlkbTmtEUGp8KykRIXzig"
})